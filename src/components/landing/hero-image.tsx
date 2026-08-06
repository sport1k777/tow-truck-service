import Image from 'next/image';

const HERO_IMAGE = '/images/hero-background.webp';
const HERO_WIDTH = 1024;
const HERO_HEIGHT = 819;

/** Breakpoint-aligned sizes for next/image responsive srcset generation. */
const HERO_SIZES_DESKTOP = '(min-width: 1280px) 1040px, (min-width: 1024px) 62vw, 0px';
const HERO_SIZES_MOBILE = '(max-width: 767px) 100vw, (max-width: 1023px) 768px, 0px';

interface HeroArtworkProps {
  variant: 'desktop' | 'mobile';
  layout?: 'default' | 'premium' | 'immersive' | 'hero';
  priority?: boolean;
  imageUrl?: string;
}

/**
 * Renders the approved hero asset with edge masking so it blends
 * into the page background — no visible rectangular frame.
 */
export function HeroArtwork({
  variant,
  layout = 'default',
  priority,
  imageUrl = HERO_IMAGE,
}: HeroArtworkProps) {
  const isDesktop = variant === 'desktop';
  const shouldPreload = priority ?? isDesktop;

  if (isDesktop) {
    return (
      <div
        className="hero-artwork-stage pointer-events-none absolute bottom-0 right-0 top-14 hidden w-[62%] max-w-[960px] lg:block xl:top-16 xl:w-[58%] xl:max-w-[1040px]"
        aria-hidden="true"
      >
        <div className="hero-artwork-mask relative h-full w-full">
          <Image
            src={imageUrl}
            alt=""
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            priority={shouldPreload}
            loading={shouldPreload ? undefined : 'lazy'}
            quality={85}
            className="hero-artwork-image absolute left-[44%] top-[50%] h-auto w-[128%] max-w-none -translate-x-1/2 -translate-y-1/2 xl:left-[45%] xl:w-[132%]"
            sizes={HERO_SIZES_DESKTOP}
          />
        </div>
      </div>
    );
  }

  if (layout === 'hero') {
    return (
      <div className="hero-artwork-hero">
        {/* Native img ensures full object-fit contain without Next/Image layout quirks on mobile */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Професійний евакуатор Evakuator24"
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          decoding="async"
          fetchPriority={shouldPreload ? 'high' : 'auto'}
          loading={shouldPreload ? 'eager' : 'lazy'}
          className="hero-artwork-image-hero"
        />
      </div>
    );
  }

  if (layout === 'immersive') {
    return (
      <div className="hero-artwork-immersive relative h-full w-full">
        <div className="hero-artwork-mask-immersive absolute inset-0 overflow-visible">
          <Image
            src={imageUrl}
            alt="Професійний евакуатор Evakuator24"
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            priority={shouldPreload}
            loading={shouldPreload ? undefined : 'lazy'}
            quality={90}
            className="hero-artwork-image-immersive absolute bottom-0 left-1/2 h-[168%] w-[188%] max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[172%] sm:w-[192%]"
            sizes={HERO_SIZES_MOBILE}
          />
        </div>
      </div>
    );
  }

  if (layout === 'premium') {
    return (
      <div className="hero-artwork-premium relative h-full min-h-[11rem] w-full sm:min-h-[12.5rem]">
        <div className="hero-artwork-mask-mobile-premium absolute inset-0 overflow-visible">
          <Image
            src={imageUrl}
            alt="Професійний евакуатор Evakuator24"
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            priority={shouldPreload}
            loading={shouldPreload ? undefined : 'lazy'}
            quality={85}
            className="hero-artwork-image-premium absolute bottom-0 left-1/2 h-[115%] w-[128%] max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[118%] sm:w-[132%]"
            sizes={HERO_SIZES_MOBILE}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-artwork-stage-mobile relative mx-auto w-full max-w-[28rem] lg:hidden">
      <div className="hero-artwork-mask-mobile relative aspect-[5/4] w-full max-h-[min(42vh,18.5rem)] sm:max-h-[min(44vh,20rem)]">
        <Image
          src={imageUrl}
          alt="Професійний евакуатор Evakuator24"
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          priority={shouldPreload}
          loading={shouldPreload ? undefined : 'lazy'}
          quality={85}
          className="hero-artwork-image-mobile absolute inset-x-0 bottom-0 mx-auto h-full w-[112%] max-w-none -translate-x-[4%] object-contain object-bottom"
          sizes={HERO_SIZES_MOBILE}
        />
      </div>
    </div>
  );
}
