'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { upsertSettingsBatch } from '@/modules/settings/settings.repository';
import { SETTING_KEYS } from '@/modules/settings/settings.defaults';
import { revalidateSettingsCache } from '@/modules/settings/settings.service';
import { revalidatePricingCache } from '@/modules/pricing/pricing.service';
import { oblastLabelsForIds } from '@/lib/ukraine-oblasts';
import { SettingType, ExtraServiceType, HeroImageVariant } from '@prisma/client';

function revalidatePublicSite() {
  revalidateTag(revalidateSettingsCache());
  revalidateTag(revalidatePricingCache());
  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/faq');
}

function savedRedirect(path: string) {
  redirect(`${path}?saved=1`);
}

async function getAdminId() {
  const session = await requireAdmin();
  return session.user.id!;
}

export async function savePricingAction(formData: FormData) {
  const adminId = await getAdminId();
  const ruleId = formData.get('ruleId')?.toString();
  const cityServiceRadiusKm = Number(formData.get('cityServiceRadiusKm') || 0);

  const data = {
    name: formData.get('name')?.toString() || 'Стандартний тариф',
    baseFee: Number(formData.get('baseFee') || 0),
    outsideCityBaseFee: Number(formData.get('outsideCityBaseFee') || formData.get('baseFee') || 0),
    freeKm: Number(formData.get('freeKm') || 0),
    minCharge: Number(formData.get('minCharge') || 0),
    perKmRate: Number(formData.get('perKmRate') || 0),
    cityPerKmRate: Number(formData.get('cityPerKmRate') || formData.get('perKmRate') || 0),
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

  if (cityServiceRadiusKm > 0) {
    await upsertSettingsBatch(
      [
        {
          key: SETTING_KEYS.CITY_SERVICE_RADIUS_KM,
          value: String(cityServiceRadiusKm),
          group: 'pricing',
          type: SettingType.NUMBER,
        },
      ],
      adminId,
    );

    const area = await prisma.serviceArea.findFirst({ where: { isActive: true }, orderBy: { priority: 'asc' } });
    if (area) {
      await prisma.serviceArea.update({
        where: { id: area.id },
        data: { radiusKm: cityServiceRadiusKm },
      });
    }
  }

  revalidatePublicSite();
  savedRedirect('/admin/pricing');
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
  savedRedirect('/admin/contacts');
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
  savedRedirect('/admin/seo');
}

export async function saveServiceAreaAction(formData: FormData) {
  const adminId = await getAdminId();
  const mode = formData.get('mode')?.toString() === 'radius' ? 'radius' : 'regions';
  const selectedOblastIds = formData.getAll('oblastIds').map(String);
  const allowedRegions =
    selectedOblastIds.length > 0
      ? oblastLabelsForIds(selectedOblastIds)
      : (formData.get('allowedRegions')?.toString() || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

  const homeCityId = formData.get('homeCityId')?.toString() || '';
  const freeCityRadiusKm = Number(formData.get('freeCityRadiusKm') || 0);

  await upsertSettingsBatch(
    [
      { key: SETTING_KEYS.SERVICE_AREA_MODE, value: mode, group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.SERVICE_AREA_REGIONS, value: JSON.stringify(allowedRegions), group: 'service_area', type: SettingType.JSON },
      { key: SETTING_KEYS.SERVICE_AREA_OBLAST_IDS, value: JSON.stringify(selectedOblastIds), group: 'service_area', type: SettingType.JSON },
      { key: SETTING_KEYS.SERVICE_AREA_MESSAGE, value: formData.get('outOfCoverageMessage')?.toString() || '', group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.SERVICE_AREA_AVAILABLE_MESSAGE, value: formData.get('availableMessage')?.toString() || '', group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.SERVICE_AREA_NAME, value: formData.get('areaName')?.toString() || '', group: 'service_area', type: SettingType.STRING },
      {
        key: SETTING_KEYS.SERVICE_AREA_VALIDATION_ENABLED,
        value: formData.get('validationEnabled') === 'on' ? 'true' : 'false',
        group: 'service_area',
        type: SettingType.BOOLEAN,
      },
      { key: SETTING_KEYS.HOME_CITY_ID, value: homeCityId, group: 'service_area', type: SettingType.STRING },
      { key: SETTING_KEYS.FREE_CITY_RADIUS_KM, value: String(freeCityRadiusKm), group: 'service_area', type: SettingType.NUMBER },
    ],
    adminId,
  );

  if (homeCityId) {
    await prisma.city.updateMany({ data: { isDefault: false } });
    await prisma.city.update({ where: { id: homeCityId }, data: { isDefault: true, isActive: true } });
  }

  const areaId = formData.get('areaId')?.toString();
  const radiusKm = Number(formData.get('radiusKm') || formData.get('cityServiceRadiusKm') || 50);
  const radiusData = {
    name: formData.get('radiusName')?.toString() || 'Зона обслуговування',
    type: 'RADIUS' as const,
    centerLat: Number(formData.get('centerLat') || 0),
    centerLng: Number(formData.get('centerLng') || 0),
    radiusKm,
    surchargeAmount: Number(formData.get('radiusSurcharge') || 0),
    isActive: mode === 'radius',
    cityId: homeCityId || null,
  };

  if (areaId) {
    await prisma.serviceArea.update({ where: { id: areaId }, data: radiusData });
  } else if (mode === 'radius') {
    await prisma.serviceArea.create({ data: radiusData });
  }

  await upsertSettingsBatch(
    [{ key: SETTING_KEYS.CITY_SERVICE_RADIUS_KM, value: String(radiusKm), group: 'pricing', type: SettingType.NUMBER }],
    adminId,
  );

  revalidatePublicSite();
  savedRedirect('/admin/service-areas');
}

export async function saveCitiesAction(formData: FormData) {
  await getAdminId();
  const cities = await prisma.city.findMany();

  for (const city of cities) {
    const isActive = formData.get(`city_active_${city.id}`) === 'on';
    await prisma.city.update({ where: { id: city.id }, data: { isActive } });
  }

  revalidatePublicSite();
  savedRedirect('/admin/service-areas');
}

export async function saveVehicleCategoryAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();

  const data = {
    slug: formData.get('slug')?.toString() || '',
    label: formData.get('label')?.toString() || '',
    description: formData.get('description')?.toString() || null,
    icon: formData.get('icon')?.toString() || null,
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
  savedRedirect('/admin/vehicle-types');
}

export async function deleteVehicleCategoryAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.vehicleCategory.delete({ where: { id } });
  revalidatePublicSite();
  savedRedirect('/admin/vehicle-types');
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
  savedRedirect('/admin/extra-services');
}

export async function deleteExtraServiceAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.extraService.delete({ where: { id } });
  revalidatePublicSite();
  savedRedirect('/admin/extra-services');
}

export async function saveFaqAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  const data = {
    question: formData.get('question')?.toString() || '',
    answer: formData.get('answer')?.toString() || '',
    sortOrder: Number(formData.get('sortOrder') || 0),
    isActive: id ? formData.get('isActive') === 'on' : formData.get('isActive') !== 'off',
  };

  if (id) {
    await prisma.faqItem.update({ where: { id }, data });
  } else {
    await prisma.faqItem.create({ data });
  }

  revalidatePublicSite();
  savedRedirect('/admin/faq');
}

export async function deleteFaqAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.faqItem.delete({ where: { id } });
  revalidatePublicSite();
  savedRedirect('/admin/faq');
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
    isActive: id ? formData.get('isActive') === 'on' : formData.get('isActive') !== 'off',
  };

  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
  } else {
    await prisma.testimonial.create({ data });
  }

  revalidatePublicSite();
  savedRedirect('/admin/reviews');
}

export async function deleteTestimonialAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePublicSite();
  savedRedirect('/admin/reviews');
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
  savedRedirect('/admin/settings');
}

export async function deleteHeroImageAction(formData: FormData) {
  await getAdminId();
  const id = formData.get('id')?.toString();
  if (!id) return;
  await prisma.heroImage.delete({ where: { id } });
  revalidatePublicSite();
  savedRedirect('/admin/settings');
}

export async function saveSettingsAction(formData: FormData) {
  const adminId = await getAdminId();

  const socialLinks = {
    instagram: formData.get('instagram')?.toString() || '',
    telegram: formData.get('telegramSocial')?.toString() || '',
    facebook: formData.get('facebook')?.toString() || '',
    youtube: formData.get('youtube')?.toString() || '',
  };

  await upsertSettingsBatch(
    [
      { key: SETTING_KEYS.LOGO_URL, value: formData.get('logoUrl')?.toString() || '', group: 'branding', type: SettingType.STRING },
      { key: SETTING_KEYS.FAVICON_URL, value: formData.get('faviconUrl')?.toString() || '', group: 'branding', type: SettingType.STRING },
      { key: SETTING_KEYS.PRIMARY_COLOR, value: formData.get('primaryColor')?.toString() || '', group: 'branding', type: SettingType.STRING },
      { key: SETTING_KEYS.SECONDARY_COLOR, value: formData.get('secondaryColor')?.toString() || '', group: 'branding', type: SettingType.STRING },
      { key: SETTING_KEYS.SOCIAL_LINKS, value: JSON.stringify(socialLinks), group: 'contact', type: SettingType.JSON },
      { key: SETTING_KEYS.MAP_CENTER_LAT, value: formData.get('mapCenterLat')?.toString() || '', group: 'maps', type: SettingType.NUMBER },
      { key: SETTING_KEYS.MAP_CENTER_LNG, value: formData.get('mapCenterLng')?.toString() || '', group: 'maps', type: SettingType.NUMBER },
      { key: SETTING_KEYS.MAP_ZOOM, value: formData.get('mapZoom')?.toString() || '', group: 'maps', type: SettingType.NUMBER },
    ],
    adminId,
  );

  revalidatePublicSite();
  savedRedirect('/admin/settings');
}

export async function saveContentAction(formData: FormData) {
  const adminId = await getAdminId();

  const trustItemsRaw = formData.get('trustItems')?.toString() || '[]';
  let trustItems = trustItemsRaw;
  try {
    JSON.parse(trustItemsRaw);
  } catch {
    trustItems = '[]';
  }

  await upsertSettingsBatch(
    [
      { key: SETTING_KEYS.HERO_BADGE, value: formData.get('heroBadge')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.HERO_TITLE, value: formData.get('heroTitle')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.HERO_TITLE_HIGHLIGHT, value: formData.get('heroTitleHighlight')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.HERO_SUBTITLE, value: formData.get('heroSubtitle')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.HERO_CTA_PRIMARY, value: formData.get('heroCtaPrimary')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.HERO_CTA_SECONDARY, value: formData.get('heroCtaSecondary')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.HERO_TRUST_ITEMS, value: trustItems, group: 'content', type: SettingType.JSON },
      { key: SETTING_KEYS.ABOUT_TITLE, value: formData.get('aboutTitle')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.ABOUT_BODY, value: formData.get('aboutBody')?.toString() || '', group: 'content', type: SettingType.STRING },
      { key: SETTING_KEYS.FOOTER_TAGLINE, value: formData.get('footerTagline')?.toString() || '', group: 'content', type: SettingType.STRING },
    ],
    adminId,
  );

  revalidatePublicSite();
  revalidatePath('/about');
  savedRedirect('/admin/content');
}

export async function saveGalleryAction(formData: FormData) {
  const adminId = await getAdminId();
  const imagesJson = formData.get('galleryImages')?.toString() || '[]';

  try {
    JSON.parse(imagesJson);
  } catch {
    throw new Error('Invalid gallery JSON');
  }

  await upsertSettingsBatch(
    [{ key: SETTING_KEYS.GALLERY_IMAGES, value: imagesJson, group: 'media', type: SettingType.JSON }],
    adminId,
  );

  revalidatePublicSite();
  savedRedirect('/admin/settings');
}

export async function saveAdminSecurityAction(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id!;
  const currentPassword = formData.get('currentPassword')?.toString() || '';
  const newEmail = formData.get('newEmail')?.toString()?.trim() || '';
  const newPassword = formData.get('newPassword')?.toString() || '';
  const confirmPassword = formData.get('confirmPassword')?.toString() || '';

  const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!admin) {
    redirect('/admin/settings?error=admin_not_found');
  }

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) {
    redirect('/admin/settings?error=invalid_password');
  }

  const data: { email?: string; passwordHash?: string } = {};

  if (newEmail && newEmail !== admin.email) {
    const existing = await prisma.adminUser.findUnique({ where: { email: newEmail } });
    if (existing && existing.id !== adminId) {
      redirect('/admin/settings?error=email_taken');
    }
    data.email = newEmail;
  }

  if (newPassword) {
    if (newPassword.length < 8) {
      redirect('/admin/settings?error=password_short');
    }
    if (newPassword !== confirmPassword) {
      redirect('/admin/settings?error=password_mismatch');
    }
    data.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  if (Object.keys(data).length > 0) {
    await prisma.adminUser.update({ where: { id: adminId }, data });
  }

  savedRedirect('/admin/settings');
}
