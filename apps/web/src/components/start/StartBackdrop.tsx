'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './StartBackdrop.module.css';

type Props = {
  /** 0 = hidden, 1 = fully visible */
  reveal?: number;
};

/**
 * Layered cosmic backdrop: image + vignette + drifting particles.
 * Purely decorative, aria-hidden.
 */
export function StartBackdrop({ reveal = 1 }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Deterministic pseudo-random particle layout (no hydration mismatch).
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r1 = seed / 233280;
        const r2 = ((i * 4703 + 7919) % 104729) / 104729;
        return {
          left: `${(r1 * 100).toFixed(2)}%`,
          size: 2 + Math.round(r2 * 3),
          delay: `${(r1 * 9).toFixed(2)}s`,
          duration: `${(9 + r2 * 10).toFixed(2)}s`,
          opacity: 0.25 + r2 * 0.5,
        };
      }),
    [],
  );

  return (
    <>
      <div
        className={styles.backdrop}
        style={{ opacity: reveal }}
        aria-hidden="true"
        data-testid="backdrop"
      />
      <div className={styles.particles} aria-hidden="true">
        {mounted &&
          particles.map((p, i) => (
            <span
              key={i}
              className={styles.particle}
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: p.opacity,
              }}
            />
          ))}
      </div>
      <div className={styles.haze} aria-hidden="true" />
    </>
  );
}
