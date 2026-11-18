/**
 * Server-side rules.
 *
 * Pure functions over a `RoomRecord` — no sockets, no timers, no I/O — so the whole
 * game can be unit-tested and replayed. The socket layer only calls these and then
 * broadcasts.
 */

import { randomInt } from 'node:crypto';
import { selectWord } from '../../../../packages/shared-types/src/wordBank';
import type {
  Phase,
  RoomSettings,
  RoundResult,
  ChatEntry,
  Role,
  Stroke,
  Vote,
} from '../../../../packages/shared-types/src/contract';

export type PlayerRecord = {
  id: string;
  token: string;
  name: string;
  avatar: string;
  host: boolean;
  connected: boolean;
  /** socket id while connected */
  socketId: string | null;
  ready: boolean;
  /** watching without a seat this round (joined after the start) */
  spectator: boolean;
  score: number;
  role: Role | null;
  /** crew only */
  word: string | null;
  /** imposter only */
  hint: string | null;
};

export type RoomRecord = {
  code: string;
  mode: 'word' | 'drawing';
  settings: RoomSettings;
  players: PlayerRecord[];
  phase: Phase;
  round: number;
  clueOrder: string[];
  clueIndex: number;
  chat: ChatEntry[];
  /** kept server-side; only exposed on the result screen */
  votes: Map<string, string | null>;
  deadline: number | null;
  result: RoundResult | null;
  strokes: Stroke[];
  createdAt: number;
  version: number;
  timer: NodeJS.Timeout | null;
  /** set at the start of a round so everyone shares one word */
  word: string | null;
  hintText: string | null;
};

/* ----------------------------------------------------------------- word source */

/** The server chooses the word once and sends only the hint to imposters. */
export function dealWord(domain: string, previousWord?: string | null): { word: string; hint: string } {
  return selectWord(domain, () => randomInt(0x100000000) / 0x100000000, previousWord);
}

export const MIN_PLAYERS = 3;
export const MAX_CHAT = 120;

let sequence = 0;
export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}_${Date.now().toString(36)}${sequence.toString(36)}`;
}

/** Shuffle without touching the input. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function bump(room: RoomRecord): RoomRecord {
  room.version += 1;
  return room;
}

export function systemLine(room: RoomRecord, text: string): void {
  room.chat.push({
    id: nextId('msg'),
    kind: 'system',
    playerId: null,
    name: null,
    text,
    at: Date.now(),
  });
  if (room.chat.length > MAX_CHAT) room.chat.splice(0, room.chat.length - MAX_CHAT);
}

/* ---------------------------------------------------------------- round set-up */

/**
 * Deal roles and pick the word.
 *
 * Imposters never receive the word — only the domain hint — and never receive a
 * list of words that contains it.
 */
export function dealRound(room: RoomRecord): void {
  const { word, hint } = dealWord(room.settings.domain, room.word);
  room.word = word;
  room.hintText = hint;
  room.votes = new Map();
  room.result = null;
  room.strokes = [];

  const seated = room.players.filter((p) => !p.spectator);
  const imposterCount = Math.min(room.settings.imposters, Math.max(1, Math.floor(seated.length / 3)));
  const shuffled = shuffle(seated);
  const imposterIds = new Set(shuffled.slice(0, imposterCount).map((p) => p.id));

  for (const player of room.players) {
    const isImposter = imposterIds.has(player.id);
    player.role = isImposter ? 'imposter' : 'crew';
    player.word = isImposter ? null : word;
    player.hint = isImposter && room.settings.hints ? hint : null;
  }

  room.clueOrder = shuffle(seated).map((p) => p.id);
  room.clueIndex = 0;
  room.round = room.round || 1;
  room.phase = 'reveal';
  room.deadline = null;
}

/**
 * Drawing mode is cooperative — there is no winner to declare, so the result screen
 * only reports what the board was.
 */
export function skipRoles(room: RoomRecord): void {
  room.votes = new Map();
  room.result = null;
  // Random first drawer, not seat order — nobody should always go first.
  room.clueOrder = shuffle(room.players.filter((p) => !p.spectator)).map((p) => p.id);
  room.clueIndex = 0;
  room.phase = 'clues';
  room.deadline = null;
}

/* ------------------------------------------------------------------- counting */

/** Players actually taking part in the round (everyone, once in play). */
export function seatedPlayers(room: RoomRecord): PlayerRecord[] {
  return room.players.filter((p) => !p.spectator);
}

export function currentCluePlayer(room: RoomRecord): PlayerRecord | null {
  const id = room.clueOrder[room.clueIndex];
  if (!id) return null;
  return room.players.find((p) => p.id === id) ?? null;
}

export function everyoneVoted(room: RoomRecord): boolean {
  return room.players.every((p) => room.votes.has(p.id));
}

export function tally(room: RoomRecord, hideVoters: boolean): Vote[] {
  const votes: Vote[] = [];
  for (const player of room.players) {
    if (!room.votes.has(player.id)) continue;
    const targetId = room.votes.get(player.id) ?? null;
    const target = targetId ? room.players.find((p) => p.id === targetId) : null;
    votes.push({
      voterId: hideVoters ? '' : player.id,
      voterName: hideVoters ? 'A player' : player.name,
      targetId,
      targetName: target?.name ?? null,
    });
  }
  return votes;
}

/**
 * Decide the round.
 *
 * One imposter ejected → crew win. Anyone else ejected, or a tie, or nobody ejected
 * → imposters win. (No multi-round scoring yet; `score` is wired and starts at 0.)
 */
export function resolveVotes(room: RoomRecord): RoundResult {
  const counts = new Map<string, number>();
  for (const target of room.votes.values()) {
    if (!target) continue;
    counts.set(target, (counts.get(target) ?? 0) + 1);
  }
  let topId: string | null = null;
  let topCount = 0;
  let tied = false;
  for (const [id, count] of counts) {
    if (count > topCount) {
      topId = id;
      topCount = count;
      tied = false;
    } else if (count === topCount) {
      tied = true;
    }
  }
  if (tied) topId = null;

  const ejected = topId ? room.players.find((p) => p.id === topId) ?? null : null;
  const caught = ejected?.role === 'imposter';

  const result: RoundResult = {
    ejectedId: ejected?.id ?? null,
    ejectedName: ejected?.name ?? null,
    caught,
    winner: caught ? 'crew' : 'imposters',
    imposters: room.players
      .filter((p) => p.role === 'imposter')
      .map((p) => ({ id: p.id, name: p.name, avatar: p.avatar })),
    word: room.word ?? '',
    votes: tally(room, room.settings.voting === 'secret'),
  };

  for (const player of room.players) {
    if (result.winner === 'crew' && player.role === 'crew') player.score += 1;
    if (result.winner === 'imposters' && player.role === 'imposter') player.score += 1;
  }

  return result;
}

/* ------------------------------------------------------------------- deadlines */

export function deadlineFor(room: RoomRecord, seconds: number): number | null {
  if (!seconds || seconds <= 0) return null;
  return Date.now() + seconds * 1000;
}

export const PHASE_COPY: Record<Phase, string> = {
  lobby: 'waiting in the lobby',
  reveal: 'reading their cards',
  clues: 'writing clues',
  discussion: 'talking it out',
  voting: 'voting',
  result: 'the round is over',
};
