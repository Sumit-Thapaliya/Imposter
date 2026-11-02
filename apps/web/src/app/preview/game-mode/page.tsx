import { Suspense } from 'react';
import { GameModeScreen } from '@/components/gamemode/GameModeScreen';

export default function GameModePreviewPage() {
  return (
    <Suspense fallback={null}>
      <GameModeScreen />
    </Suspense>
  );
}
