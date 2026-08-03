import { PrismaClient, AdminRole, SettingType, VehicleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      isDefault: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Admin user — change password immediately in production
  // ---------------------------------------------------------------------------
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
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
      value: '',
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
      value: '',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Main business phone number (+380...)',
    },
    {
      key: 'contact.whatsapp',
      value: '',
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
      value: '',
      type: SettingType.STRING,
      group: 'contact',
      description: 'Website URL',
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
      value: '50.4501',
      type: SettingType.NUMBER,
      group: 'maps',
      description: 'Default map center latitude',
    },
    {
      key: 'maps.center_lng',
      value: '30.5234',
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
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
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
    update: {},
    create: {
      id: 'seed-default-pricing',
      name: 'Стандартний тариф',
      cityId: kyiv.id,
      baseFee: 500,
      perKmRate: 25,
      minCharge: 700,
      nightSurchargePercent: 25,
      nightStartHour: 22,
      nightEndHour: 6,
      weekendSurchargePercent: 15,
      holidaySurchargePercent: 30,
      difficultLoadingSurcharge: 300,
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
    where: { id: 'seed-kyiv-radius' },
    update: {},
    create: {
      id: 'seed-kyiv-radius',
      name: 'Київ та область',
      type: 'RADIUS',
      cityId: kyiv.id,
      centerLat: 50.4501,
      centerLng: 30.5234,
      radiusKm: 50,
      surchargeAmount: 0,
      isActive: true,
      priority: 0,
    },
  });

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

    await prisma.holiday.upsert({
      where: {
        date_countryCode_cityId: {
          date,
          countryCode: 'UA',
          cityId: null,
        },
      },
      update: {},
      create: {
        name: holiday.name,
        date,
        isRecurring: true,
        countryCode: 'UA',
      },
    });
  }

  console.log('Seed completed successfully.');
  console.log(`  City: ${kyiv.name} (${kyiv.slug})`);
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
