'use client';

/**
 * The browser's side of the socket contract.
 *
 * One socket per tab, created lazily, with the player's token held in
 * `localStorage` so a refresh (or a phone that went to sleep) lands back in the same
 * seat instead of creating a ghost player.
 */

import { io, type Socket } from 'socket.io-client';
import type {
  Ack,
  ClientToServerEvents,
  RoomState,
  ServerToClientEvents,
} from '../../../../../packages/shared-types/src/contract';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const TOKEN_KEY = 'imposter.token';
const CODE_KEY = 'imposter.code';

/**
 * Where the game server is.
 *
 *   1. `NEXT_PUBLIC_SERVER_URL` if you set one — use this in production, pointed at
 *      the server's public URL with the socket path allowed.
 *   2. `http://localhost:4000` when the page is served from localhost — the normal
 *      `npm run dev` setup. WebSockets work directly here.
 *   3. otherwise same origin, through the rewrite in `next.config.ts`. Next cannot
 *      upgrade a WebSocket, so that path is long-polling only (still server-push,
 *      still instant) — which is what makes the in-app preview work.
 */
const ENV_URL = process.env.NEXT_PUBLIC_SERVER_URL;
/** Socket.IO's default endpoint. Kept explicit so the proxy in next.config matches. */
const PATH = '/socket.io';

function isLocal(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.local');
}

function connectTarget(): { url?: string; transports: ('websocket' | 'polling')[] } {
  if (ENV_URL) return { url: ENV_URL, transports: ['websocket', 'polling'] };
  if (typeof window !== 'undefined' && isLocal(window.location.hostname)) {
    return { url: 'http://localhost:4000', transports: ['websocket', 'polling'] };
  }
  return { transports: ['polling'] };
}

let socket: Client | null = null;

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSession(token: string, code: string): void {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(CODE_KEY, code);
  } catch {
    /* private mode: the seat lasts until the tab closes */
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(CODE_KEY);
  } catch {
    /* ignore */
  }
}

export function lastCode(): string | null {
  try {
    return window.localStorage.getItem(CODE_KEY);
  } catch {
    return null;
  }
}

export function getSocket(): Client {
  if (socket) return socket;
  const target = connectTarget();
  // Handy in the console (`__imposterSocket`) when a phone and a laptop disagree.
  if (typeof window !== 'undefined') {
    (window as unknown as { __imposterSocket?: unknown }).__imposterSocket = socket;
  }
  socket = io(target.url, {
    path: PATH,
    transports: target.transports,
    // Reconnect aggressively but never give up: phones lose wifi constantly.
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4_000,
  });
  return socket;
}

/**
 * Emit and wait for the acknowledgement.
 *
 * Never hangs: if the server does not answer within `timeout`, the promise resolves
 * with a readable error so the UI can show something instead of spinning forever.
 */
export function send<K extends keyof ClientToServerEvents>(
  event: K,
  ...args: unknown[]
): Promise<Ack> {
  const client = getSocket();
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, error: 'The server did not answer. Check your connection.' });
    }, 8_000);

    const callback = (ack: Ack) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(ack ?? { ok: false, error: 'Empty reply from the server.' });
    };

    // `emit` is heavily overloaded; this cast keeps the call sites readable.
    (client.emit as unknown as (e: string, ...a: unknown[]) => void)(event, ...args, callback);
  });
}

export type { Ack, RoomState };
