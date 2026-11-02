'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChoiceScreen } from '@/components/ui/ChoiceScreen';
import { GameModeCard } from './GameModeCard';
import { SORTED_GAME_MODES, NEXT_ROUTE, type GameMode, type PlayPath } from '@/data/modes';

/**
 * Choose Game Mode — ONE screen, reused by both branches.
 *
 *   /game-mode?path=local   → Local Setup   (no account, no names)
 *   /game-mode?path=online  → Host / Join Room (name asked there)
 */
export function GameModeScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const path: PlayPath = params.get('path') === 'online' ? 'online' : 'local';

  function handleSelect(id: GameMode['id']) {
    router.push(`${NEXT_ROUTE[path]}?mode=${id}`);
  }

  return (
    <ChoiceScreen
      title="Choose Game Mode"
      subtitle="Pick your adventure!"
      backdrop="gamemode"
      // explicit parent, not history — going back always lands on Play Type
      onBack={() => router.push('/play-type')}
      badge={{ label: path === 'local' ? 'Local' : 'Online', tone: path }}
    >
      {SORTED_GAME_MODES.map((mode) => (
        <GameModeCard key={mode.id} mode={mode} onSelect={handleSelect} />
      ))}
    </ChoiceScreen>
  );
}
