/**
 * LiveKit voice tokens.
 *
 * The browser never sees the API secret. It asks our server for a short-lived,
 * room-scoped token and connects to LiveKit with that. The room code doubles as the
 * LiveKit room name, so players in room ABCD12 can only ever join ABCD12.
 *
 * With no credentials configured the whole feature is reported as unavailable and
 * the client shows "voice isn't set up" instead of failing silently.
 */

import { AccessToken, TrackSource } from 'livekit-server-sdk';

export const LIVEKIT_URL = (process.env.LIVEKIT_URL ?? '').trim();
export const LIVEKIT_API_KEY = (process.env.LIVEKIT_API_KEY ?? '').trim();
export const LIVEKIT_API_SECRET = (process.env.LIVEKIT_API_SECRET ?? '').trim();

/** True when all three values are present. */
export function voiceConfigured(): boolean {
  return Boolean(LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET);
}

/** LiveKit room name for a game room. Prefixed so a stray code can't collide. */
export function livekitRoom(code: string): string {
  return `imposter-${code.toUpperCase()}`;
}

/**
 * A token that can join exactly one room, with a microphone and nothing else.
 *
 *   identity  the player's id — the same id the game uses, so the client can map
 *             a participant straight back to a seat
 *   ttl       two hours; a game is minutes, and a leaked token then dies on its own
 */
export async function voiceToken(input: {
  code: string;
  playerId: string;
  name: string;
}): Promise<{ url: string; token: string }> {
  if (!voiceConfigured()) throw new Error('Voice is not configured on this server.');

  const access = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: input.playerId,
    name: input.name,
    ttl: '2h',
  });

  access.addGrant({
    roomJoin: true,
    room: livekitRoom(input.code),
    canPublish: true,
    canSubscribe: true,
    canPublishData: false,
    // no camera: this is a voice game
    canPublishSources: [TrackSource.MICROPHONE],
  });

  const token = await access.toJwt();
  return { url: LIVEKIT_URL, token };
}
