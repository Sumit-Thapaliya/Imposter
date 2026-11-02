import { NextRequest, NextResponse } from 'next/server';
import { createRoom, getRoom, joinRoom } from '@/lib/rooms/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Only accept same-origin browser requests.
  try {
    const origin = new URL(request.headers.get('origin') || '');
    if (origin.host !== request.headers.get('host') || !['http:', 'https:'].includes(origin.protocol)) throw new Error();
  } catch { return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 }); }
  try {
    const input = await request.json();
    if (!input || typeof input !== 'object') throw new Error('Invalid request.');
    const result = input.action === 'create' ? createRoom(input) : input.action === 'join' ? joinRoom(input) : null;
    if (!result) throw new Error('Invalid room action.');
    const response = NextResponse.json({ room: result.room });
    const secure = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
    response.cookies.set('room_player', result.token, { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', path: '/', maxAge: 86400, ...(secure ? { partitioned: true } : {}) });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to join room.' }, { status: 400 });
  }
}
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code') ?? '';
  const room = getRoom(code, request.cookies.get('room_player')?.value ?? '');
  if (!room) return NextResponse.json({ error: 'Room not found or your session has expired.' }, { status: 404 });
  return NextResponse.json({ room }, { headers: { 'Cache-Control': 'no-store' } });
}
