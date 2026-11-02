/**
 * Room settings for ONLINE play.
 *
 * Pure data + types, shared by the room client (to render the create form) and
 * the room store (to validate what the server accepts). No game logic — these are
 * just the values a host picks; nothing here plays the game.
 */

export type RoomMode = 'word' | 'drawing';

export const CAPACITY = { min: 3, max: 10 } as const;
export const IMPOSTER_RANGE = { min: 1, max: 3 } as const;
export const ROUND_RANGE = { min: 1, max: 5 } as const;

/** How players talk during online play. A room always has at least one channel. */
export type ChannelMode = 'chat' | 'voice' | 'both';

export const CHANNEL_MODES: { id: ChannelMode; label: string; note: string }[] = [
  { id: 'chat', label: 'Chat', note: 'Type clues in the room' },
  { id: 'voice', label: 'Voice', note: 'Talk over the mic' },
  { id: 'both', label: 'Both', note: 'Chat and mic' },
];

/** Share the secret word with everyone on the imposter team. */
export type ImposterTeamMode = 'separate' | 'shared';

export const TEAM_MODES: { id: ImposterTeamMode; label: string; note: string }[] = [
  { id: 'separate', label: 'Separate', note: 'Each gets their own word' },
  { id: 'shared', label: 'Shared', note: 'All get one word' },
];

/**
 * Imposters may never be more than a third of the table, and always at least 1.
 */
export function maxImpostersFor(capacity: number): number {
  return Math.max(IMPOSTER_RANGE.min, Math.min(IMPOSTER_RANGE.max, Math.floor(capacity / 3)));
}

export type RoomSettings = {
  /** max players in the room */
  capacity: number;

  // table
  imposters: number;
  imposterTeam: ImposterTeamMode;
  rounds: number;

  // content
  domain: string;
  hints: boolean;
  /** show the imposter teammate names to each other */
  revealTeammates: boolean;

  // clocks (seconds, 0 = off)
  clueTimer: number;
  discussionTimer: number;
  /** auto-start the round once the host fills the room */
  autoStart: boolean;

  // communication
  /** at least one channel is always on — chat or voice */
  channels: ChannelMode;

  // rules
  voting: 'open' | 'secret';
  allowSpectators: boolean;
  /** late joiners may still enter after the first round */
  lateJoin: boolean;
};

export const DEFAULT_SETTINGS: RoomSettings = {
  capacity: 4,
  imposters: 1,
  imposterTeam: 'separate',
  rounds: 3,
  domain: 'food',
  hints: true,
  revealTeammates: false,
  clueTimer: 60,
  discussionTimer: 0,
  autoStart: false,
  channels: 'chat',
  voting: 'open',
  allowSpectators: false,
  lateJoin: true,
};

/** Clamp everything to a valid combination. Never throws. */
export function normaliseSettings(settings: RoomSettings): RoomSettings {
  const capacity = Math.min(CAPACITY.max, Math.max(CAPACITY.min, Math.round(settings.capacity)));
  const imposters = Math.min(
    maxImpostersFor(capacity),
    Math.max(IMPOSTER_RANGE.min, Math.round(settings.imposters)),
  );
  const rounds = Math.min(ROUND_RANGE.max, Math.max(ROUND_RANGE.min, Math.round(settings.rounds)));
  const clampTimer = (value: number) =>
    Number.isFinite(value) && value >= 0 ? Math.min(300, Math.round(value)) : 0;
  return {
    ...settings,
    capacity,
    imposters,
    rounds,
    clueTimer: clampTimer(settings.clueTimer),
    discussionTimer: clampTimer(settings.discussionTimer),
    voting: settings.voting === 'secret' ? 'secret' : 'open',
    imposterTeam: settings.imposterTeam === 'shared' ? 'shared' : 'separate',
    channels:
      settings.channels === 'voice' ? 'voice' : settings.channels === 'both' ? 'both' : 'chat',
  };
}

/**
 * Narrow untrusted JSON (from the create request) into settings.
 * Returns null when a field is present but of the wrong type, so the server can
 * reject instead of silently accepting garbage.
 */
export function parseSettings(input: unknown): RoomSettings | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  const num = (key: keyof RoomSettings, fallback: number) => {
    const value = raw[key];
    if (value === undefined) return fallback;
    return typeof value === 'number' ? value : NaN;
  };
  const bool = (key: keyof RoomSettings, fallback: boolean) => {
    const value = raw[key];
    if (value === undefined) return fallback;
    return typeof value === 'boolean' ? value : null;
  };

  const capacity = num('capacity', DEFAULT_SETTINGS.capacity);
  const imposters = num('imposters', DEFAULT_SETTINGS.imposters);
  const rounds = num('rounds', DEFAULT_SETTINGS.rounds);
  const clueTimer = num('clueTimer', DEFAULT_SETTINGS.clueTimer);
  const discussionTimer = num('discussionTimer', DEFAULT_SETTINGS.discussionTimer);
  if ([capacity, imposters, rounds, clueTimer, discussionTimer].some((n) => !Number.isFinite(n))) {
    return null;
  }

  const hints = bool('hints', DEFAULT_SETTINGS.hints);
  const revealTeammates = bool('revealTeammates', DEFAULT_SETTINGS.revealTeammates);
  const autoStart = bool('autoStart', DEFAULT_SETTINGS.autoStart);
  const allowSpectators = bool('allowSpectators', DEFAULT_SETTINGS.allowSpectators);
  const lateJoin = bool('lateJoin', DEFAULT_SETTINGS.lateJoin);
  if ([hints, revealTeammates, autoStart, allowSpectators, lateJoin].some((v) => v === null)) {
    return null;
  }

  const domain = typeof raw.domain === 'string' ? raw.domain.slice(0, 24) : DEFAULT_SETTINGS.domain;
  const voting = raw.voting === 'secret' ? 'secret' : 'open';
  const imposterTeam = raw.imposterTeam === 'shared' ? 'shared' : 'separate';
  const channels =
    raw.channels === 'voice' ? 'voice' : raw.channels === 'both' ? 'both' : 'chat';

  return normaliseSettings({
    capacity,
    imposters,
    rounds,
    domain,
    hints: hints as boolean,
    revealTeammates: revealTeammates as boolean,
    autoStart: autoStart as boolean,
    allowSpectators: allowSpectators as boolean,
    lateJoin: lateJoin as boolean,
    clueTimer,
    discussionTimer,
    voting,
    imposterTeam,
    channels,
  });
}
