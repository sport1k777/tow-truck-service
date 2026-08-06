import type { CSSProperties } from 'react';

const DEFAULT_MOBILE_HERO_ARTWORK = '/images/hero-background.webp';

type MobileHeroCanvasProps = {
  imageUrl?: string;
};

/**
 * Full-bleed layered Hero background for mobile.
 * Artwork is painted as background-image — never an inline <img>.
 */
export function MobileHeroCanvas({ imageUrl = DEFAULT_MOBILE_HERO_ARTWORK }: MobileHeroCanvasProps) {
  const artworkUrl = `url("${imageUrl}")`;

  return (
    <div className="hero-mobile-v2__canvas" aria-hidden="true">
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-base" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-floor" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-grid" />
      <div
        className="hero-mobile-v2__layer hero-mobile-v2__layer-artwork"
        style={{ '--hero-mobile-artwork': artworkUrl } as CSSProperties}
      />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-reflection" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-ambient" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-beams" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-vignette" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-particles" />
    </div>
  );
}
