'use client';

/**
 * Live voice for a room.
 *
 * This is a real microphone: `livekit-client` captures it with getUserMedia, publishes
 * it to a LiveKit room, and plays everyone else's track back. Muting stops the track
 * rather than hiding a button.
 *
 * Two things it deliberately does not do: it never holds the API secret (the server
 * mints a short-lived token per player), and it never claims to work when the server
 * has no LiveKit credentials — that case says so and shows nothing else.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConnectionState,
  Room as LivekitRoom,
  RoomEvent,
  Track,
  type LocalParticipant,
  type RemoteParticipant,
} from 'livekit-client';
import { BTN_RESET } from '@/components/local/controls';
import { getSocket } from '@/lib/rooms/socket';
import type { RoomState, VoiceAck } from '@shared/contract';

const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]';

type Status = 'idle' | 'connecting' | 'live' | 'blocked' | 'unavailable' | 'error';

export function VoiceDock({ state }: { state: RoomState }) {
  const roomRef = useRef<LivekitRoom | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState('');
  /** player ids currently publishing a mic track, mapped to speaking */
  const [speaking, setSpeaking] = useState<Record<string, boolean>>({});
  const [connected, setConnected] = useState<string[]>([]);

  const nameOf = useCallback(
    (id: string) => state.players.find((p) => p.id === id)?.name ?? 'Player',
    [state.players],
  );

  const leave = useCallback(() => {
    const room = roomRef.current;
    roomRef.current = null;
    setSpeaking({});
    setConnected([]);
    setMuted(true);
    if (room) void room.disconnect();
    setStatus('idle');
  }, []);

  // Leaving the room, or the room going away, must not leave a mic hot.
  useEffect(() => leave, [leave]);

  const join = useCallback(async () => {
    setError('');
    setStatus('connecting');

    const ack = await new Promise<VoiceAck>((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve({ ok: false, configured: true, error: 'The server did not answer.' });
        }
      }, 8000);
      getSocket().emit('voice:join', (result: VoiceAck) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(result);
      });
    });

    if (!ack.ok) {
      setStatus(ack.configured ? 'error' : 'unavailable');
      setError(ack.error);
      return;
    }

    try {
      const room = new LivekitRoom({
        adaptiveStream: false,
        dynacast: false,
      });
      roomRef.current = room;

      const syncParticipants = () => {
        const ids: string[] = [];
        const speakingMap: Record<string, boolean> = {};
        const collect = (participant: LocalParticipant | RemoteParticipant) => {
          ids.push(participant.identity);
          speakingMap[participant.identity] = participant.isSpeaking;
        };
        if (room.localParticipant) collect(room.localParticipant);
        room.remoteParticipants.forEach(collect);
        setConnected(ids);
        setSpeaking(speakingMap);
      };

      room
        .on(RoomEvent.ParticipantConnected, syncParticipants)
        .on(RoomEvent.ParticipantDisconnected, syncParticipants)
        .on(RoomEvent.ActiveSpeakersChanged, syncParticipants)
        .on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === Track.Kind.Audio) {
            // LiveKit gives us an <audio> element; attach it so we hear them.
            const element = track.attach();
            element.autoplay = true;
            element.setAttribute('data-voice', track.sid ?? 'remote');
            document.body.appendChild(element);
          }
          syncParticipants();
        })
        .on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((el) => el.remove());
          syncParticipants();
        })
        .on(RoomEvent.Disconnected, () => {
          setStatus('idle');
          setConnected([]);
          setSpeaking({});
        });

      await room.connect(ack.url, ack.token);
      // Publishing is what actually asks the browser for the microphone.
      await room.localParticipant.setMicrophoneEnabled(true);
      setMuted(false);
      setStatus('live');
      syncParticipants();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      const denied = /permission|denied|notallowed/i.test(message);
      setStatus(denied ? 'blocked' : 'error');
      setError(
        denied
          ? 'The browser blocked the microphone. Allow it in the address bar, then try again.'
          : message,
      );
      await roomRef.current?.disconnect();
      roomRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  }, [muted]);

  const others = state.players.filter((p) => p.id !== state.you.id);
  const live = status === 'live';

  return (
    <div className="rounded-[14px] bg-[#160d33]/85 px-3 py-2 ring-1 ring-inset ring-[#8a69c4]/35">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={[
              'grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-inset',
              live && !muted
                ? 'bg-[#22C55E]/20 ring-[#22C55E]/50'
                : 'bg-white/[0.06] ring-white/15',
            ].join(' ')}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <rect
                x="9"
                y="3"
                width="6"
                height="11"
                rx="3"
                stroke={live && !muted ? '#4ADE80' : '#9CA3AF'}
                strokeWidth="1.8"
              />
              <path
                d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3"
                stroke={live && !muted ? '#4ADE80' : '#9CA3AF'}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="m-0 text-[0.78rem] font-extrabold text-white">
              {status === 'idle' && 'Voice channel'}
              {status === 'connecting' && 'Connecting…'}
              {status === 'live' && (muted ? 'Mic muted' : 'Mic live')}
              {status === 'blocked' && 'Microphone blocked'}
              {status === 'unavailable' && 'Voice not configured'}
              {status === 'error' && 'Voice failed'}
            </p>
            <p className="m-0 truncate text-[0.64rem] font-semibold text-white/50">
              {status === 'idle' && `${others.length} other player${others.length === 1 ? '' : 's'} — tap to join`}
              {status === 'connecting' && 'Asking the server for a token'}
              {status === 'live' && `${connected.length} in the call · ${others.filter((p) => speaking[p.id]).length} talking`}
              {status === 'blocked' && 'Allow the mic, then try again'}
              {status === 'unavailable' && 'Add LiveKit keys on the server'}
              {status === 'error' && 'See the message below'}
            </p>
          </div>
        </div>

        {live ? (
          <button
            type="button"
            role="switch"
            aria-checked={!muted}
            onClick={() => void toggleMute()}
            className={[
              BTN_RESET,
              'shrink-0 rounded-[11px] px-3.5 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-white',
              'transition-transform duration-fast ease-out active:translate-y-[1px]',
              FOCUS,
              muted
                ? 'bg-[#5933a2] shadow-[0_3px_0_#3B1F6B]'
                : 'bg-[#BE123C] shadow-[0_3px_0_#7F1D1D]',
            ].join(' ')}
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void join()}
            disabled={status === 'connecting' || status === 'unavailable'}
            className={[
              BTN_RESET,
              'shrink-0 rounded-[11px] bg-[#22C55E] px-3.5 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[#052e16]',
              'shadow-[0_3px_0_#15803D] transition-transform duration-fast ease-out active:translate-y-[1px] disabled:opacity-40',
              FOCUS,
            ].join(' ')}
          >
            {status === 'connecting' ? '…' : 'Join voice'}
          </button>
        )}
      </div>

      {live && (
        <ul className="m-0 mt-2 flex list-none flex-wrap gap-1.5 p-0">
          {[state.players.find((p) => p.id === state.you.id), ...others]
            .filter(Boolean)
            .map((player) => {
              const isMe = player!.id === state.you.id;
              const inCall = connected.includes(player!.id);
              const talking = speaking[player!.id];
              return (
                <li
                  key={player!.id}
                  className={[
                    'rounded-full px-2.5 py-1 text-[0.66rem] font-bold',
                    talking
                      ? 'bg-[#22C55E]/25 text-[#BBF7D0] ring-1 ring-inset ring-[#4ADE80]/50'
                      : inCall
                        ? 'bg-white/10 text-white/70'
                        : 'bg-white/[0.04] text-white/30',
                  ].join(' ')}
                >
                  {isMe ? 'You' : nameOf(player!.id)}
                  {isMe && muted ? ' · muted' : ''}
                </li>
              );
            })}
        </ul>
      )}

      {error && (
        <p role="alert" className="m-0 mt-2 text-[0.68rem] font-semibold leading-snug text-[#FBCFE8]">
          {error}
        </p>
      )}

      {status === 'unavailable' && (
        <p className="m-0 mt-2 text-[0.64rem] font-semibold leading-snug text-white/40">
          Set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET in the server&apos;s .env, then
          restart it. Chat still works.
        </p>
      )}
    </div>
  );
}
