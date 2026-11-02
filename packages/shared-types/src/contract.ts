/**
 * The single source of truth for the online game: room state, client actions and
 * Socket.IO events.
 *
 * Imported by all three apps — `apps/server` (relative import), `apps/web` (via the
 * `@shared/contract` type alias) and `apps/mobile` (via `@shared/contract`).
 *
 * This file is deliberately TYPE-ONLY. Nothing here is emitted at runtime, so a
 * frontend that only imports types never has to bundle it.
 *
 * Rules of the house:
 *  - the server is authoritative; clients render `RoomState` and send actions
 *  - nothing secret ever travels in `RoomState` except to the player it belongs to
 *    (`role`, `word`, `hint` are answered per-socket, never broadcast)
 */

/* ------------------------------------------------------------------ primitives */

export type GameMode = 'word' | 'drawing';
export type AvatarId = string;

export const AVATAR_IDS = [
  'crew-red',
  'cyber-neon',
  'galaxy-cosmic',
  'premium-galaxy',
  'premium-gold',
  'premium-neon',
] as const;

/** Where a room is in the round loop. */
export type Phase =
  | 'lobby'
  | 'reveal'
  | 'clues'
  | 'discussion'
  | 'voting'
  | 'result';

export type ChannelMode = 'chat' | 'voice' | 'both';
export type Role = 'crew' | 'imposter';

/* -------------------------------------------------------------------- settings */

export type RoomSettings = {
  capacity: number;
  imposters: number;
  imposterTeam: 'separate' | 'shared';
  rounds: number;
  domain: string;
  hints: boolean;
  revealTeammates: boolean;
  clueTimer: number;
  discussionTimer: number;
  autoStart: boolean;
  channels: ChannelMode;
  voting: 'open' | 'secret';
  allowSpectators: boolean;
  lateJoin: boolean;
};

/* ----------------------------------------------------------------------- state */

export type Stroke = { points: number[]; color: string; size: number };

export type PublicPlayer = {
  id: string;
  name: string;
  avatar: AvatarId;
  host: boolean;
  /** false while a phone is asleep or the tab is closed */
  connected: boolean;
  /** a disconnected player can be replaced by a new joiner */
  ready: boolean;
  /** watching without a seat this round */
  spectator: boolean;
  score: number;
};

export type ChatEntry = {
  id: string;
  kind: 'chat' | 'clue' | 'system';
  /** null for system lines */
  playerId: string | null;
  name: string | null;
  text: string;
  at: number;
};

export type Vote = {
  voterId: string;
  voterName: string;
  /** null = abstained */
  targetId: string | null;
  targetName: string | null;
};

export type RoundResult = {
  /** null when nobody was voted out (tie or everyone abstained) */
  ejectedId: string | null;
  ejectedName: string | null;
  /** true when the ejected player was an imposter */
  caught: boolean;
  winner: 'crew' | 'imposters' | 'none';
  imposters: { id: string; name: string; avatar: AvatarId }[];
  word: string;
  votes: Vote[];
};

/**
 * Everything a client needs to paint the current screen.
 *
 * Sanitised per socket: `role`/`word`/`hint`/`teammates` are filled in only for the
 * player receiving the snapshot, and `votes` are withheld until the result phase
 * when the room is on secret voting.
 */
export type RoomState = {
  code: string;
  mode: GameMode;
  phase: Phase;
  settings: RoomSettings;
  players: PublicPlayer[];
  hostId: string;
  /** 1-based */
  round: number;
  totalRounds: number;
  /** player ids in the order they give clues this round */
  clueOrder: string[];
  /** index into `clueOrder`; === clueOrder.length when every clue is in */
  clueIndex: number;
  chat: ChatEntry[];
  votes: Vote[];
  /** epoch ms the current timed phase ends, or null when untimed */
  deadline: number | null;
  result: RoundResult | null;
  /** in drawing mode, the board so far (empty in word mode) */
  strokes: Stroke[];
  /** the viewer's own secrets — never another player's */
  you: {
    id: string;
    role: Role | null;
    /** the secret word; null for imposters */
    word: string | null;
    /** the imposter hint; null for the crew */
    hint: string | null;
    /** names of the other imposters, only when the host turned it on */
    teammates: string[];
    hasVoted: boolean;
    hasClued: boolean;
  };
  /** monotonic; lets a client drop out-of-order snapshots */
  version: number;
};

/* --------------------------------------------------------------------- actions */

export type CreateInput = {
  name: string;
  avatar: AvatarId;
  mode: GameMode;
  settings: RoomSettings;
};

export type JoinInput = {
  code: string;
  name: string;
  avatar: AvatarId;
};

export type ResumeInput = {
  code: string;
  token: string;
};

/** Every acknowledgement carries either data or a human-readable reason. */
export type Ack = {
  ok: boolean;
  /** present when ok === false */
  error?: string;
  /** present on create / join / resume */
  session?: Session;
};

/**
 * The answer to `voice:join`.
 *
 * `configured: false` means the server has no LiveKit credentials — the client should
 * say so plainly rather than showing a mic button that does nothing.
 */
export type VoiceAck =
  | { ok: true; url: string; token: string; room: string }
  | { ok: false; configured: boolean; error: string };

export type Session = {
  code: string;
  playerId: string;
  /** stored on the device; the only credential a player has */
  token: string;
};

/* ---------------------------------------------------------------------- events */

/** Handshake: the token is sent in `auth` so a reconnect lands back in its seat. */
export type HandshakeAuth = {
  token?: string;
};

export type ClientToServerEvents = {
  'room:create': (input: CreateInput, ack: (result: Ack) => void) => void;
  'room:join': (input: JoinInput, ack: (result: Ack) => void) => void;
  'room:resume': (input: ResumeInput, ack: (result: Ack) => void) => void;
  'room:leave': (ack?: (result: Ack) => void) => void;
  'room:kick': (input: { playerId: string }, ack?: (result: Ack) => void) => void;
  'room:transferHost': (input: { playerId: string }, ack?: (result: Ack) => void) => void;
  'room:settings': (input: { settings: RoomSettings }, ack?: (result: Ack) => void) => void;
  'room:mode': (input: { mode: GameMode }, ack?: (result: Ack) => void) => void;
  'room:start': (ack?: (result: Ack) => void) => void;
  /** ask for a short-lived LiveKit token for this room */
  'voice:join': (ack: (result: VoiceAck) => void) => void;

  'game:chat': (input: { text: string }, ack?: (result: Ack) => void) => void;
  /** "I have seen my card" — the round moves on when everyone has */
  'game:ready': (ack?: (result: Ack) => void) => void;
  'game:clue': (input: { text: string }, ack?: (result: Ack) => void) => void;
  'game:discussion': (ack?: (result: Ack) => void) => void;
  /**
   * Drawing mode: the end of your turn on the shared board.
   *
   * `keep` continues the same picture (the default and what the app sends);
   * `clear` wipes it for the next player, if a room ever wants skribbl rules.
   */
  'draw:pass': (input: { keep: boolean }, ack?: (result: Ack) => void) => void;
  /** close the discussion and open voting (host, or anyone once the clock is off) */
  'game:voting': (ack?: (result: Ack) => void) => void;
  'game:vote': (input: { targetId: string | null }, ack?: (result: Ack) => void) => void;
  'game:nextRound': (ack?: (result: Ack) => void) => void;
  'game:again': (ack?: (result: Ack) => void) => void;
  'game:toLobby': (ack?: (result: Ack) => void) => void;

  /** drawing mode: one finished stroke, normalised 0..1 against the board */
  'draw:stroke': (
    input: { points: number[]; color: string; size: number },
    ack?: (result: Ack) => void,
  ) => void;
  'draw:clear': (ack?: (result: Ack) => void) => void;
  /** live stroke while a finger is down, so others watch it appear */
  'draw:live': (input: { points: number[]; color: string; size: number }) => void;
};

export type ServerToClientEvents = {
  'room:state': (state: RoomState) => void;
  'room:error': (payload: { message: string }) => void;
  /** fired to the one player whose session died (kicked, room expired) */
  'room:closed': (payload: { reason: string }) => void;
  /** someone else's finger is down right now */
  'draw:live': (payload: { playerId: string; points: number[]; color: string; size: number }) => void;
  'draw:liveEnd': (payload: { playerId: string }) => void;
  /** a finished stroke, already committed server-side */
  'draw:stroke': (payload: Stroke) => void;
  'draw:clear': () => void;
};

export type InterServerEvents = Record<string, never>;
export type SocketData = { session?: Session };

/* ----------------------------------------------------------------- sanity limits */

export const LIMITS = {
  name: { min: 2, max: 20 },
  message: { max: 240 },
  chatHistory: 120,
  strokePoints: 4000,
} as const;
