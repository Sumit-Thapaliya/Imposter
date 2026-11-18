'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import { StartBackdrop } from './StartBackdrop';
import { LogoLockup } from './LogoLockup';
import { PRELOAD_IMAGES, START_CHARACTERS } from '@/data/characters';
import { preloadImages, wait, type PreloadProgress } from '@/lib/preloadImages';
import styles from './LoadingScreen.module.css';

type Props = {
  onDone?: () => void;
  minDuration?: number;
  manual?: boolean;
};

/** Rotating status lines — swaps as progress passes each milestone. */
const STATUS_STEPS = [
  { at: 0, label: 'Waking the crew' },
  { at: 0.28, label: 'Warming up the words' },
  { at: 0.55, label: 'Sharpening pencils' },
  { at: 0.8, label: 'Picking an imposter' },
  { at: 1, label: 'Ready to play' },
];

/**
 * Loading screen.
 *
 * - progress is driven by real image decoding, never a fake timer
 * - one character per tile, each in its own gesture
 * - tiles pop in one by one as their asset resolves
 */
export function LoadingScreen({ onDone, minDuration = 1500, manual = false }: Props) : JSX.Element {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: PRELOAD_IMAGES.length,
    ratio: 0,
    failed: [],
  });
  const [ready, setReady] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let alive = true;
    const started = performance.now();

    const { promise } = preloadImages(PRELOAD_IMAGES, (p) => {
      if (alive) setProgress(p);
    });

    promise.then(async () => {
      const elapsed = performance.now() - started;
      if (elapsed < minDuration) await wait(minDuration - elapsed);
      if (!alive) return;
      setReady(true);
      if (!manual) {
        await wait(360);
        if (alive && !doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
      }
    });

    return () => {
      alive = false;
    };
  }, [minDuration, manual, onDone]);

  const pct = Math.round(progress.ratio * 100);
  const status = [...STATUS_STEPS].reverse().find((s) => progress.ratio >= s.at) ?? STATUS_STEPS[0]!;

  return (
    <main className={`stage ${styles.root}`}>
      <StartBackdrop reveal={1} />

      <div className={styles.content}>
        <LogoLockup reveal={1} tagline="Loading the crew…" />

        <div className={styles.progressWrap}>
          <ul className={styles.tiles} aria-hidden="true">
            {START_CHARACTERS.map((character, i) => {
              const threshold = (i + 1) / (START_CHARACTERS.length + 1);
              const filled = progress.ratio >= threshold;
              return (
                <li
                  key={character.id}
                  className={styles.tile}
                  data-filled={filled}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={character.thumb}
                    alt=""
                    width={72}
                    height={72}
                    className={styles.tileImage}
                  />
                </li>
              );
            })}
          </ul>

          <div
            className={styles.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Loading game assets"
          >
            <div className={styles.fill} style={{ width: `${pct}%` }} />
          </div>

          <div className={styles.meta}>
            <span className={styles.status}>
              {progress.failed.length > 0 && ready ? 'Some assets failed — continuing' : status.label}
            </span>
            <span className={styles.pct}>{pct}%</span>
          </div>
        </div>

        {manual && (
          <button
            type="button"
            className={`btn ${styles.continue}`}
            onClick={() => onDone?.()}
            disabled={!ready}
          >
            Continue
          </button>
        )}
      </div>
    </main>
  );
}
