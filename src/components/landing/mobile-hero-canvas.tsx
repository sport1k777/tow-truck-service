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
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
        <defs>
          <filter
            id="hero-mobile-artwork-sharpen"
            colorInterpolationFilters="sRGB"
            x="-4%"
            y="-4%"
            width="108%"
            height="108%"
          >
            <feConvolveMatrix
              in="SourceGraphic"
              order="3"
              kernelMatrix="0 -0.5 0 -0.5 3 -0.5 0 -0.5 0"
              result="sharpened"
            />
            <feColorMatrix
              in="sharpened"
              type="matrix"
              values="
                1.1 0 0 0 -0.024
                0 1.08 0 0 -0.018
                0 0 1.14 0 -0.012
                0 0 0 1 0"
              result="graded"
            />
            <feComponentTransfer in="graded">
              <feFuncR type="gamma" amplitude="1" exponent="0.95" offset="0" />
              <feFuncG type="gamma" amplitude="1" exponent="0.95" offset="0" />
              <feFuncB type="gamma" amplitude="1" exponent="0.93" offset="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
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
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-headline-scrim" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-vignette" />
      <div className="hero-mobile-v2__layer hero-mobile-v2__layer-particles" />
    </div>
  );
}
