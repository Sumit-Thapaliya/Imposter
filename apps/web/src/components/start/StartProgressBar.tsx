'use client';

import { useEffect, useState, type JSX } from 'react';
import styles from './StartProgressBar.module.css';

type Props = {
  /** how long the bar takes to fill, in ms */
  duration?: number;
  /** fires once the bar reaches 100% */
  onDone?: () => void;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Decorative "warming up" bar shown before the Get Started button appears.
 * Deliberately NOT tied to real loading — the asset preload already happened on the
 * loading screen; this is a short pacing beat so the CTA does not pop in instantly.
 */
export function StartProgressBar({ duration = 1900, onDone }: Props) : JSX.Element {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setPct(100);
      onDone?.();
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setPct(Math.round(easeOutCubic(t) * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, onDone]);

  const done = pct >= 100;

  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Preparing the game"
      >
        <div className={styles.fill} style={{ width: `${pct}%` }}>
          {!done && <span className={styles.sheen} aria-hidden="true" />}
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.label}>{done ? 'Ready' : 'Loading'}</span>
        <span className={styles.pct}>{pct}%</span>
      </div>
    </div>
  );
}
