import type { JSX } from 'react';
'use client';

import type { PlayType } from '@shared/game';
import {
  CARD_BASE,
  CARD_TONE,
  SHEEN,
  ART_BOX,
  TITLE,
  SUBTITLE,
  TAG,
  ARROW,
} from '@/components/ui/choice';


type Props = {
  type: PlayType;
  onSelect: (id: PlayType['id']) => void;
};

/** The premium trio — three cut-out characters fanned like the reference. */
function PremiumCrew() {
  return (
    <span className="relative flex h-full w-full items-end justify-center gap-0.5">
      {/* left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/characters/playtype/premium-gold.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="h-[76%] w-auto -rotate-[7deg] drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]"
      />
      {/* centre, taller and in front */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/characters/playtype/premium-galaxy.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="z-10 h-full w-auto drop-shadow-[0_5px_7px_rgba(0,0,0,0.45)]"
      />
      {/* right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/characters/playtype/premium-neon.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="h-[76%] w-auto rotate-[7deg] drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]"
      />
    </span>
  );
}

/** Blue globe — Online. */
function GlobeArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-auto drop-shadow-[0_5px_8px_rgba(0,0,0,0.3)]" aria-hidden="true">
      <defs>
        <linearGradient id="globeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFE3FF" />
          <stop offset="55%" stopColor="#5BB0F7" />
          <stop offset="100%" stopColor="#2B6FD6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="23" fill="url(#globeFill)" stroke="#0B2A5B" strokeWidth="2.6" />
      <ellipse cx="32" cy="32" rx="9.5" ry="23" fill="none" stroke="#0B2A5B" strokeWidth="2" />
      <path d="M9.5 25h45M9.5 39h45" stroke="#0B2A5B" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="32" rx="23" ry="9" fill="none" stroke="#0B2A5B" strokeWidth="1.6" opacity="0.7" />
      <ellipse cx="24" cy="21" rx="7" ry="4.5" fill="#EAF6FF" opacity="0.75" transform="rotate(-25 24 21)" />
    </svg>
  );
}

/**
 * Big accent card for Local / Online — reference mockup layout:
 * art on top, title, subtitle, muted tag bottom-left, round arrow bottom-right,
 * chunky 3D bottom edge. Pure Tailwind, no CSS module.
 */
export function PlayTypeCard({ type, onSelect }: Props) : JSX.Element {
  const isLocal = type.id === 'local';

  return (
    <button
      type="button"
      onClick={() => onSelect(type.id)}
      aria-label={`${type.title} — ${type.subtitle}`}
      className={[CARD_BASE, isLocal ? CARD_TONE.local : CARD_TONE.online].join(' ')}
    >
      {/* glossy sheen across the top half */}
      <span aria-hidden="true" className={SHEEN} />

      {/* art */}
      <span className={ART_BOX}>{isLocal ? <PremiumCrew /> : <GlobeArt />}</span>

      <span className={TITLE}>{type.title}</span>

      <span className={SUBTITLE}>{type.subtitle}</span>

      {/* muted tag, bottom-left */}
      <span className={TAG}>{isLocal ? 'on device' : 'rooms'}</span>

      {/* round arrow, bottom-right */}
      <span
        aria-hidden="true"
        className={[ARROW, isLocal ? 'text-[#0E7A3C]' : 'text-[#14508F]'].join(' ')}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
