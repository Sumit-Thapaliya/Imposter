import { Suspense } from 'react';
import { GameModeScreen } from '@/components/gamemode/GameModeScreen';

export default function GameModePage() {
  return (
    <Suspense fallback={null}>
      <GameModeScreen />
    </Suspense>
  );
}
