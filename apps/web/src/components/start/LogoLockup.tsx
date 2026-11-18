import type { JSX } from 'react';
'use client';

import styles from './LogoLockup.module.css';

type Props = {
  /** entrance stagger, 0..1 */
  reveal?: number;
  tagline?: string;
};

/**
 * "IMPOSTER" wordmark + tagline.
 * Text-based lockup: swap in an SVG logo later without touching layout.
 */
export function LogoLockup({ reveal = 1, tagline = 'Guess · Draw · Find the Imposter!' }: Props) : JSX.Element {
  return (
    <header
      className={styles.wrap}
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 18}px)`,
      }}
    >
      <div className={styles.crown} aria-hidden="true">
        <svg viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 34 L10 6 L22 18 L32 2 L42 18 L54 6 L58 34 Z"
            fill="url(#crownGold)"
            stroke="#B07D06"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="6" y="30" width="52" height="8" rx="4" fill="url(#crownGold)" stroke="#B07D06" strokeWidth="2.5" />
          <circle cx="20" cy="12" r="2.6" fill="#FB7185" />
          <circle cx="32" cy="7" r="2.6" fill="#38BDF8" />
          <circle cx="44" cy="12" r="2.6" fill="#4ADE80" />
          <defs>
            <linearGradient id="crownGold" x1="32" y1="2" x2="32" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className={styles.title} aria-label="Imposter Game">
        <span className={styles.titleText}>IMPOSTER</span>
      </h1>

      <p className={styles.tagline}>{tagline}</p>
    </header>
  );
}
