import { HeroSection } from '@/components/landing/hero-section';
import { generatePageMetadata } from '@/modules/seo/metadata';
import { SettingsService } from '@/modules/settings/settings.service';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Евакуатор — Швидкий виклик 24/7',
    description:
      'Професійна служба евакуації автомобілів у Києві та Україні. Миттєвий розрахунок вартості, онлайн-замовлення.',
    path: '/',
  });
}

export default async function HomePage() {
  const settings = await SettingsService.getBusinessSettings();

  return (
    <>
      <HeroSection companyName={settings.companyName} />
    </>
  );
}
