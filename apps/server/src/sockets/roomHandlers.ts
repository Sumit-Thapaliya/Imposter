/**
 * The room/game state machine, expressed as socket handlers.
 *
 * Every handler follows the same shape:
 *   1. resolve the caller's session (room + player) from its socket
 *   2. check it is that player's turn / that they are the host
 *   3. mutate the room through the pure rules
 *   4. `broadcast()` — one personalised snapshot per socket
 *
 * Authoritative by design: clients never decide a role, a word, a tally or a winner.
 */

import type { Server, Socket } from 'socket.io';
import type {
  Ack,
  ClientToServerEvents,
  CreateInput,
  GameMode,
  InterServerEvents,
  JoinInput,
  RoomSettings,
  ServerToClientEvents,
  Session,
  SocketData,
} from '../../../../packages/shared-types/src/contract';
import { LIMITS } from '../../../../packages/shared-types/src/contract';
import {
  bump,
  currentCluePlayer,
  dealRound,
  everyoneVoted,
  nextId,
  resolveVotes,
  seatedPlayers,
  shuffle,
  skipRoles,
  systemLine,
  MIN_PLAYERS,
  type PlayerRecord,
  type RoomRecord,
} from '../game/rules';
import {
  addPlayer,
  createRoomRecord,
  destroyRoom,
  findPlayerByToken,
  getRoom,
  publicStateFor,
  pushStroke,
  removePlayer,
  roomCount,
  sweep,
} from '../rooms/store';
import { MAX_PLAYERS, sanitiseSettings } from '../lib/settings';
import { livekitRoom, voiceConfigured, voiceToken } from '../lib/voice';
import { rateLimit } from '../lib/rateLimit';

type Io = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type Sock = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/* ------------------------------------------------------------------- helpers */

function nameOk(name: unknown): name is string {
  return typeof name === 'string' && /^[\p{L}\p{N} _.-]{2,20}$/u.test(name.trim());
}

type AckFn = (r: Ack) => void;

/**
 * Pick the trailing callback out of the argument list.
 *
 * socket.io passes exactly what the client sent, so a client that sends a stray
 * payload on an ack-only event shifts the callback out of position. Reading the
 * last function argument makes that harmless instead of a silent hang.
 */
function ackOf(args: unknown[]): AckFn | undefined {
  const last = args[args.length - 1];
  return typeof last === 'function' ? (last as AckFn) : undefined;
}

/** Never assume a callback exists: socket.io may hand us nothing at all. */
/** A reply helper that also serves the events whose ack is not a plain `Ack`. */
function reply(ack: ((r: never) => void) | ((r: Ack) => void) | undefined, payload: unknown): void {
  if (typeof ack === 'function') (ack as (r: unknown) => void)(payload);
}

function fail(ack: ((r: Ack) => void) | undefined, error: string): void {
  reply(ack, { ok: false, error });
}

function done(ack: ((r: Ack) => void) | undefined, session?: Session): void {
  reply(ack, session ? { ok: true, session } : { ok: true });
}

function session(socket: Sock): { room: RoomRecord; player: PlayerRecord } | null {
  const token = socket.data.session?.token;
  if (!token) return null;
  return findPlayerByToken(token);
}

/** Join the socket.io room and remember the socket on the player record. */
function attach(socket: Sock, room: RoomRecord, player: PlayerRecord): Session {
  player.socketId = socket.id;
  player.connected = true;
  socket.join(room.code);
  const payload: Session = { code: room.code, playerId: player.id, token: player.token };
  socket.data.session = payload;
  return payload;
}

/** Push a personalised snapshot to every socket in the room. */
export function broadcast(io: Io, room: RoomRecord): void {
  bump(room);
  const sockets = io.sockets.adapter.rooms.get(room.code);
  if (!sockets) return;
  for (const id of sockets) {
    const socket = io.sockets.sockets.get(id);
    const player = room.players.find((p) => p.socketId === id);
    if (!socket || !player) continue;
    socket.emit('room:state', publicStateFor(room, player));
  }
}

function hostInLobby(room: RoomRecord, player: PlayerRecord): string | null {
  if (!player.host) return 'Only the host can do that.';
  if (room.phase !== 'lobby') return 'The room is already playing.';
  return null;
}

/** Host, or anyone if the host has vanished mid-round. */
function canAdvance(room: RoomRecord, player: PlayerRecord): boolean {
  return player.host || !room.players.some((p) => p.host && p.connected);
}

function clearTimer(room: RoomRecord): void {
  if (room.timer) clearTimeout(room.timer);
  room.timer = null;
}

/** Run `onExpire` after `ms`, and clear it if the phase changes first. */
function armTimer(room: RoomRecord, ms: number, onExpire: () => void): void {
  clearTimer(room);
  room.deadline = Date.now() + ms;
  room.timer = setTimeout(() => {
    room.timer = null;
    room.deadline = null;
    onExpire();
  }, ms);
  room.timer.unref?.();
}

function startRound(io: Io, room: RoomRecord): void {
  clearTimer(room);
  if (room.mode === 'drawing') {
    skipRoles(room);
    systemLine(room, 'The board is open. Everyone adds to the same drawing.');
  } else {
    room.round = Math.max(1, room.round);
    dealRound(room);
    systemLine(room, 'Cards are dealt. Check yours, then pass the phone.');
  }
  for (const p of room.players) p.ready = false;
  broadcast(io, room);
}

function beginDiscussion(io: Io, room: RoomRecord): void {
  clearTimer(room);
  room.phase = 'discussion';
  systemLine(room, 'Everyone has clued. Talk it out.');
  const seconds = room.settings.discussionTimer;
  if (seconds > 0) armTimer(room, seconds * 1000, () => beginVoting(io, room));
  else room.deadline = null;
  broadcast(io, room);
}

function beginVoting(io: Io, room: RoomRecord): void {
  clearTimer(room);
  room.phase = 'voting';
  room.deadline = null;
  systemLine(room, 'Voting is open.');
  broadcast(io, room);
}

function finishRound(io: Io, room: RoomRecord): void {
  clearTimer(room);
  room.result = resolveVotes(room);
  room.phase = 'result';
  room.deadline = null;
  systemLine(
    room,
    room.result.ejectedName ? `${room.result.ejectedName} was voted out.` : 'Nobody was voted out.',
  );
  broadcast(io, room);
}

function clip(text: unknown, max: number): string {
  return String(text ?? '').trim().slice(0, max);
}

/* -------------------------------------------------------------- registration */

export function registerRoomHandlers(io: Io): void {
  const sweeper = setInterval(() => sweep(), 10 * 60 * 1000);
  sweeper.unref?.();

  io.on('connection', (socket) => {
    /**
     * Ack-only handlers (`room:start`, `game:ready`, …) never need a payload, but a
     * client may still send one. This pulls the callback from wherever it landed.
     */
    const ackOnly = (
      event: keyof ClientToServerEvents,
      handler: (ack: AckFn | undefined, payload?: unknown) => void,
    ): void => {
      (socket.on as unknown as (e: string, h: (...a: unknown[]) => void) => void)(event, (...args) => {
        // payload first when the event takes one, ack always last
        const payload = typeof args[0] === 'function' ? undefined : args[0];
        handler(ackOf(args), payload);
      });
    };

    /* ------------------------------------------------------ session */

    socket.on('room:create', (input: CreateInput, ack) => {
      if (!rateLimit(socket, 'create', 6, 60_000)) return fail(ack, 'Slow down a moment.');
      if (!nameOk(input?.name)) {
        return fail(
          ack,
          'Choose a name of 2–20 letters, numbers, spaces, dots, hyphens or underscores.',
        );
      }
      if (input.mode !== 'word' && input.mode !== 'drawing') return fail(ack, 'Choose a game mode.');

      const settings: RoomSettings = sanitiseSettings(input.settings);
      const room = createRoomRecord(input.mode as GameMode, {
        ...settings,
        capacity: Math.min(settings.capacity, MAX_PLAYERS),
      });
      const player = addPlayer(room, {
        name: input.name.trim(),
        avatar: String(input.avatar ?? ''),
        host: true,
      });
      attach(socket, room, player);
      systemLine(room, `${player.name} opened the room.`);
      socket.emit('room:state', publicStateFor(room, player));
      done(ack, { code: room.code, playerId: player.id, token: player.token });
    });

    socket.on('room:join', (input: JoinInput, ack) => {
      if (!rateLimit(socket, 'join', 12, 60_000)) return fail(ack, 'Slow down a moment.');
      if (!nameOk(input?.name)) {
        return fail(
          ack,
          'Choose a name of 2–20 letters, numbers, spaces, dots, hyphens or underscores.',
        );
      }
      const room = getRoom(String(input.code ?? ''));
      if (!room) return fail(ack, 'Room not found. Check the room code.');
      const name = input.name.trim();
      if (room.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        return fail(ack, 'That name is already in this room.');
      }
      if (seatedPlayers(room).length >= room.settings.capacity) return fail(ack, 'This room is full.');
      if (room.phase !== 'lobby' && !room.settings.lateJoin) {
        return fail(ack, 'This room is already playing.');
      }

      // Joining mid-game means watching until the next round starts.
      const spectator = room.phase !== 'lobby';
      const player = addPlayer(room, {
        name,
        avatar: String(input.avatar ?? ''),
        spectator,
      });
      attach(socket, room, player);
      systemLine(
        room,
        spectator ? `${player.name} joined as a spectator.` : `${player.name} joined the room.`,
      );
      broadcast(io, room);
      done(ack, { code: room.code, playerId: player.id, token: player.token });

      if (
        room.settings.autoStart &&
        room.phase === 'lobby' &&
        seatedPlayers(room).length >= room.settings.capacity
      ) {
        startRound(io, room);
      }
    });

    socket.on('room:resume', (input, ack) => {
      const found = findPlayerByToken(String(input?.token ?? ''));
      if (!found) return fail(ack, 'That session has expired.');
      attach(socket, found.room, found.player);
      socket.emit('room:state', publicStateFor(found.room, found.player));
      broadcast(io, found.room);
      done(ack, {
        code: found.room.code,
        playerId: found.player.id,
        token: found.player.token,
      });
    });

    ackOnly('room:leave', (ack) => {
      const found = session(socket);
      if (!found) return done(ack);
      const { room, player } = found;
      socket.leave(room.code);
      socket.data.session = undefined;
      removePlayer(room, player.id);
      if (getRoom(room.code)) {
        systemLine(room, `${player.name} left the room.`);
        broadcast(io, room);
      }
      done(ack);
    });

    socket.on('room:kick', ({ playerId }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const error = hostInLobby(found.room, found.player);
      if (error) return fail(ack, error);
      const target = found.room.players.find((p) => p.id === playerId);
      if (!target || target.host) return fail(ack, 'That player cannot be removed.');
      const targetSocket = target.socketId ? io.sockets.sockets.get(target.socketId) : undefined;
      targetSocket?.emit('room:closed', { reason: 'The host removed you from the room.' });
      targetSocket?.leave(found.room.code);
      removePlayer(found.room, target.id);
      broadcast(io, found.room);
      done(ack);
    });

    socket.on('room:transferHost', ({ playerId }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!found.player.host) return fail(ack, 'Only the host can pass the crown.');
      const target = found.room.players.find((p) => p.id === playerId);
      if (!target) return fail(ack, 'That player has left.');
      for (const p of found.room.players) p.host = p.id === target.id;
      systemLine(found.room, `${target.name} is now the host.`);
      broadcast(io, found.room);
      done(ack);
    });

    socket.on('room:settings', ({ settings }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const error = hostInLobby(found.room, found.player);
      if (error) return fail(ack, error);
      found.room.settings = { ...sanitiseSettings(settings), capacity: found.room.settings.capacity };
      broadcast(io, found.room);
      done(ack);
    });

    socket.on('room:mode', ({ mode }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const error = hostInLobby(found.room, found.player);
      if (error) return fail(ack, error);
      if (mode !== 'word' && mode !== 'drawing') return fail(ack, 'Choose a game mode.');
      found.room.mode = mode;
      broadcast(io, found.room);
      done(ack);
    });

    ackOnly('room:start', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const error = hostInLobby(found.room, found.player);
      if (error) return fail(ack, error);
      if (seatedPlayers(found.room).length < MIN_PLAYERS) {
        return fail(ack, `You need at least ${MIN_PLAYERS} players.`);
      }
      startRound(io, found.room);
      done(ack);
    });

    /* -------------------------------------------------------- in-game */

    socket.on('game:chat', ({ text }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!rateLimit(socket, 'chat', 20, 10_000)) return fail(ack, 'Slow down a moment.');
      const { room, player } = found;
      const clean = clip(text, LIMITS.message.max);
      if (!clean) return fail(ack, 'Write something first.');
      if (room.phase === 'lobby') return fail(ack, 'The game has not started yet.');
      /*
       * The clue phase belongs to one player at a time: their line is the clue, and
       * nobody else's writing goes into the room until the discussion opens.
       */
      if (room.phase === 'clues') {
        return currentCluePlayer(room)?.id === player.id
          ? fail(ack, 'It is your turn — send your clue.')
          : fail(ack, 'Chat is closed until everyone has clued.');
      }
      if (room.settings.channels === 'voice' && room.phase !== 'result') {
        return fail(ack, 'This room talks over voice, not chat.');
      }
      room.chat.push({
        id: nextId('msg'),
        kind: 'chat',
        playerId: player.id,
        name: player.name,
        text: clean,
        at: Date.now(),
      });
      if (room.chat.length > LIMITS.chatHistory) {
        room.chat.splice(0, room.chat.length - LIMITS.chatHistory);
      }
      broadcast(io, room);
      done(ack);
    });

    socket.on('game:clue', ({ text }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!rateLimit(socket, 'clue', 10, 10_000)) return fail(ack, 'Slow down a moment.');
      const { room, player } = found;
      if (room.phase !== 'clues') return fail(ack, 'Clues are closed.');
      if (currentCluePlayer(room)?.id !== player.id) return fail(ack, 'It is not your turn.');
      const clean = clip(text, LIMITS.message.max);
      if (!clean) return fail(ack, 'Write a clue first.');

      room.chat.push({
        id: nextId('msg'),
        kind: 'clue',
        playerId: player.id,
        name: player.name,
        text: clean,
        at: Date.now(),
      });

      // Drawing mode: the turn is the board, and "done" moves the pencil on.
      room.clueIndex += 1;
      if (room.clueIndex >= room.clueOrder.length) beginDiscussion(io, room);
      else {
        // The board is deliberately NOT cleared: everyone keeps adding to one picture.
        systemLine(room, `${currentCluePlayer(room)?.name ?? 'Next player'} is up.`);
        broadcast(io, room);
      }
      done(ack);
    });

    ackOnly('game:ready', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const { room, player } = found;
      player.ready = true;
      const waiting = seatedPlayers(room).filter((p) => !p.ready);
      if (waiting.length === 0 && room.phase === 'reveal') {
        room.phase = 'clues';
        room.clueIndex = 0;
        systemLine(room, `Clues start with ${currentCluePlayer(room)?.name ?? 'the first player'}.`);
      }
      broadcast(io, room);
      done(ack);
    });

    ackOnly('game:discussion', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!canAdvance(found.room, found.player)) return fail(ack, 'Only the host can do that.');
      if (found.room.phase !== 'clues') return fail(ack, 'Not in the clue phase.');
      beginDiscussion(io, found.room);
      done(ack);
    });

    socket.on('game:vote', ({ targetId }, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const { room, player } = found;
      if (room.phase !== 'voting') return fail(ack, 'Voting is closed.');
      if (player.spectator) return fail(ack, 'Spectators do not vote.');
      if (targetId === player.id) return fail(ack, 'You cannot vote for yourself.');
      if (targetId !== null && !seatedPlayers(room).some((p) => p.id === targetId)) {
        return fail(ack, 'That player has left.');
      }
      room.votes.set(player.id, targetId ?? null);
      if (everyoneVoted(room)) finishRound(io, room);
      else broadcast(io, room);
      done(ack);
    });

    /* ---------------------------------------------------------- voice */

    socket.on('voice:join', async (ack) => {
      const found = session(socket);
      if (!found) return reply(ack, { ok: false, configured: voiceConfigured(), error: 'You are not in a room.' });
      const { room, player } = found;

      if (room.settings.channels === 'chat') {
        return reply(ack, {
          ok: false,
          configured: voiceConfigured(),
          error: 'This room is chat only.',
        });
      }
      if (!voiceConfigured()) {
        return reply(ack, {
          ok: false,
          configured: false,
          error: 'Voice is not configured on this server yet.',
        });
      }

      try {
        const { url, token } = await voiceToken({
          code: room.code,
          playerId: player.id,
          name: player.name,
        });
        reply(ack, { ok: true, url, token, room: livekitRoom(room.code) });
      } catch (error) {
        reply(ack, {
          ok: false,
          configured: true,
          error: error instanceof Error ? error.message : 'Could not start voice.',
        });
      }
    });

    ackOnly('game:voting', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!canAdvance(found.room, found.player)) return fail(ack, 'Only the host can do that.');
      if (found.room.phase !== 'discussion') return fail(ack, 'Discussion is not open.');
      beginVoting(io, found.room);
      done(ack);
    });

    ackOnly('game:nextRound', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!canAdvance(found.room, found.player)) return fail(ack, 'Only the host can do that.');
      if (found.room.phase !== 'result') return fail(ack, 'The round is not over.');
      found.room.round += 1;
      startRound(io, found.room);
      done(ack);
    });

    ackOnly('game:again', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!canAdvance(found.room, found.player)) return fail(ack, 'Only the host can do that.');
      found.room.round = 1;
      startRound(io, found.room);
      done(ack);
    });

    ackOnly('game:toLobby', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      if (!canAdvance(found.room, found.player)) return fail(ack, 'Only the host can do that.');
      resetToLobby(io, found.room);
      done(ack);
    });

    /* -------------------------------------------------------- drawing */

    socket.on('draw:stroke', (input, ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const { room, player } = found;
      if (room.mode !== 'drawing') return fail(ack, 'This room is not drawing.');
      if (room.phase !== 'clues') return fail(ack, 'Drawing is not open.');
      if (currentCluePlayer(room)?.id !== player.id) return fail(ack, 'It is not your turn.');
      const points = cleanPoints(input?.points);
      if (points.length < 4) return fail(ack, 'Bad stroke.');
      const stroke = {
        points,
        color: clip(input.color, 24) || '#ffffff',
        size: Math.max(1, Math.min(40, Number(input.size) || 4)),
      };
      pushStroke(room, stroke);
      // Everyone else gets the stroke immediately...
      socket.to(room.code).emit('draw:stroke', stroke);
      // ...and the snapshot follows so the stroke count and a late joiner agree.
      broadcast(io, room);
      done(ack);
    });

    socket.on('draw:live', (input) => {
      const found = session(socket);
      if (!found) return;
      const { room, player } = found;
      if (room.mode !== 'drawing' || room.phase !== 'clues') return;
      socket.to(room.code).emit('draw:live', {
        playerId: player.id,
        points: cleanPoints(input?.points),
        color: clip(input?.color, 24) || '#ffffff',
        size: Math.max(1, Math.min(40, Number(input?.size) || 4)),
      });
    });

    ackOnly('draw:pass', (ack, input) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const { room, player } = found;
      if (room.mode !== 'drawing') return fail(ack, 'This room is not drawing.');
      if (room.phase !== 'clues') return fail(ack, 'Drawing is not open.');
      if (currentCluePlayer(room)?.id !== player.id) return fail(ack, 'It is not your turn.');
      const keep = (input as { keep?: boolean } | undefined)?.keep !== false;

      if (!keep) {
        room.strokes = [];
        io.to(room.code).emit('draw:clear');
      }
      room.clueIndex += 1;
      if (room.clueIndex >= room.clueOrder.length) {
        beginDiscussion(io, room);
      } else {
        systemLine(
          room,
          keep
            ? `${currentCluePlayer(room)?.name ?? 'Next player'} is up — keep the drawing going.`
            : `${currentCluePlayer(room)?.name ?? 'Next player'} starts a fresh drawing.`,
        );
        broadcast(io, room);
      }
      done(ack);
    });

    ackOnly('draw:clear', (ack) => {
      const found = session(socket);
      if (!found) return fail(ack, 'You are not in a room.');
      const { room, player } = found;
      if (room.mode !== 'drawing') return fail(ack, 'This room is not drawing.');
      if (!canAdvance(room, player)) return fail(ack, 'Only the host can clear the board.');
      room.strokes = [];
      bump(room);
      io.to(room.code).emit('draw:clear');
      broadcast(io, room);
      done(ack);
    });

    /* ----------------------------------------------------- disconnect */

    socket.on('disconnect', () => {
      const found = session(socket);
      if (!found) return;
      const { room, player } = found;
      /*
       * The same player can hold the seat from two tabs (or a phone and a laptop).
       * `attach()` records the newest socket, so if this is not that socket, the
       * seat is still live and closing this tab must change nothing.
       */
      if (player.socketId && player.socketId !== socket.id) return;
      player.connected = false;
      player.socketId = null;
      systemLine(room, `${player.name} lost connection.`);
      // The seat is held for a minute so a refresh does not lose the game.
      setTimeout(() => {
        const still = getRoom(room.code);
        const record = still?.players.find((p) => p.id === player.id);
        if (!still || !record || record.connected || record.socketId) return;
        removePlayer(still, record.id);
        if (getRoom(still.code)) {
          systemLine(still, `${record.name} left the room.`);
          broadcast(io, still);
        }
      }, 60_000).unref?.();
      broadcast(io, room);
    });
  });
}

/* ------------------------------------------------------------------- internals */

function resetToLobby(io: Io, room: RoomRecord): void {
  clearTimer(room);
  room.phase = 'lobby';
  room.round = 0;
  room.clueOrder = [];
  room.clueIndex = 0;
  room.votes = new Map();
  room.result = null;
  room.deadline = null;
  room.strokes = [];
  room.chat = [];
  for (const p of room.players) {
    p.role = null;
    p.word = null;
    p.hint = null;
    p.ready = false;
    p.spectator = false;
  }
  systemLine(room, 'Back in the lobby.');
  broadcast(io, room);
}

function cleanPoints(points: unknown): number[] {
  if (!Array.isArray(points)) return [];
  return points
    .slice(0, LIMITS.strokePoints)
    .map((n) => Number(n))
    .map((n) => (Number.isFinite(n) ? Math.round(n * 1000) / 1000 : 0));
}

export function stats() {
  return { rooms: roomCount() };
}

/** Re-exported so the server entry point and tests share one lifecycle surface. */
export const lifecycle = { sweep, shuffle, destroyRoom };
