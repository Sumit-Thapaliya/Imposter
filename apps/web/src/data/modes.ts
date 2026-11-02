/**
 * Play-type and game-mode manifests.
 * Shared shape between web and mobile so both branches render from one source.
 * Icons are referenced by key — the visuals live in the components.
 */

export type PlayTypeId = 'local' | 'online';
export type GameModeId = 'word' | 'drawing';
export type PlayPath = PlayTypeId;

export type PlayType = {
  id: PlayTypeId;
  title: string;
  subtitle: string;
  /** semantic accent — maps to the `local` / `online` colours in tailwind.config */
  accent: 'local' | 'online';
  order: number;
};

export type GameMode = {
  id: GameModeId;
  title: string;
  subtitle: string;
  icon: 'word' | 'drawing';
  accent: 'violet' | 'orange';
  order: number;
};

export const PLAY_TYPES: PlayType[] = [
  {
    id: 'local',
    title: 'Local',
    subtitle: 'Play on one device',
    accent: 'local',
    order: 0,
  },
  {
    id: 'online',
    title: 'Online',
    subtitle: 'Play with friends online',
    accent: 'online',
    order: 1,
  },
];

export const GAME_MODES: GameMode[] = [
  {
    id: 'word',
    title: 'Word Mode',
    subtitle: 'Give clues, find the imposter!',
    icon: 'word',
    accent: 'violet',
    order: 0,
  },
  {
    id: 'drawing',
    title: 'Drawing Mode',
    subtitle: 'Draw, discover the imposter!',
    icon: 'drawing',
    accent: 'orange',
    order: 1,
  },
];

export const SORTED_PLAY_TYPES = [...PLAY_TYPES].sort((a, b) => a.order - b.order);
export const SORTED_GAME_MODES = [...GAME_MODES].sort((a, b) => a.order - b.order);

/** Where each branch goes after Game Mode is chosen. */
export const NEXT_ROUTE: Record<PlayPath, string> = {
  local: '/local/setup',
  online: '/room',
};
