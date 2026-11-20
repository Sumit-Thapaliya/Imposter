/**
 * Local game configuration — shared by web and mobile.
 *
 * Moved out of `apps/web/src/data` so the app and the website describe the same
 * domains, ranges, presets and limits from one file. Pure data and types: no game
 * logic lives here.
 */

/**
 * Local game configuration.
 *
 * Pure data + types. No game logic — this only describes the knobs the setup
 * screen exposes and their limits. Values are what the setup screen hands to the
 * next step; nothing is persisted and nothing is generated.
 */

export type LocalModeId = 'word' | 'drawing';

/**
 * Word categories.
 *
 * `any` is a sentinel, not a category: it means "surprise me — pick a category at
 * random, once, when the game starts". It is deliberately NOT part of `DOMAINS`,
 * so every `DOMAINS.find()` still lands on a real category.
 */
export type DomainId = 'food' | 'animals' | 'places' | 'movies' | 'objects' | 'sports';
export type DomainChoice = DomainId | 'any';

/** True categories, in tile order. */
export const DOMAIN_IDS = ['food', 'animals', 'places', 'movies', 'objects', 'sports'] as const;

/**
 * Turn the host's choice into a real category.
 *
 * `any` is resolved by the caller exactly once (the play screen keeps it in state),
 * never on render — a fresh random pick on every render would change the word
 * under the players' feet.
 */
export function resolveDomain(choice: DomainChoice, pick: () => number = Math.random): DomainId {
  if (choice !== 'any') return choice;
  const index = Math.floor(pick() * DOMAIN_IDS.length) % DOMAIN_IDS.length;
  return DOMAIN_IDS[index] ?? FALLBACK_DOMAIN.id;
}

export type Domain = {
  id: DomainId;
  label: string;
  /** kept for docs/manifests; the UI draws an SVG instead (see DomainGlyph) */
  glyph: string;
  accent: 'violet' | 'orange' | 'blue' | 'green' | 'pink' | 'amber';
  sample: string;
};

/** The fallback tile. Exported so lookups can never yield `undefined`. */
export const FALLBACK_DOMAIN: Domain = {
  id: 'food',
  label: 'Food',
  glyph: '🍕',
  accent: 'amber',
  sample: 'Sushi · Tacos · Pizza',
};

export const DOMAINS: Domain[] = [
  { id: 'food', label: 'Food', glyph: '🍕', accent: 'amber', sample: 'Sushi · Tacos · Pizza' },
  { id: 'animals', label: 'Animals', glyph: '🐘', accent: 'green', sample: 'Otter · Falcon · Panda' },
  { id: 'places', label: 'Places', glyph: '🗼', accent: 'blue', sample: 'Paris · Bazaar · Reef' },
  { id: 'movies', label: 'Movies', glyph: '🎬', accent: 'pink', sample: 'Titanic · Jaws · Alien' },
  { id: 'objects', label: 'Objects', glyph: '🧩', accent: 'violet', sample: 'Umbrella · Lantern · Kite' },
  { id: 'sports', label: 'Sports', glyph: '⚽', accent: 'orange', sample: 'Cricket · Judo · Surfing' },
];

/** What the setup screen offers: every category plus "Any". */
export const DOMAIN_CHOICES: { id: DomainChoice; label: string }[] = [
  ...DOMAINS.map((item) => ({ id: item.id as DomainChoice, label: item.label })),
  { id: 'any', label: 'Any' },
];

export const PLAYER_RANGE = { min: 3, max: 12 } as const;
/** Drawing mode: how many drawings each player contributes per turn. */
export const DRAW_RANGE = { min: 1, max: 3 } as const;
export const ROUND_RANGE = { min: 1, max: 5 } as const;

/** Imposters scale with the table, but never more than a third of it. */
export function maxImpostersFor(players: number): number {
  return Math.max(1, Math.min(3, Math.floor(players / 3)));
}

export type TimerId = 0 | 30 | 60 | 90;

export const CLUE_TIMERS: { id: TimerId; label: string }[] = [
  { id: 30, label: '30s' },
  { id: 60, label: '60s' },
  { id: 90, label: '90s' },
  { id: 0, label: 'Off' },
];

export const DISCUSSION_TIMERS: { id: TimerId; label: string }[] = [
  { id: 0, label: 'Off' },
  { id: 30, label: '30s' },
  { id: 60, label: '60s' },
  { id: 90, label: '90s' },
];

/** How many words a player may use for their clue. 0 = say as much as you like. */
export type ClueLimit = 0 | 1 | 2;

export const CLUE_LIMITS: { id: ClueLimit; label: string }[] = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 0, label: 'Any' },
];

export type VotingId = 'open' | 'secret' | 'instant';

export const VOTING: { id: VotingId; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'secret', label: 'Secret' },
  { id: 'instant', label: 'Instant' },
];

export type TieId = 'revote' | 'skip';

export const TIE_RULES: { id: TieId; label: string }[] = [
  { id: 'revote', label: 'Revote' },
  { id: 'skip', label: 'No one' },
];

/** Difficulty presets. Applying one rewrites the related knobs. */
export type DifficultyId = 'chill' | 'normal' | 'chaos';

export const DIFFICULTIES: { id: DifficultyId; label: string; note: string }[] = [
  { id: 'chill', label: 'Chill', note: 'Hints on, 2 imposters max' },
  { id: 'normal', label: 'Normal', note: 'Balanced table' },
  { id: 'chaos', label: 'Chaos', note: 'No hints, shorter clocks' },
];

export type LocalConfig = {
  difficulty: DifficultyId;

  // table
  players: number;
  imposters: number;

  // round structure
  rounds: number;
  /** Drawing mode only — drawings per player per turn. */
  drawsPerTurn: number;
  /** a category, or `any` to let the game pick one at random */
  domain: DomainChoice;
  clueTimer: TimerId;
  discussionTimer: TimerId;
  clueLimit: ClueLimit;

  // voting
  voting: VotingId;
  tieRule: TieId;

  // switches
  hints: boolean;
  imposterKnowsWord: boolean;
  revealWord: boolean;
  clueTracker: boolean;
  randomFirst: boolean;
  /** hide the role card behind a tap so the next player cannot peek */
  passAndPlay: boolean;
  scoreboard: boolean;
};

export const DEFAULT_CONFIG: LocalConfig = {
  difficulty: 'normal',
  players: 6,
  imposters: 1,
  rounds: 3,
  drawsPerTurn: 1,
  domain: 'food',
  clueTimer: 60,
  discussionTimer: 0,
  clueLimit: 1,
  voting: 'open',
  tieRule: 'revote',
  hints: true,
  imposterKnowsWord: false,
  revealWord: true,
  clueTracker: true,
  randomFirst: true,
  passAndPlay: true,
  scoreboard: true,
};

/** Patch a preset applies, leaving table size and domain alone. */
export const PRESET_PATCH: Record<DifficultyId, Partial<LocalConfig>> = {
  chill: { hints: true, clueTimer: 90, clueLimit: 0, discussionTimer: 60, imposterKnowsWord: false },
  normal: { hints: true, clueTimer: 60, clueLimit: 1, discussionTimer: 0, imposterKnowsWord: false },
  chaos: { hints: false, clueTimer: 30, clueLimit: 1, discussionTimer: 0, imposterKnowsWord: true },
};

/** Keep the config internally valid after any single field changes. */
export function normalise(config: LocalConfig): LocalConfig {
  const players = Math.min(PLAYER_RANGE.max, Math.max(PLAYER_RANGE.min, config.players));
  const ceiling = maxImpostersFor(players);
  const imposters = Math.min(ceiling, Math.max(1, config.imposters));
  const rounds = Math.min(ROUND_RANGE.max, Math.max(ROUND_RANGE.min, config.rounds));
  const drawsPerTurn = Math.min(DRAW_RANGE.max, Math.max(DRAW_RANGE.min, config.drawsPerTurn || 1));
  return { ...config, players, imposters, rounds, drawsPerTurn };
}
