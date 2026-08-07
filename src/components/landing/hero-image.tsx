import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  HERO_BACKGROUND_IMAGE,
  HERO_TRUCK_HEIGHT,
  HERO_TRUCK_IMAGE,
  HERO_TRUCK_WIDTH,
} from '@/config/hero-assets';

const HERO_SIZES_DESKTOP = '(min-width: 1280px) 1040px, (min-width: 1024px) 62vw, 0px';
const HERO_SIZES_MOBILE = '(max-width: 767px) 100vw, (max-width: 1023px) 768px, 0px';

interface HeroArtworkProps {
  variant: 'desktop' | 'mobile';
  layout?: 'default' | 'premium' | 'immersive' | 'hero';
  priority?: boolean;
  /** @deprecated Use truckUrl */
  imageUrl?: string;
  truckUrl?: string;
  backgroundUrl?: string;
  /** @deprecated Use backgroundUrl */
  mapUrl?: string;
}

/**
 * Layered hero scene — hero-background.webp + CSS glow + transparent truck PNG.
 */
export function HeroArtwork({
  variant,
  layout = 'default',
  priority,
  imageUrl,
  truckUrl = imageUrl ?? HERO_TRUCK_IMAGE,
  backgroundUrl,
  mapUrl,
}: HeroArtworkProps) {
  const isDesktop = variant === 'desktop';
  const shouldPreload = priority ?? isDesktop;
  const sceneBackground = backgroundUrl ?? mapUrl ?? HERO_BACKGROUND_IMAGE;
  const backgroundArtwork = `url("${sceneBackground}")`;

  if (isDesktop) {
    return (
      <div
        className="hero-artwork-stage pointer-events-none absolute bottom-0 right-0 top-14 hidden w-[62%] max-w-[960px] lg:block xl:top-16 xl:w-[58%] xl:max-w-[1040px]"
        aria-hidden="true"
      >
        <div className="hero-layered-scene hero-layered-scene--desktop relative h-full w-full">
          <div
            className="hero-layered__background hero-layered__background--desktop"
            style={{ '--hero-background-artwork': backgroundArtwork } as CSSProperties}
          />
          <div className="hero-layered__glow hero-layered__glow--desktop" />
          <Image
            src={truckUrl}
            alt=""
            width={HERO_TRUCK_WIDTH}
            height={HERO_TRUCK_HEIGHT}
            priority={shouldPreload}
            loading={shouldPreload ? undefined : 'lazy'}
            quality={90}
            className="hero-layered__truck hero-layered__truck--desktop"
            sizes={HERO_SIZES_DESKTOP}
          />
        </div>
      </div>
    );
  }

  if (layout === 'hero') {
    return (
      <div className="hero-artwork-hero">
        <div className="hero-artwork-hero__float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={truckUrl}
            alt="Професійний евакуатор Evakuator24"
            width={HERO_TRUCK_WIDTH}
            height={HERO_TRUCK_HEIGHT}
            decoding="async"
            fetchPriority={shouldPreload ? 'high' : 'auto'}
            loading={shouldPreload ? 'eager' : 'lazy'}
            className="hero-layered__truck hero-layered__truck--mobile-inline"
          />
        </div>
      </div>
    );
  }

  if (layout === 'immersive') {
    return (
      <div className="hero-artwork-immersive relative h-full w-full">
        <div className="hero-layered-scene hero-layered-scene--immersive relative h-full w-full">
          <div
            className="hero-layered__background hero-layered__background--immersive"
            style={{ '--hero-background-artwork': backgroundArtwork } as CSSProperties}
          />
          <div className="hero-layered__glow hero-layered__glow--immersive" />
          <Image
            src={truckUrl}
            alt="Професійний евакуатор Evakuator24"
            width={HERO_TRUCK_WIDTH}
            height={HERO_TRUCK_HEIGHT}
            priority={shouldPreload}
            loading={shouldPreload ? undefined : 'lazy'}
            quality={90}
            className="hero-layered__truck hero-layered__truck--immersive"
            sizes={HERO_SIZES_MOBILE}
          />
        </div>
      </div>
    );
  }

  if (layout === 'premium') {
    return (
      <div className="hero-artwork-premium relative h-full min-h-[11rem] w-full sm:min-h-[12.5rem]">
        <div className="hero-layered-scene hero-layered-scene--premium relative h-full w-full">
          <div
            className="hero-layered__background hero-layered__background--premium"
            style={{ '--hero-background-artwork': backgroundArtwork } as CSSProperties}
          />
          <div className="hero-layered__glow hero-layered__glow--premium" />
          <Image
            src={truckUrl}
            alt="Професійний евакуатор Evakuator24"
            width={HERO_TRUCK_WIDTH}
            height={HERO_TRUCK_HEIGHT}
            priority={shouldPreload}
            loading={shouldPreload ? undefined : 'lazy'}
            quality={90}
            className="hero-layered__truck hero-layered__truck--premium"
            sizes={HERO_SIZES_MOBILE}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-artwork-stage-mobile relative mx-auto w-full max-w-[28rem] lg:hidden">
      <div className="hero-layered-scene hero-layered-scene--mobile-banner relative aspect-[5/4] w-full max-h-[min(42vh,18.5rem)] sm:max-h-[min(44vh,20rem)]">
        <div
          className="hero-layered__background hero-layered__background--mobile-banner"
          style={{ '--hero-background-artwork': backgroundArtwork } as CSSProperties}
        />
        <div className="hero-layered__glow hero-layered__glow--mobile-banner" />
        <Image
          src={truckUrl}
          alt="Професійний евакуатор Evakuator24"
          width={HERO_TRUCK_WIDTH}
          height={HERO_TRUCK_HEIGHT}
          priority={shouldPreload}
          loading={shouldPreload ? undefined : 'lazy'}
          quality={90}
          className="hero-layered__truck hero-layered__truck--mobile-banner"
          sizes={HERO_SIZES_MOBILE}
        />
      </div>
    </div>
  );
}
