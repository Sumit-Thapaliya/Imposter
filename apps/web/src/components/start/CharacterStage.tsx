import type { JSX } from 'react';
'use client';

import { STAGE_CHARACTERS } from '@/data/characters';
import styles from './CharacterStage.module.css';

type Props = {
  /** entrance progress 0..1 — characters stagger in as it rises */
  reveal?: number;
};

/**
 * Three featured characters, each in a different gesture. No name labels on purpose —
 * the stage is meant to read as a cast, not a menu.
 * Layout comes from the manifest order; nothing is hardcoded per slot.
 */
export function CharacterStage({ reveal = 1 }: Props) : JSX.Element {
  const count = STAGE_CHARACTERS.length;

  return (
    <div className={styles.stage}>
      {STAGE_CHARACTERS.map((c, index) => {
        const isCenter = index === Math.floor(count / 2);
        const local = Math.min(1, Math.max(0, reveal * 1.6 - index * 0.2));
        const tilt = isCenter ? 0 : index < count / 2 ? -3 : 3;

        return (
          <figure
            key={c.id}
            className={`${styles.figure} ${isCenter ? styles.center : ''}`}
            style={{
              opacity: local,
              transform: `translateY(${(1 - local) * 42}px) rotate(${tilt * local}deg)`,
              animationDelay: `${index * 0.7}s`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt={c.alt}
              width={640}
              height={832}
              className={styles.image}
              draggable={false}
            />
          </figure>
        );
      })}
    </div>
  );
}
