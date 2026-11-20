/**
 * The app's side of the socket contract — the native twin of
 * `apps/web/src/lib/rooms/socket.ts`.
 *
 * One socket for the whole app, created lazily. The player's session token lives in
 * memory for the life of the process: a phone that reconnects (losing wifi, going to
 * sleep) reclaims its seat, and a cold start simply joins fresh. Persisting the token
 * would need a storage package, and a stale token is worse than none.
 */

import { io, type Socket } from 'socket.io-client';
import type {
  Ack,
  ClientToServerEvents,
  RoomState,
  ServerToClientEvents,
} from '../../shared/contract';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Where the game server is.
 *
 *   1. `EXPO_PUBLIC_SERVER_URL` — set this to your deployed server, or to your laptop's
 *      LAN address when testing on a real phone.
 *   2. In development, the host Metro is already serving from — that is the laptop the
 *      phone just talked to, so `http://<that ip>:4000` is the server on the same machine.
 *      This is what makes "scan the QR and it just works" work.
 *   3. The hosted game server. A release build has no Metro host, so this is what a
 *      real install on a phone uses even when no `.env` was supplied.
 */
const EXPLICIT = process.env.EXPO_PUBLIC_SERVER_URL;

/** Metro's URL tells us which machine the phone can actually reach. */
function devHost(): string | null {
  // A release install has no packager to ask; skip the lookup entirely.
  if (!__DEV__) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const { NativeModules } = require('react-native') as {
      NativeModules: { SourceCode?: { scriptURL?: string } };
    };
    const url = NativeModules.SourceCode?.scriptURL;
    if (!url) return null;
    const host = url.split('://')[1]?.split(':')[0]?.split('/')[0];
    if (!host) return null;
    return `http://${host}:4000`;
  } catch {
    return null;
  }
}

export function serverUrl(): string | undefined {
  if (EXPLICIT) return EXPLICIT;
  // Production default: the hosted game server. A local .env can still override
  // this, and Metro's dev host still wins while developing on a laptop.
  return devHost() ?? 'https://imposter-2-0.onrender.com';
}

let socket: Client | null = null;

export type Session = { code: string; playerId: string; token: string };

let session: Session | null = null;

export function getSession(): Session | null {
  return session;
}

export function setSession(next: Session | null): void {
  session = next;
}

export function getSocket(): Client {
  if (socket) return socket;
  socket = io(serverUrl(), {
    transports: ['websocket'],
    // Never give up: phones lose wifi constantly.
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4_000,
    auth: session ? { token: session.token } : {},
  });
  return socket;
}

/**
 * Emit and wait for the acknowledgement, with a deadline.
 *
 * A phone with no signal would otherwise hang forever on a promise that never settles.
 */
/**
 * How long to wait for an acknowledgement before calling it a failure.
 *
 * The hosted server runs on a free tier that sleeps after 15 idle minutes, and a cold
 * start takes about 50 seconds. Waiting 10s means the first player of the day always sees
 * "check your connection" when nothing is wrong with their connection. The first attempt
 * stays short so a real problem is reported quickly, then one retry waits long enough for
 * the server to wake.
 */
const FIRST_TIMEOUT_MS = 10_000;
const WAKE_TIMEOUT_MS = 60_000;

function attempt<K extends keyof ClientToServerEvents>(
  client: Client,
  event: K,
  args: unknown[],
  timeoutMs: number,
): Promise<Ack> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, error: 'timeout' });
    }, timeoutMs);

    const callback = (ack: Ack) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(ack ?? { ok: false, error: 'Empty reply from the server.' });
    };

    (client.emit as unknown as (e: string, ...a: unknown[]) => void)(event, ...args, callback);
  });
}

export async function send<K extends keyof ClientToServerEvents>(
  event: K,
  ...args: unknown[]
): Promise<Ack> {
  const client = getSocket();
  const first = await attempt(client, event, args, FIRST_TIMEOUT_MS);
  // Any real answer (success or a server-side refusal) is final. Only silence is retried.
  if (first.error !== 'timeout') return first;

  // No reply in 10s: the server is probably asleep rather than unreachable. Give it a
  // realistic deadline before telling the player anything.
  if (!client.connected) {
    client.connect();
  }
  const second = await attempt(client, event, args, WAKE_TIMEOUT_MS);
  if (second.error === 'timeout') {
    return {
      ok: false,
      error: 'The game server is taking a while to wake up. Please try again in a minute.',
    };
  }
  return second;
}

/** Live connection state, so a screen can say "reconnecting…" instead of looking frozen. */
export function watchConnection(onChange: (online: boolean) => void): () => void {
  const client = getSocket();
  const up = () => onChange(true);
  const down = () => onChange(false);
  client.on('connect', up);
  client.on('disconnect', down);
  onChange(client.connected);
  return () => {
    client.off('connect', up);
    client.off('disconnect', down);
  };
}

export type { Ack, RoomState };
