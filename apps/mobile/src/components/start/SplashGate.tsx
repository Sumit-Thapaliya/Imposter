import { useState } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { StartScreen } from './StartScreen';

/** Boot sequence: loading → start. */
export function SplashGate({ onPlay }: { onPlay?: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'start'>('loading');

  if (phase === 'loading') return <LoadingScreen onDone={() => setPhase('start')} />;
  return <StartScreen onPlay={onPlay} />;
}
