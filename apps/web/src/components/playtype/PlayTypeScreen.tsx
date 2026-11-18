import type { JSX } from 'react';
'use client';

import { useRouter } from 'next/navigation';
import { ChoiceScreen } from '@/components/ui/ChoiceScreen';
import { PlayTypeCard } from './PlayTypeCard';
import { SORTED_PLAY_TYPES, type PlayType } from '@shared/game';

/**
 * Select Play Type — the first branch in the flow.
 * Both options lead to the SAME Choose Game Mode screen; only `?path` differs.
 */
export function PlayTypeScreen(): JSX.Element {
  const router = useRouter();

  function handleSelect(id: PlayType['id']) {
    router.push(id === 'online' ? '/room' : '/game-mode?path=local');
  }

  return (
    <ChoiceScreen
      title="Select Play Type"
      subtitle="How do you want to play?"
      onBack={() => router.push('/')}
      footer="Local needs no account · Online uses a room code"
    >
      {SORTED_PLAY_TYPES.map((type) => (
        <PlayTypeCard key={type.id} type={type} onSelect={handleSelect} />
      ))}
    </ChoiceScreen>
  );
}
