import { PrismaClient, AdminRole, SettingType, VehicleType } from '@prisma/client';
import {
  SEED_ADMIN_PASSWORD_HASH,
  SEED_EXTRA_SERVICES,
  SEED_FAQ,
  SEED_HERO_IMAGES,
  SEED_TESTIMONIALS,
  SEED_VEHICLE_CATEGORIES,
  SEED_WEBSITE_CONTENT,
} from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ---------------------------------------------------------------------------
  // City — Kyiv as default for Ukraine launch
  // ---------------------------------------------------------------------------
  const kyiv = await prisma.city.upsert({
    where: { slug: 'kyiv' },
    update: {},
    create: {
      name: 'Київ',
      slug: 'kyiv',
      countryCode: 'UA',
      locale: 'uk',
      currency: 'UAH',
      timezone: 'Europe/Kyiv',
      mapCenterLat: 50.4501,
      mapCenterLng: 30.5234,
      mapZoom: 11,
      isActive: true,
      isDefault: false,
    },
  });

  const rivne = await prisma.city.upsert({
    where: { slug: 'rivne' },
    update: {},
    create: {
      name: 'Рівне',
      slug: 'rivne',
      countryCode: 'UA',
      locale: 'uk',
      currency: 'UAH',
      timezone: 'Europe/Kyiv',
      mapCenterLat: 50.6199,
      mapCenterLng: 26.2516,
      mapZoom: 11,
      isActive: true,
      isDefault: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Admin user — change password immediately in production
  // ---------------------------------------------------------------------------
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: SEED_ADMIN_PASSWORD_HASH,
      name: 'Administrator',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Application settings — branding placeholders (configured via Admin Dashboard)
  // ---------------------------------------------------------------------------
  const settings: Array<{
    key: string;
    value: string;
    type: SettingType;
    group: string;
    description: string;
  }> = [
    {
      key: 'company.name',
      value: 'Evakuator24',
      type: SettingType.STRING,
      group: 'branding',
      description: 'Company display name',
    },
    {
      key: 'company.logo_url',
      value: '',
      type: SettingType.STRING,
      group: 'branding',
      description: 'URL to company logo',
    },
    {
      key: 'branding.primary_color',
      value: '#1a1a1a',
      type: SettingType.STRING,
      group: 'branding',
      description: 'Primary brand color (hex)',
    },
    {
      key: 'branding.secondary_color',
      value: '#f5f5f5',
      type: SettingType.STRING,
      group: 'branding',
      description: 'Secondary brand color (hex)',
    },
    {
      key: 'contact.phone',
      value: '+38093 972 20 96',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Main business phone number (+380...)',
    },
    {
      key: 'contact.whatsapp',
      value: '+380939722096',
      type: SettingType.STRING,
      group: 'contact',
      description: 'WhatsApp Business number (+380...)',
    },
    {
      key: 'contact.email',
      value: '',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Business email address',
    },
    {
      key: 'contact.website',
      value: 'https://evakuator24.biz.ua',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Website URL',
    },
    {
      key: 'contact.telegram',
      value: '',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Telegram username or link',
    },
    {
      key: 'contact.viber',
      value: '',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Viber number or link',
    },
    {
      key: 'contact.address',
      value: 'Україна',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Business address',
    },
    {
      key: 'contact.maps_link',
      value: '',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Google Maps link',
    },
    {
      key: 'contact.social_links',
      value: JSON.stringify({}),
      type: SettingType.JSON,
      group: 'contact',
      description: 'Social media links (JSON object)',
    },
    {
      key: 'business.working_hours',
      value: 'Цілодобово',
      type: SettingType.STRING,
      group: 'business',
      description: 'Displayed working hours',
    },
    {
      key: 'locale.country_code',
      value: 'UA',
      type: SettingType.STRING,
      group: 'locale',
      description: 'ISO 3166-1 alpha-2 country code',
    },
    {
      key: 'locale.language',
      value: 'uk',
      type: SettingType.STRING,
      group: 'locale',
      description: 'Default interface language (BCP 47)',
    },
    {
      key: 'locale.currency',
      value: 'UAH',
      type: SettingType.STRING,
      group: 'locale',
      description: 'ISO 4217 currency code',
    },
    {
      key: 'locale.timezone',
      value: 'Europe/Kyiv',
      type: SettingType.STRING,
      group: 'locale',
      description: 'IANA timezone identifier',
    },
    {
      key: 'maps.center_lat',
      value: '50.6199',
      type: SettingType.NUMBER,
      group: 'maps',
      description: 'Default map center latitude',
    },
    {
      key: 'maps.center_lng',
      value: '26.2516',
      type: SettingType.NUMBER,
      group: 'maps',
      description: 'Default map center longitude',
    },
    {
      key: 'maps.zoom',
      value: '11',
      type: SettingType.NUMBER,
      group: 'maps',
      description: 'Default map zoom level',
    },
    {
      key: 'seo.title',
      value: 'Evakuator24 — Евакуатор за 30 секунд',
      type: SettingType.STRING,
      group: 'seo',
      description: 'SEO title',
    },
    {
      key: 'seo.description',
      value: 'Професійна служба евакуації автомобілів в Україні. Швидкий розрахунок вартості, онлайн-замовлення, цілодобова підтримка.',
      type: SettingType.STRING,
      group: 'seo',
      description: 'SEO description',
    },
    {
      key: 'seo.keywords',
      value: 'евакуатор, евакуація авто, евакуатор 24/7, евакуатор по Україні',
      type: SettingType.STRING,
      group: 'seo',
      description: 'SEO keywords',
    },
    {
      key: 'seo.og_image',
      value: '/opengraph-image',
      type: SettingType.STRING,
      group: 'seo',
      description: 'Open Graph image URL',
    },
    {
      key: 'seo.canonical_url',
      value: 'https://evakuator24.biz.ua',
      type: SettingType.STRING,
      group: 'seo',
      description: 'Canonical URL',
    },
    {
      key: 'service_area.mode',
      value: 'regions',
      type: SettingType.STRING,
      group: 'service_area',
      description: 'Service area mode: regions or radius',
    },
    {
      key: 'service_area.allowed_regions',
      value: JSON.stringify(['рівненська область', 'rivne oblast']),
      type: SettingType.JSON,
      group: 'service_area',
      description: 'Allowed administrative regions',
    },
    {
      key: 'service_area.out_of_coverage_message',
      value: 'На жаль, обраний маршрут знаходиться поза зоною обслуговування. Спробуйте іншу адресу або звʼяжіться з диспетчером.',
      type: SettingType.STRING,
      group: 'service_area',
      description: 'Out of coverage message',
    },
    {
      key: 'service_area.available_message',
      value: 'Евакуація доступна по всій Україні',
      type: SettingType.STRING,
      group: 'service_area',
      description: 'Available message',
    },
    {
      key: 'service_area.name',
      value: 'По всій Україні',
      type: SettingType.STRING,
      group: 'service_area',
      description: 'Service area display name',
    },
    {
      key: 'service_area.validation_enabled',
      value: 'false',
      type: SettingType.BOOLEAN,
      group: 'service_area',
      description: 'Enable service area validation in calculator',
    },
    {
      key: 'content.hero.badge',
      value: SEED_WEBSITE_CONTENT.heroBadge,
      type: SettingType.STRING,
      group: 'content',
      description: 'Hero badge text',
    },
    {
      key: 'content.hero.title',
      value: SEED_WEBSITE_CONTENT.heroTitle,
      type: SettingType.STRING,
      group: 'content',
      description: 'Hero title',
    },
    {
      key: 'content.hero.title_highlight',
      value: SEED_WEBSITE_CONTENT.heroTitleHighlight,
      type: SettingType.STRING,
      group: 'content',
      description: 'Hero title highlight',
    },
    {
      key: 'content.hero.subtitle',
      value: SEED_WEBSITE_CONTENT.heroSubtitle,
      type: SettingType.STRING,
      group: 'content',
      description: 'Hero subtitle',
    },
    {
      key: 'content.hero.cta_primary',
      value: SEED_WEBSITE_CONTENT.heroCtaPrimary,
      type: SettingType.STRING,
      group: 'content',
      description: 'Hero primary CTA',
    },
    {
      key: 'content.hero.cta_secondary',
      value: SEED_WEBSITE_CONTENT.heroCtaSecondary,
      type: SettingType.STRING,
      group: 'content',
      description: 'Hero secondary CTA',
    },
    {
      key: 'content.hero.trust_items',
      value: JSON.stringify(SEED_WEBSITE_CONTENT.heroTrustItems),
      type: SettingType.JSON,
      group: 'content',
      description: 'Hero trust items',
    },
    {
      key: 'content.about.title',
      value: SEED_WEBSITE_CONTENT.aboutTitle,
      type: SettingType.STRING,
      group: 'content',
      description: 'About page title',
    },
    {
      key: 'content.about.body',
      value: SEED_WEBSITE_CONTENT.aboutBody,
      type: SettingType.STRING,
      group: 'content',
      description: 'About page body',
    },
    {
      key: 'content.footer_tagline',
      value: SEED_WEBSITE_CONTENT.footerTagline,
      type: SettingType.STRING,
      group: 'content',
      description: 'Footer tagline',
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        type: setting.type,
        group: setting.group,
      },
      create: {
        ...setting,
        updatedById: admin.id,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Default pricing rule — all surcharges admin-configurable
  // ---------------------------------------------------------------------------
  const pricingRule = await prisma.pricingRule.upsert({
    where: { id: 'seed-default-pricing' },
    update: {
      baseFee: 900,
      outsideCityBaseFee: 900,
      freeKm: 0,
      minCharge: 900,
      perKmRate: 25,
      cityPerKmRate: 25,
      outsideCityPerKmRate: 30,
      emergencySurchargeFlat: 300,
      nightSurchargePercent: 20,
      weekendSurchargePercent: 15,
      holidaySurchargePercent: 30,
      difficultLoadingSurcharge: 500,
      cityId: rivne.id,
    },
    create: {
      id: 'seed-default-pricing',
      name: 'Стандартний тариф',
      cityId: rivne.id,
      baseFee: 900,
      outsideCityBaseFee: 900,
      freeKm: 0,
      perKmRate: 25,
      cityPerKmRate: 25,
      outsideCityPerKmRate: 30,
      minCharge: 900,
      emergencySurchargeFlat: 300,
      nightSurchargePercent: 20,
      nightStartHour: 22,
      nightEndHour: 6,
      weekendSurchargePercent: 15,
      holidaySurchargePercent: 30,
      difficultLoadingSurcharge: 500,
      isActive: true,
    },
  });

  const vehicleSurcharges: Array<{ vehicleType: VehicleType; amount: number }> = [
    { vehicleType: VehicleType.PASSENGER_CAR, amount: 0 },
    { vehicleType: VehicleType.SUV, amount: 100 },
    { vehicleType: VehicleType.VAN, amount: 200 },
    { vehicleType: VehicleType.TRUCK, amount: 400 },
    { vehicleType: VehicleType.MOTORCYCLE, amount: 0 },
    { vehicleType: VehicleType.OTHER, amount: 150 },
  ];

  for (const surcharge of vehicleSurcharges) {
    await prisma.vehicleTypeSurcharge.upsert({
      where: {
        pricingRuleId_vehicleType: {
          pricingRuleId: pricingRule.id,
          vehicleType: surcharge.vehicleType,
        },
      },
      update: { amount: surcharge.amount },
      create: {
        pricingRuleId: pricingRule.id,
        vehicleType: surcharge.vehicleType,
        amount: surcharge.amount,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Service area — Kyiv radius coverage (approximate)
  // ---------------------------------------------------------------------------
  await prisma.serviceArea.upsert({
    where: { id: 'seed-rivne-radius' },
    update: {
      name: 'По всій Україні',
      centerLat: 50.6199,
      centerLng: 26.2516,
      radiusKm: 80,
      cityId: rivne.id,
      isActive: true,
    },
    create: {
      id: 'seed-rivne-radius',
      name: 'По всій Україні',
      type: 'RADIUS',
      cityId: rivne.id,
      centerLat: 50.6199,
      centerLng: 26.2516,
      radiusKm: 80,
      surchargeAmount: 0,
      isActive: true,
      priority: 0,
    },
  });

  for (const category of SEED_VEHICLE_CATEGORIES) {
    await prisma.vehicleCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const service of SEED_EXTRA_SERVICES) {
    await prisma.extraService.upsert({
      where: { slug: service.slug },
      update: {
        ...service,
        config: service.config as object,
      },
      create: {
        ...service,
        config: service.config as object,
      },
    });
  }

  for (const item of SEED_FAQ) {
    const existing = await prisma.faqItem.findFirst({ where: { question: item.question } });
    if (!existing) {
      await prisma.faqItem.create({ data: item });
    }
  }

  for (const item of SEED_TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { name: item.name, city: item.city } });
    if (!existing) {
      await prisma.testimonial.create({ data: item });
    }
  }

  // ---------------------------------------------------------------------------
  // Hero images — migrate legacy paths, then ensure tow-truck.png exists
  // ---------------------------------------------------------------------------
  const LEGACY_HERO_URLS = [
    '/images/tow-truck-transparent.png',
    '/images/tow-truck.png',
    '/images/hero-background.webp',
    '/images/hero-background.png',
    '/hero-background.webp',
  ] as const;

  await prisma.heroImage.updateMany({
    where: { url: { in: [...LEGACY_HERO_URLS] } },
    data: { url: '/tow-truck.png' },
  });

  for (const image of SEED_HERO_IMAGES) {
    const existing = await prisma.heroImage.findFirst({ where: { url: image.url } });
    if (!existing) {
      const activeLegacy = await prisma.heroImage.findFirst({
        where: { isActive: true, url: { not: image.url } },
        orderBy: { sortOrder: 'asc' },
      });

      if (activeLegacy) {
        await prisma.heroImage.update({
          where: { id: activeLegacy.id },
          data: {
            url: image.url,
            alt: image.alt,
            variant: image.variant,
          },
        });
      } else {
        await prisma.heroImage.create({ data: image });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Ukrainian public holidays (recurring annually)
  // ---------------------------------------------------------------------------
  const currentYear = new Date().getFullYear();
  const holidays = [
    { name: 'Новий рік', month: 1, day: 1 },
    { name: 'Різдво Христове (православне)', month: 1, day: 7 },
    { name: 'Міжнародний жіночий день', month: 3, day: 8 },
    { name: 'День праці', month: 5, day: 1 },
    { name: 'День перемоги', month: 5, day: 9 },
    { name: 'День Конституції України', month: 6, day: 28 },
    { name: 'День Державного Прапора', month: 8, day: 23 },
    { name: 'День Незалежності України', month: 8, day: 24 },
    { name: 'День Захисників та Захисниць', month: 10, day: 1 },
    { name: 'Різдво Христове (католицьке)', month: 12, day: 25 },
  ];

  for (const holiday of holidays) {
    const date = new Date(Date.UTC(currentYear, holiday.month - 1, holiday.day));

    const existing = await prisma.holiday.findFirst({
      where: { date, countryCode: 'UA', cityId: null },
    });

    if (!existing) {
      await prisma.holiday.create({
        data: {
          name: holiday.name,
          date,
          isRecurring: true,
          countryCode: 'UA',
        },
      });
    }
  }

  console.log('Seed completed successfully.');
  console.log(`  City: ${rivne.name} (${rivne.slug})`);
  console.log(`  Admin: ${admin.email} (password: ChangeMe123!)`);
  console.log(`  Pricing rule: ${pricingRule.name}`);
  console.log(`  Settings: ${settings.length} keys`);
  console.log(`  Holidays: ${holidays.length} Ukrainian public holidays`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
