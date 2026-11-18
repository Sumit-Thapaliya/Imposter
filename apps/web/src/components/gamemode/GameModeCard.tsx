import type { JSX } from 'react';
'use client';

import type { GameMode } from '@shared/game';
import { WordArt, DrawingArt } from '@/components/ui/ModeIcon';
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
  mode: GameMode;
  onSelect: (id: GameMode['id']) => void;
};

/**
 * Game mode card — Word (violet) or Drawing (orange).
 * One component, reused by BOTH the local and online branches.
 * Pure Tailwind, mirrors PlayTypeCard so the two screens feel like one flow.
 */
export function GameModeCard({ mode, onSelect }: Props) : JSX.Element {
  const isWord = mode.id === 'word';

  return (
    <button
      type="button"
      onClick={() => onSelect(mode.id)}
      aria-label={`${mode.title} — ${mode.subtitle}`}
      className={[CARD_BASE, isWord ? CARD_TONE.word : CARD_TONE.drawing].join(' ')}
    >
      <span aria-hidden="true" className={SHEEN} />

      <span className={ART_BOX}>{isWord ? <WordArt /> : <DrawingArt />}</span>

      <span className={TITLE}>{mode.title}</span>

      <span className={SUBTITLE}>{mode.subtitle}</span>

      <span className={TAG}>{isWord ? 'clues' : 'draw'}</span>

      <span
        aria-hidden="true"
        className={[ARROW, isWord ? 'text-[#4C1D95]' : 'text-[#7C2D12]'].join(' ')}
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
