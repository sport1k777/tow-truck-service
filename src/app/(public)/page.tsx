import { ContactCtaSection } from '@/components/landing/contact-cta-section';
import { FaqSection } from '@/components/landing/faq-section';
import { HeroHeader } from '@/components/landing/hero-header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { ServicesSection } from '@/components/landing/services-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { WhyChooseUsSection } from '@/components/landing/why-choose-us-section';
import { PriceCalculatorSection } from '@/components/calculator/price-calculator-section';
import { generatePageMetadata } from '@/modules/seo/metadata';
import { SettingsService } from '@/modules/settings/settings.service';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Евакуатор — Швидкий виклик 24/7',
    description:
      'Професійна евакуація автомобілів по всій Україні. Миттєвий розрахунок вартості, онлайн-замовлення за 30 секунд. Цілодобово.',
    path: '/',
  });
}

export default async function HomePage() {
  const settings = await SettingsService.getBusinessSettings();
  const companyName = settings.companyName || 'Евакуатор';

  return (
    <>
      <HeroHeader companyName={companyName} />
      <HeroSection />
      <PriceCalculatorSection />
      <HowItWorksSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection companyName={companyName} />
      <FaqSection />
      <ContactCtaSection
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
        email={settings.email}
        workingHours={settings.workingHours}
      />
    </>
  );
}
