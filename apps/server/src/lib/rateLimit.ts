/**
 * Tiny in-memory rate limiter.
 *
 * One bucket per (socket, action). Enough to stop a stuck client from hammering
 * create/join/chat; a multi-instance deployment would move this to Redis.
 */

import type { Socket } from 'socket.io';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(socket: Socket, action: string, max: number, windowMs: number): boolean {
  const key = `${socket.id}:${action}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

/** Forget a socket's buckets when it goes away. */
export function forget(socketId: string): void {
  for (const key of buckets.keys()) {
    if (key.startsWith(`${socketId}:`)) buckets.delete(key);
  }
}
