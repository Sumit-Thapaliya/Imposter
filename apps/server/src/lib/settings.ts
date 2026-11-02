/**
 * Server-side clamp for room settings.
 *
 * The client has its own copy for the form; this one is the one that matters,
 * because a client can send anything. Never throws — bad input becomes defaults.
 */

import type { RoomSettings } from '../../../../packages/shared-types/src/contract';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const MAX_SECONDS = 300;

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

function int(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

/** Imposters can never exceed a third of the table, and always at least one. */
export function maxImposters(capacity: number): number {
  return Math.max(1, Math.min(3, Math.floor(capacity / 3)));
}

export function sanitiseSettings(input: unknown): RoomSettings {
  const raw = (input ?? {}) as Record<string, unknown>;
  const capacity = int(raw.capacity, DEFAULT_SETTINGS.capacity, MIN_PLAYERS, MAX_PLAYERS);
  const seconds = (key: keyof RoomSettings, fallback: number) =>
    int(raw[key], fallback, 0, MAX_SECONDS);

  return {
    capacity,
    imposters: int(raw.imposters, DEFAULT_SETTINGS.imposters, 1, maxImposters(capacity)),
    imposterTeam: raw.imposterTeam === 'shared' ? 'shared' : 'separate',
    rounds: int(raw.rounds, DEFAULT_SETTINGS.rounds, 1, 5),
    domain: typeof raw.domain === 'string' ? raw.domain.slice(0, 24) : DEFAULT_SETTINGS.domain,
    hints: bool(raw.hints, DEFAULT_SETTINGS.hints),
    revealTeammates: bool(raw.revealTeammates, DEFAULT_SETTINGS.revealTeammates),
    clueTimer: seconds('clueTimer', DEFAULT_SETTINGS.clueTimer),
    discussionTimer: seconds('discussionTimer', DEFAULT_SETTINGS.discussionTimer),
    autoStart: bool(raw.autoStart, DEFAULT_SETTINGS.autoStart),
    channels: raw.channels === 'voice' ? 'voice' : raw.channels === 'both' ? 'both' : 'chat',
    voting: raw.voting === 'secret' ? 'secret' : 'open',
    allowSpectators: bool(raw.allowSpectators, DEFAULT_SETTINGS.allowSpectators),
    lateJoin: bool(raw.lateJoin, DEFAULT_SETTINGS.lateJoin),
  };
}
