'use client';

import { useState } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { StartScreen } from './StartScreen';

/**
 * Boot sequence: loading → start.
 * Kept as one component so the transition can be cross-faded later.
 */
export function SplashGate() {
  const [phase, setPhase] = useState<'loading' | 'start'>('loading');

  if (phase === 'loading') {
    return <LoadingScreen onDone={() => setPhase('start')} />;
  }

  return <StartScreen />;
}
