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
import { baseAppConfig } from '@/config/base.config';
import { generatePageMetadata } from '@/modules/seo/metadata';
import { SettingsService } from '@/modules/settings/settings.service';
import { ContentService } from '@/modules/content/content.service';
import { getCalculatorRuntimeConfig } from '@/modules/calculator/calculator-runtime';

export const revalidate = 60;

export async function generateMetadata() {
  const seo = await SettingsService.getSeoSettings();

  return generatePageMetadata({
    title: seo.title,
    description: seo.description,
    path: '/',
    ogImage: seo.ogImage.startsWith('http') ? seo.ogImage : undefined,
  });
}

export default async function HomePage() {
  const [settings, content, faqItems, testimonials, heroImages, calculatorConfig] = await Promise.all([
    SettingsService.getBusinessSettings(),
    SettingsService.getContentSettings(),
    ContentService.getFaqItems(),
    ContentService.getTestimonials(),
    ContentService.getHeroImages(),
    getCalculatorRuntimeConfig(),
  ]);

  const companyName = settings.companyName || baseAppConfig.defaultSiteName;
  const heroDesktop =
    heroImages.find((image) => image.variant === 'DESKTOP' || image.variant === 'BOTH')?.url ??
    '/images/hero-background.webp';
  const heroMobile =
    heroImages.find((image) => image.variant === 'MOBILE' || image.variant === 'BOTH')?.url ??
    heroDesktop;

  return (
    <>
      <SiteJsonLd
        companyName={companyName}
        telephone={settings.phone}
        email={settings.email}
      />
      <HeroHeader companyName={companyName} />
      <HeroSection desktopImageUrl={heroDesktop} mobileImageUrl={heroMobile} content={content} />
      <PriceCalculatorSection config={calculatorConfig} />
      <HowItWorksSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection companyName={companyName} testimonials={testimonials.length ? testimonials : undefined} />
      <FaqSection items={faqItems.length ? faqItems : undefined} />
      <ContactCtaSection
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
        email={settings.email}
        workingHours={settings.workingHours}
      />
    </>
  );
}
