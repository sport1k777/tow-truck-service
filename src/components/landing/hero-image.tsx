import Image from 'next/image';

const HERO_IMAGE = '/images/hero-background.webp';
const HERO_WIDTH = 1024;
const HERO_HEIGHT = 819;

interface HeroArtworkProps {
  variant: 'desktop' | 'mobile';
  priority?: boolean;
}

/**
 * Renders the approved hero asset with edge masking so it blends
 * into the page background — no visible rectangular frame.
 */
export function HeroArtwork({ variant, priority = true }: HeroArtworkProps) {
  if (variant === 'desktop') {
    return (
      <div
        className="hero-artwork-stage pointer-events-none absolute bottom-0 right-0 top-14 hidden w-[62%] max-w-[960px] lg:block xl:top-16 xl:w-[58%] xl:max-w-[1040px]"
        aria-hidden="true"
      >
        <div className="hero-artwork-mask relative h-full w-full">
          <Image
            src={HERO_IMAGE}
            alt=""
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            priority={priority}
            quality={85}
            className="hero-artwork-image absolute left-[44%] top-[50%] h-auto w-[128%] max-w-none -translate-x-1/2 -translate-y-1/2 xl:left-[45%] xl:w-[132%]"
            sizes="(min-width: 1280px) 58vw, 62vw"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-artwork-stage-mobile relative mx-auto aspect-[1024/819] w-full max-w-3xl lg:hidden">
      <div className="hero-artwork-mask-mobile relative w-full">
        <Image
          src={HERO_IMAGE}
          alt="Професійний евакуатор з автомобілем на фоні карти України"
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          priority={priority}
          quality={85}
          className="hero-artwork-image-mobile mx-auto h-full w-[118%] max-w-none -translate-x-[3%] object-contain"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
