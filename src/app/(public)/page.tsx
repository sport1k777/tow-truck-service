import { ContactCtaSection } from '@/components/landing/contact-cta-section';
import { FaqSection } from '@/components/landing/faq-section';
import { HeroHeader } from '@/components/landing/hero-header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { ServicesSection } from '@/components/landing/services-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { WhyChooseUsSection } from '@/components/landing/why-choose-us-section';
import { PriceCalculatorSection } from '@/components/calculator/price-calculator-section';
import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { SETTINGS_DEFAULTS } from '@/modules/settings/settings.defaults';
import { baseAppConfig } from '@/config/base.config';
import { generatePageMetadata } from '@/modules/seo/metadata';

export const dynamic = 'force-static';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Евакуатор — Швидкий виклик 24/7',
    description: baseAppConfig.defaultDescription,
    path: '/',
  });
}

export default function HomePage() {
  const settings = SETTINGS_DEFAULTS;
  const companyName = settings.companyName || baseAppConfig.defaultSiteName;

  return (
    <>
      <SiteJsonLd
        companyName={companyName}
        telephone={settings.phone}
        email={settings.email}
      />
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
