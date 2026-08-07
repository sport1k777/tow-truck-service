import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  HERO_BACKGROUND_IMAGE,
  HERO_TRUCK_HEIGHT,
  HERO_TRUCK_IMAGE,
  HERO_TRUCK_WIDTH,
} from '@/config/hero-assets';

type MobileHeroCanvasProps = {
  backgroundUrl?: string;
  truckUrl?: string;
};

/**
 * Mobile hero — page bg, hero-background.webp scene, CSS glow, transparent truck PNG.
 */
export function MobileHeroCanvas({
  backgroundUrl = HERO_BACKGROUND_IMAGE,
  truckUrl = HERO_TRUCK_IMAGE,
}: MobileHeroCanvasProps) {
  const backgroundArtwork = `url("${backgroundUrl}")`;

  return (
    <div className="hero-mobile-v2__canvas" aria-hidden="true">
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-base" />
      <div
        className="hero-mobile-v2__layer hero-mobile-v2__layer-background"
        style={{ '--hero-background-artwork': backgroundArtwork } as CSSProperties}
      />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-glow" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-truck">
        <Image
          src={truckUrl}
          alt=""
          width={HERO_TRUCK_WIDTH}
          height={HERO_TRUCK_HEIGHT}
          priority
          className="hero-mobile-v2__truck-image"
          sizes="100vw"
        />
      </div>
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-headline-scrim" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-vignette" />
    </div>
  );
}
