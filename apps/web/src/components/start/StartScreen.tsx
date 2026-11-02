'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StartBackdrop } from './StartBackdrop';
import { LogoLockup } from './LogoLockup';
import { CharacterStage } from './CharacterStage';
import { PlayButton } from './PlayButton';
import { StartProgressBar } from './StartProgressBar';
import styles from './StartScreen.module.css';

/**
 * Start screen — composes backdrop, logo, character stage and CTA.
 * Props are intentionally minimal: navigation is wired later, not here.
 */
export function StartScreen({ onPlay }: { onPlay?: () => void }) {
  const router = useRouter();
  const [reveal, setReveal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Get Started → Select Play Type (the first branch in the flow)
  const handlePlay = useCallback(() => {
    if (onPlay) onPlay();
    else router.push('/play-type');
  }, [onPlay, router]);

  // stable identity so the bar's animation effect does not restart every render
  const handleLoaded = useCallback(() => setLoaded(true), []);

  // staggered entrance on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setReveal(1));
    return () => cancelAnimationFrame(id);
  }, []);

  // derived stagger so each layer lands in order
  const logo = Math.min(1, reveal * 1);
  const characters = Math.min(1, Math.max(0, reveal * 1.4 - 0.15));
  // the CTA only appears once the (decorative) warm-up bar has filled
  const cta = loaded ? Math.min(1, Math.max(0, reveal * 1.4 - 0.4)) : 0;

  return (
    <main className={`stage ${styles.root}`}>
      <StartBackdrop reveal={reveal} />

      <div className={styles.content}>
        <div className={styles.top}>
          <LogoLockup reveal={logo} />
        </div>

        <div className={styles.middle}>
          <CharacterStage reveal={characters} />
        </div>

        <div className={styles.bottom}>
          <div className={styles.ctaSlot}>
            {!loaded && <StartProgressBar onDone={handleLoaded} />}
            {loaded && <PlayButton reveal={cta} onClick={handlePlay} />}
          </div>

          <p className={styles.hint} style={{ opacity: cta }}>
            Play on one device, or online with friends
          </p>
        </div>
      </div>
    </main>
  );
}
