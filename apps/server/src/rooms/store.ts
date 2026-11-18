/**
 * In-memory room registry.
 *
 * The only thing the rest of the server knows about storage. When rooms need to
 * survive a restart, this file is what gets swapped for Postgres — nothing else.
 */

import { randomBytes } from 'node:crypto';
import type { RoomSettings, RoomState, GameMode } from '../../../../packages/shared-types/src/contract';
import type { RoomRecord, PlayerRecord } from '../game/rules';
import { nextId } from '../game/rules';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_TTL_MS = 6 * 60 * 60 * 1000;
const STROKE_LIMIT = 4000;

const rooms = new Map<string, RoomRecord>();
const byToken = new Map<string, { code: string; playerId: string }>();

function code(): string {
  let candidate = '';
  do {
    candidate = Array.from(randomBytes(6), (b) => ALPHABET[b % ALPHABET.length]).join('');
  } while (rooms.has(candidate));
  return candidate;
}

export function newToken(): string {
  return randomBytes(32).toString('hex');
}

export function createRoomRecord(mode: GameMode, settings: RoomSettings): RoomRecord {
  const room: RoomRecord = {
    code: code(),
    mode,
    settings,
    players: [],
    phase: 'lobby',
    round: 0,
    clueOrder: [],
    clueIndex: 0,
    chat: [],
    votes: new Map(),
    deadline: null,
    result: null,
    strokes: [],
    createdAt: Date.now(),
    version: 0,
    timer: null,
    word: null,
    hintText: null,
  };
  rooms.set(room.code, room);
  return room;
}

export function getRoom(code: string): RoomRecord | null {
  return rooms.get(code.trim().toUpperCase()) ?? null;
}

export function getRoomByCode(code: string): RoomRecord | null {
  return getRoom(code);
}

export function addPlayer(
  room: RoomRecord,
  input: { name: string; avatar: string; host?: boolean; spectator?: boolean },
): PlayerRecord {
  const player: PlayerRecord = {
    id: nextId('plr'),
    token: newToken(),
    name: input.name,
    avatar: input.avatar,
    host: input.host ?? false,
    connected: false,
    socketId: null,
    ready: true,
    spectator: input.spectator ?? false,
    score: 0,
    role: null,
    word: null,
    hint: null,
  };
  room.players.push(player);
  byToken.set(player.token, { code: room.code, playerId: player.id });
  return player;
}

export function findPlayerByToken(token: string): { room: RoomRecord; player: PlayerRecord } | null {
  const entry = byToken.get(token);
  if (!entry) return null;
  const room = rooms.get(entry.code);
  const player = room?.players.find((p) => p.id === entry.playerId);
  if (!room || !player) return null;
  return { room, player };
}

export function removePlayer(room: RoomRecord, playerId: string): void {
  const index = room.players.findIndex((p) => p.id === playerId);
  if (index === -1) return;
  const [gone] = room.players.splice(index, 1);
  if (gone) byToken.delete(gone.token);

  // host passes to the longest-standing remaining player
  if (gone?.host && room.players.length > 0) room.players[0]!.host = true;
  room.clueOrder = room.clueOrder.filter((id) => id !== playerId);
  room.votes.delete(playerId);
  for (const [voter, target] of room.votes) if (target === playerId) room.votes.delete(voter);

  if (room.players.length === 0) destroyRoom(room.code);
}

export function destroyRoom(code: string): void {
  const room = rooms.get(code);
  if (!room) return;
  if (room.timer) clearTimeout(room.timer);
  for (const player of room.players) byToken.delete(player.token);
  rooms.delete(code);
}

/** Called on an interval; drops rooms nobody has touched for six hours. */
export function sweep(now = Date.now()): number {
  let removed = 0;
  for (const [code, room] of rooms) {
    const idle = now - room.createdAt > ROOM_TTL_MS;
    const empty = room.players.length === 0;
    const abandoned = room.players.every((p) => !p.connected) && room.phase !== 'lobby';
    if (idle || empty || abandoned) {
      destroyRoom(code);
      removed += 1;
    }
  }
  return removed;
}

export function roomCount(): number {
  return rooms.size;
}

/* --------------------------------------------------------------- sanitiser */

/**
 * Turn the server's record into the payload one specific player may see.
 *
 * This is the security boundary: the word only exists in the crew's `you` block,
 * imposters get the hint, and secret votes stay hidden until the result.
 */
export function publicStateFor(room: RoomRecord, viewer: PlayerRecord): RoomState {
  const viewerIsCrew = viewer.role === 'crew';
  const teammates =
    viewer.role === 'imposter' && room.settings.revealTeammates
      ? room.players.filter((p) => p.role === 'imposter' && p.id !== viewer.id).map((p) => p.name)
      : [];

  const hideVotes = room.phase !== 'result' && room.settings.voting === 'secret';

  return {
    code: room.code,
    mode: room.mode,
    phase: room.phase,
    settings: room.settings,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      host: p.host,
      connected: p.connected,
      ready: p.ready,
      spectator: p.spectator,
      score: p.score,
    })),
    hostId: room.players.find((p) => p.host)?.id ?? '',
    round: Math.max(1, room.round),
    totalRounds: room.settings.rounds,
    clueOrder: room.clueOrder,
    clueIndex: room.clueIndex,
    chat: room.chat,
    votes: hideVotes
      ? []
      : [...room.votes.entries()].map(([voterId, targetId]) => {
          const voter = room.players.find((p) => p.id === voterId);
          const target = targetId ? room.players.find((p) => p.id === targetId) : null;
          return {
            voterId: room.settings.voting === 'secret' ? '' : voterId,
            voterName: room.settings.voting === 'secret' ? 'A player' : voter?.name ?? 'A player',
            targetId: targetId ?? null,
            targetName: target?.name ?? null,
          };
        }),
    deadline: room.deadline,
    result: room.result,
    strokes: room.mode === 'drawing' ? room.strokes : [],
    you: {
      id: viewer.id,
      role: room.phase === 'lobby' ? null : viewer.role,
      word: room.phase === 'lobby' ? null : viewerIsCrew ? viewer.word : null,
      hint: viewer.role === 'imposter' ? viewer.hint : null,
      teammates,
      hasVoted: room.votes.has(viewer.id),
      hasClued: room.chat.some((entry) => entry.kind === 'clue' && entry.playerId === viewer.id),
    },
    version: room.version,
  };
}

export function pushStroke(room: RoomRecord, stroke: { points: number[]; color: string; size: number; kind?: 'fill' }): void {
  room.strokes.push({
    ...(stroke.kind === 'fill' ? { kind: 'fill' as const } : {}),
    points: stroke.points.slice(-STROKE_LIMIT),
    color: stroke.color.slice(0, 24),
    size: Math.max(1, Math.min(40, stroke.size)),
  });
  if (room.strokes.length > 600) room.strokes.shift();
}
