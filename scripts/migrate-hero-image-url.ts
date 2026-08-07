import { prisma } from '../src/lib/prisma';

const TARGET_HERO_URL = '/tow-truck.png';

const LEGACY_HERO_URLS = [
  '/images/tow-truck-transparent.png',
  '/images/tow-truck.png',
  '/images/hero-background.webp',
  '/images/hero-background.png',
  '/hero-background.webp',
] as const;

async function main() {
  const updated = await prisma.heroImage.updateMany({
    where: { url: { in: [...LEGACY_HERO_URLS] } },
    data: { url: TARGET_HERO_URL },
  });

  const rows = await prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, url: true, variant: true, isActive: true },
  });

  console.log(`Updated ${updated.count} hero image row(s) to ${TARGET_HERO_URL}.`);
  console.log('Active hero images:', rows);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
