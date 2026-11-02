import { randomBytes } from 'node:crypto';
import { DEFAULT_SETTINGS, normaliseSettings, parseSettings, type RoomSettings } from './settings';

// Prototype storage: all players must reach the same running server process.
export const avatars = ['crew-red', 'cyber-neon', 'galaxy-cosmic', 'premium-galaxy', 'premium-gold', 'premium-neon'] as const;
type Avatar = typeof avatars[number];
type Player = { name: string; avatar: Avatar; token: string; host: boolean };
type Room = { code: string; mode: 'word' | 'drawing'; capacity: number; settings: RoomSettings; players: Player[]; createdAt: number };
type RoomStore = Map<string, Room>;
const globalStore = globalThis as typeof globalThis & { onlineRooms?: RoomStore };
const rooms: RoomStore = globalStore.onlineRooms ??= new Map<string, Room>();
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function cleanRooms() {
  for (const [code, room] of rooms) if (Date.now() - room.createdAt > 24 * 60 * 60 * 1000) rooms.delete(code);
}
function validPlayer(name: unknown, avatar: unknown): name is string {
  return typeof name === 'string' && /^[\p{L}\p{N} _.-]{2,20}$/u.test(name.trim()) && typeof avatar === 'string' && avatars.includes(avatar as Avatar);
}
function makeCode() {
  let code = '';
  do { code = Array.from(randomBytes(6), byte => alphabet[byte % alphabet.length]).join(''); } while (rooms.has(code));
  return code;
}
function publicRoom(room: Room) {
  return {
    code: room.code,
    mode: room.mode,
    capacity: room.capacity,
    settings: room.settings,
    players: room.players.map(({ name, avatar, host }: Player) => ({ name, avatar, host })),
  };
}
export function createRoom(input: Record<string, unknown>) {
  cleanRooms();
  if (!validPlayer(input.name, input.avatar)) throw new Error('Choose a character and a name of 2–20 letters, numbers, spaces, dots, hyphens or underscores.');
  if (input.mode !== 'word' && input.mode !== 'drawing') throw new Error('Choose a valid game mode.');
  if (!Number.isInteger(input.capacity) || (input.capacity as number) < 3 || (input.capacity as number) > 10) throw new Error('Choose between 3 and 10 players.');

  // Optional host configuration. A malformed payload is rejected rather than
  // silently replaced, so a broken client can never create an odd room.
  let settings: RoomSettings = normaliseSettings({ ...DEFAULT_SETTINGS, capacity: input.capacity as number });
  if (input.settings !== undefined) {
    const parsed = parseSettings(input.settings);
    if (!parsed) throw new Error('Those room settings are not valid.');
    settings = normaliseSettings({ ...parsed, capacity: input.capacity as number });
  }

  const token = randomBytes(32).toString('hex');
  const room: Room = { code: makeCode(), mode: input.mode, capacity: settings.capacity, settings, players: [{ name: (input.name as string).trim(), avatar: input.avatar as Avatar, token, host: true }], createdAt: Date.now() };
  rooms.set(room.code, room);
  return { token, room: publicRoom(room) };
}
export function joinRoom(input: Record<string, unknown>) {
  cleanRooms();
  if (!validPlayer(input.name, input.avatar)) throw new Error('Choose a character and a name of 2–20 letters, numbers, spaces, dots, hyphens or underscores.');
  const code = typeof input.code === 'string' ? input.code.trim().toUpperCase() : '';
  const room = rooms.get(code);
  if (!room) throw new Error('Room not found. Check the room code.');
  if (room.players.length >= room.capacity) throw new Error('This room is full.');
  const name = (input.name as string).trim();
  if (room.players.some(player => player.name.toLowerCase() === name.toLowerCase())) throw new Error('That name is already in this room.');
  const token = randomBytes(32).toString('hex');
  room.players.push({ name, avatar: input.avatar as Avatar, token, host: false });
  return { token, room: publicRoom(room) };
}
export function getRoom(code: string, token: string) {
  cleanRooms();
  const room = rooms.get(code.toUpperCase());
  if (!room || !room.players.some(player => player.token === token)) return null;
  return publicRoom(room);
}
