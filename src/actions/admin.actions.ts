'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { upsertSettingsBatch } from '@/modules/settings/settings.repository';
import { SETTING_KEYS } from '@/modules/settings/settings.defaults';
import { revalidateSettingsCache } from '@/modules/settings/settings.service';
import { revalidatePricingCache } from '@/modules/pricing/pricing.service';
import { SettingType, ExtraServiceType, HeroImageVariant } from '@prisma/client';

function revalidatePublicSite() {
  revalidateTag(revalidateSettingsCache());
  revalidateTag(revalidatePricingCache());
  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/faq');
}

async function getAdminId() {
  const session = await requireAdmin();
  return session.user.id!;
}

export async function savePricingAction(formData: FormData) {
  await getAdminId();
  const ruleId = formData.get('ruleId')?.toString();

  const data = {
    name: formData.get('name')?.toString() || 'Стандартний тариф',
    baseFee: Number(formData.get('baseFee') || 0),
    minCharge: Number(formData.get('minCharge') || 0),
    perKmRate: Number(formData.get('perKmRate') || 0),
    cityPerKmRate: Number(formData.get('cityPerKmRate') || 0),
    outsideCityPerKmRate: Number(formData.get('outsideCityPerKmRate') || 0),
    emergencySurchargeFlat: Number(formData.get('emergencySurchargeFlat') || 0),
    nightSurchargePercent: Number(formData.get('nightSurchargePercent') || 0),
    nightStartHour: Number(formData.get('nightStartHour') || 22),
    nightEndHour: Number(formData.get('nightEndHour') || 6),
    weekendSurchargePercent: Number(formData.get('weekendSurchargePercent') || 0),
    holidaySurchargePercent: Number(formData.get('holidaySurchargePercent') || 0),
    difficultLoadingSurcharge: Number(formData.get('difficultLoadingSurcharge') || 0),
    isActive: true,
  };

  if (ruleId) {
    await prisma.pricingRule.update({ where: { id: ruleId }, data });
  } else {
    await prisma.pricingRule.create({ data });
  }

  revalidatePublicSite();
}

export async function saveContactsAction(formData: FormData) {
  const adminId = await getAdminId();

  await upsertSettingsBatch(
    [
      { key: SETTING_KEYS.COMPANY_NAME, value: formData.get('companyName')?.toString() || '', group: 'branding', type: SettingType.STRING },
      { key: SETTING_KEYS.PHONE, value: formData.get('phone')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.WHATSAPP_NUMBER, value: formData.get('whatsapp')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.TELEGRAM, value: formData.get('telegram')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.VIBER, value: formData.get('viber')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.EMAIL, value: formData.get('email')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.ADDRESS, value: formData.get('address')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.MAPS_LINK, value: formData.get('mapsLink')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.WEBSITE_URL, value: formData.get('websiteUrl')?.toString() || '', group: 'contact', type: SettingType.STRING },
      { key: SETTING_KEYS.WORKING_HOURS, value: formData.get('workingHours')?.toString() || '', group: 'business', type: SettingType.STRING },
    ],
    adminId,
  );

  revalidatePublicSite();
}

export async function saveSeoAction(formData: FormData) {
  const adminId = await getAdminId();

  await upsertSettingsBatch(
    [
      { key: SETTING_KEYS.SEO_TITLE, value: formData.get('title')?.toString() || '', group: 'seo', type: SettingType.STRING },
      { key: SETTING_KEYS.SEO_DESCRIPTION, value: formData.get('description')?.toString() || '', group: 'seo', type: SettingType.STRING },
      { key: SETTING_KEYS.SEO_KEYWORDS, value: formData.get('keywords')?.toString() || '', group: 'seo', type: SettingType.STRING },
      { key: SETTING_KEYS.SEO_OG_IMAGE, value: formData.get('ogImage')?.toString() || '', group: 'seo', type: SettingType.STRING },
      { key: SETTING_KEYS.SEO_CANONICAL_URL, value: formData.get('canonicalUrl')?.toString() || '', group: 'seo', type: SettingType.STRING },
    ],
    adminId,
  );

  revalidatePublicSite();
}

export async function saveServiceAreaAction(formData: FormData) {
  const adminId = await getAdminId();
  const mode = formData.get('mode')?.toString() === 'radius' ? 'radius' : 'regions';
  const regionsRaw = formData.get('allowedRegions')?.toString() || '';
  const allowedRegions = regionsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  await upsertSettingsBatch(
    [
      { key: SETTING_KEYS.SERVICE_AREA_MODE, value: mode, group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.SERVICE_AREA_REGIONS, value: JSON.stringify(allowedRegions), group: 'service_area', type: SettingType.JSON },
      { key: SETTING_KEYS.SERVICE_AREA_MESSAGE, value: formData.get('outOfCoverageMessage')?.toString() || '', group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.SERVICE_AREA_AVAILABLE_MESSAGE, value: formData.get('availableMessage')?.toString() || '', group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.SERVICE_AREA_NAME, value: formData.get('areaName')?.toString() || '', group: 'service_area', type: SettingType.STRING },
    ],
    adminId,
  );

  const areaId = formData.get('areaId')?.toString();
  const radiusData = {
    name: formData.get('radiusName')?.toString() || 'Зона обслуговування',
    type: 'RADIUS' as const,
    centerLat: Number(formData.get('centerLat') || 0),
    centerLng: Number(formData.get('centerLng') || 0),
    radiusKm: Number(formData.get('radiusKm') || 0),
    surchargeAmount: Number(formData.get('radiusSurcharge') || 0),
    isActive: mode === 'radius',
  };

  if (areaId) {
    await prisma.serviceArea.update({ where: { id: areaId }, data: radiusData });
  } else if (mode === 'radius') {
    await prisma.serviceArea.create({ data: radiusData });
  }

  revalidatePublicSite();
}

export async function saveVehicleCategoryAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();

  const data = {
    slug: formData.get('slug')?.toString() || '',
    label: formData.get('label')?.toString() || '',
    perKmRate: Number(formData.get('perKmRate') || 0),
    flatSurcharge: Number(formData.get('flatSurcharge') || 0),
    sortOrder: Number(formData.get('sortOrder') || 0),
    isActive: formData.get('isActive') === 'on',
  };

  if (id) {
    await prisma.vehicleCategory.update({ where: { id }, data });
  } else {
    await prisma.vehicleCategory.create({ data });
  }

  revalidatePublicSite();
}

export async function deleteVehicleCategoryAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.vehicleCategory.delete({ where: { id } });
  revalidatePublicSite();
}

export async function saveExtraServiceAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  const type = formData.get('type')?.toString() === 'PERCENT' ? ExtraServiceType.PERCENT : ExtraServiceType.FLAT;

  const data = {
    slug: formData.get('slug')?.toString() || '',
    label: formData.get('label')?.toString() || '',
    type,
    amount: Number(formData.get('amount') || 0),
    enabled: formData.get('enabled') === 'on',
    sortOrder: Number(formData.get('sortOrder') || 0),
    isActive: formData.get('isActive') !== 'off',
    config: JSON.parse(formData.get('config')?.toString() || '{}'),
  };

  if (id) {
    await prisma.extraService.update({ where: { id }, data });
  } else {
    await prisma.extraService.create({ data });
  }

  revalidatePublicSite();
}

export async function deleteExtraServiceAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.extraService.delete({ where: { id } });
  revalidatePublicSite();
}

export async function saveFaqAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  const data = {
    question: formData.get('question')?.toString() || '',
    answer: formData.get('answer')?.toString() || '',
    sortOrder: Number(formData.get('sortOrder') || 0),
    isActive: formData.get('isActive') === 'on',
  };

  if (id) {
    await prisma.faqItem.update({ where: { id }, data });
  } else {
    await prisma.faqItem.create({ data });
  }

  revalidatePublicSite();
}

export async function deleteFaqAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.faqItem.delete({ where: { id } });
  revalidatePublicSite();
}

export async function saveTestimonialAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  const data = {
    initials: formData.get('initials')?.toString() || '',
    avatarGradient: formData.get('avatarGradient')?.toString() || 'from-sky-500/40 to-blue-600/30',
    name: formData.get('name')?.toString() || '',
    city: formData.get('city')?.toString() || '',
    review: formData.get('review')?.toString() || '',
    serviceType: formData.get('serviceType')?.toString() || '',
    sortOrder: Number(formData.get('sortOrder') || 0),
    isActive: formData.get('isActive') === 'on',
  };

  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
  } else {
    await prisma.testimonial.create({ data });
  }

  revalidatePublicSite();
}

export async function deleteTestimonialAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePublicSite();
}

export async function saveHeroImageAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  const variant = (formData.get('variant')?.toString() || 'BOTH') as HeroImageVariant;

  const data = {
    url: formData.get('url')?.toString() || '',
    alt: formData.get('alt')?.toString() || '',
    variant,
    sortOrder: Number(formData.get('sortOrder') || 0),
    isActive: formData.get('isActive') === 'on',
  };

  if (id) {
    await prisma.heroImage.update({ where: { id }, data });
  } else {
    await prisma.heroImage.create({ data });
  }

  revalidatePublicSite();
}

export async function deleteHeroImageAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.heroImage.delete({ where: { id } });
  revalidatePublicSite();
}
