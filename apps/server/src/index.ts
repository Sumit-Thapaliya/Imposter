/**
 * Imposter Game server.
 *
 * Fastify for HTTP (a health probe + a room lookup, nothing more) and Socket.IO for
 * everything real-time. All game rules live here — see `game/rules.ts`.
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../../../packages/shared-types/src/contract';
import { HOST, ORIGINS, PORT } from './env';
import { registerRoomHandlers, stats } from './sockets/roomHandlers';
import { getRoom, roomCount } from './rooms/store';

const fastify = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } });

await fastify.register(cors, { origin: ORIGINS === '*' ? true : ORIGINS });

fastify.get('/health', async () => ({
  ok: true,
  uptime: Math.round(process.uptime()),
  rooms: roomCount(),
  version: process.env.npm_package_version ?? '0.1.0',
}));

/** Handy for debugging a room without opening two browsers. */
fastify.get<{ Params: { code: string } }>('/rooms/:code', async (request, reply) => {
  const room = getRoom(request.params.code);
  if (!room) return reply.code(404).send({ error: 'Room not found.' });
  return {
    code: room.code,
    mode: room.mode,
    phase: room.phase,
    round: room.round,
    players: room.players.map((p) => ({
      name: p.name,
      avatar: p.avatar,
      host: p.host,
      connected: p.connected,
      socket: p.socketId,
      spectator: p.spectator,
    })),
  };
});

/* --------------------------------------------------------------- socket.io */

// The io instance hangs off Fastify's HTTP server so both share one port.
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(fastify.server, {
  cors: { origin: ORIGINS === '*' ? true : ORIGINS, credentials: true },
  // A phone that sleeps should come back to the same socket, not a new seat.
  pingInterval: 20_000,
  pingTimeout: 25_000,
  maxHttpBufferSize: 1e6,
});

registerRoomHandlers(io);

/* -------------------------------------------------------------------- boot */

try {
  await fastify.listen({ port: PORT, host: HOST });
  fastify.log.info(`socket.io ready on :${PORT} (origins: ${ORIGINS === '*' ? '*' : ORIGINS.join(', ')})`);
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}

/* ------------------------------------------------------------ crash safety */

// A thrown handler must never take the process down silently: log it, keep serving.
process.on('uncaughtException', (error) => {
  fastify.log.error({ err: error }, 'uncaught exception');
});
process.on('unhandledRejection', (reason) => {
  fastify.log.error({ err: reason }, 'unhandled rejection');
});

/* --------------------------------------------------------- graceful close */

async function shutdown(signal: string) {
  fastify.log.info(`${signal} — closing`);
  await io.close();
  await fastify.close();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

export { fastify, io, stats };
