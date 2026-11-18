'use client';

import { useState, type JSX } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { StartScreen } from './StartScreen';

/**
 * Boot sequence: loading → start.
 * Kept as one component so the transition can be cross-faded later.
 */
export function SplashGate(): JSX.Element {
  const [phase, setPhase] = useState<'loading' | 'start'>('loading');

  if (phase === 'loading') {
    return <LoadingScreen onDone={() => setPhase('start')} />;
  }

  return <StartScreen />;
}
