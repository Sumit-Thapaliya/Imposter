'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ScreenShell } from '@/components/ui/ScreenHeader';
import { RoomSettingsFields } from './RoomSettingsFields';
import { RoomGame } from './RoomGame';
import { WordArt, DrawingArt } from '@/components/ui/ModeIcon';
import { BTN_RESET } from '@/components/local/controls';
import { DEFAULT_SETTINGS, normaliseSettings, type RoomSettings } from '@/lib/rooms/settings';
import {
  clearSession,
  getSocket,
  getToken,
  lastCode,
  send,
  setSession,
} from '@/lib/rooms/socket';
import type { RoomState } from '@shared/contract';

/**
 * Online play — choose / create / join / lobby / playing.
 *
 * Tailwind only (the old RoomScreen.module.css is gone). Every native <button>
 * starts from BTN_RESET because preflight is off in this project.
 *
 * The room itself is the server's in-memory store; this screen polls it while the
 * lobby is open. Settings are sent only on create, and the server validates them.
 */

/**
 * The room is now whatever the server last told us. There is no local copy of the
 * truth: every screen renders `state`, and every control emits an event.
 */
type Connection = 'connecting' | 'live' | 'lost';

const avatars = [
  { id: 'crew-red', label: 'Red', image: '/characters/thumbs/crew-red.webp' },
  { id: 'cyber-neon', label: 'Neon', image: '/characters/thumbs/cyber-neon.webp' },
  { id: 'galaxy-cosmic', label: 'Cosmic', image: '/characters/thumbs/galaxy-cosmic.webp' },
  { id: 'premium-galaxy', label: 'Galaxy', image: '/characters/playtype/premium-galaxy-thumb.png' },
  { id: 'premium-gold', label: 'Gold', image: '/characters/playtype/premium-gold-thumb.png' },
  { id: 'premium-neon', label: 'Electric', image: '/characters/playtype/premium-neon-thumb.png' },
];

const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]';

const CARD =
  'rounded-[20px] bg-[linear-gradient(160deg,#20154BEB,#120D35F2)] ring-1 ring-inset ring-[#8A69C4]/45 shadow-[0_20px_50px_rgba(5,3,26,0.6)]';

const PRIMARY = [
  BTN_RESET,
  'flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3.5',
  'text-[1rem] font-extrabold uppercase tracking-[0.06em] text-[#25142D]',
  'bg-[linear-gradient(#FFD85B,#FFAB18)] shadow-[0_5px_0_#A75A0E]',
  'transition-transform duration-fast ease-out hover:-translate-y-[2px] active:translate-y-[2px]',
  'disabled:opacity-60',
  FOCUS,
].join(' ');

const FIELD =
  'mt-2 block h-[52px] w-full rounded-[13px] border border-[#66519C] bg-[#30235B] px-4 text-[1rem] font-semibold text-white placeholder:text-[#A395BC] focus:border-[#CA9DFF] focus:outline-none focus:ring-[3px] focus:ring-[#AD75F4]/35';

const LABEL = 'block text-[0.8rem] font-extrabold uppercase tracking-[0.09em] text-[#CDBDE8]';

export function RoomScreen() {
  const router = useRouter();
  const [screen, setScreen] = useState<'choose' | 'create' | 'join' | 'lobby' | 'playing'>('choose');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('crew-red');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'word' | 'drawing'>('word');
  const [state, setState] = useState<RoomState | null>(null);
  const [settings, setSettings] = useState<RoomSettings>(DEFAULT_SETTINGS);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connection, setConnection] = useState<Connection>('connecting');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  const room = state;

  function patchSettings(patch: Partial<RoomSettings>) {
    setSettings((current) => normaliseSettings({ ...current, ...patch }));
  }

  // Is there more below the fold? Drives the fade, in place of a scrollbar.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight - el.clientHeight - el.scrollTop > 8);
    check();
    el.addEventListener('scroll', check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', check);
      observer.disconnect();
    };
  }, [screen]);

  /* ---------------------------------------------------------- live state */

  useEffect(() => {
    const socket = getSocket();

    const onState = (next: RoomState) => {
      setState(next);
      setConnection('live');
      setError('');
      // Any room state at all means this tab is seated somewhere.
      setScreen(next.phase === 'lobby' ? 'lobby' : 'playing');
    };
    const onClosed = ({ reason }: { reason: string }) => {
      clearSession();
      setState(null);
      setScreen('choose');
      setError(reason);
    };
    const onConnect = () => {
      setConnection('live');
      // A reconnect must reclaim the seat, not open a second one.
      const token = getToken();
      if (token) void send('room:resume', { token });
    };
    const onDisconnect = () => setConnection('lost');

    socket.on('room:state', onState);
    socket.on('room:closed', onClosed);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    if (socket.connected) onConnect();
    else setConnection('connecting');

    return () => {
      socket.off('room:state', onState);
      socket.off('room:closed', onClosed);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // A fresh page load with a live session goes straight back to its room.
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const socket = getSocket();
    const resume = () => {
      void send('room:resume', { token }).then((ack) => {
        if (!ack.ok) clearSession();
      });
    };
    if (socket.connected) resume();
    else socket.once('connect', resume);
  }, []);

  /* -------------------------------------------------------------- actions */

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const ack =
        screen === 'create'
          ? await send('room:create', { name: name.trim(), avatar, mode, settings })
          : await send('room:join', { code: code.trim().toUpperCase(), name: name.trim(), avatar });

      if (!ack.ok) {
        setError(ack.error ?? 'Something went wrong.');
        return;
      }
      const session = ack.session;
      if (session) setSession(session.token, session.code);
      // The authoritative snapshot arrives on `room:state`; this just unblocks the UI.
      setScreen('lobby');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function back() {
    setError('');
    if (screen === 'playing') return setScreen('lobby');
    if (screen === 'choose') return router.push('/play-type');
    // Leaving a room server-side frees the seat for someone else.
    if (screen === 'lobby') {
      void send('room:leave');
      clearSession();
      setState(null);
    }
    setScreen('choose');
  }

  /** Host actions all look the same from here. */
  async function act(event: 'room:start' | 'game:again' | 'game:toLobby' | 'game:nextRound') {
    const ack = await send(event);
    if (!ack.ok) setError(ack.error ?? 'That did not work.');
  }

  async function copyCode() {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy the room code shown above and share it with your friends.');
    }
  }

  const me = room ? room.players.find((p) => p.id === room.you.id) : undefined;
  const isHost = Boolean(room && room.hostId === room.you.id);
  const channels = room?.settings?.channels ?? 'chat';

  return (
    <ScreenShell backdrop="playtype">
      <div className="relative z-[1] flex h-full w-full max-w-[600px] flex-col md:max-w-[780px] lg:max-w-[1040px]">
        {/* back */}
        {screen !== 'playing' && (
          <button
            type="button"
            onClick={back}
            aria-label="Go back"
            className={[
              BTN_RESET,
              'absolute left-0 top-0 z-20 grid h-11 w-11 place-items-center rounded-[14px]',
              'bg-[#221A54]/75 text-white ring-1 ring-inset ring-[#8E79CF]/45 backdrop-blur-[3px]',
              'transition-transform duration-fast ease-out hover:-translate-x-0.5',
              FOCUS,
            ].join(' ')}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* ONE scroll container for the whole screen — no nested scrolling panes */}
        <div
          ref={scrollRef}
          className={[
            'relative min-h-0 flex-1 overflow-y-auto px-0.5 pb-2',
            // no visible scrollbar: the list fades out at the bottom edge instead,
            // which reads as "there is more" without the OS grey slab
            '[scrollbar-width:none] [-ms-overflow-style:none]',
            '[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0',
          ].join(' ')}
        >
          <div className="m-auto flex min-h-full w-full flex-col gap-2 pt-1">
            <p className="m-0 pl-12 text-center text-[0.74rem] font-extrabold tracking-[0.22em] text-[#CEC0FF]">
              <span className="text-[#FFCD4F]">✦</span> IMPOSTER <span className="text-[#FFCD4F]">✦</span>
            </p>
          {/* ---------------- choose ---------------- */}
          {screen === 'choose' && (
            <div className="flex min-h-full flex-col justify-center gap-4 py-2">
              <header className="text-center">
                <span className="text-[0.74rem] font-extrabold uppercase tracking-[0.16em] text-[#D9A9FF]">
                  Play together
                </span>
                <h1 className="m-0 mt-1 font-display text-[clamp(1.9rem,7vw,2.5rem)] font-extrabold leading-none text-white [text-shadow:0_3px_12px_rgba(8,4,32,0.9)]">
                  Online play
                </h1>
                <p className="m-0 mt-1.5 text-[0.92rem] font-semibold text-[#C7BAE5]">
                  Good friends. Great imposters.
                </p>
              </header>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setScreen('create')}
                  className={[
                    BTN_RESET,
                    'group flex flex-col items-start gap-2 rounded-[22px] p-5 text-left',
                    'bg-[linear-gradient(145deg,#8635DD,#4722A6)] ring-1 ring-inset ring-[#AA8AFF]/55',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_30px_rgba(5,2,28,0.5)]',
                    'transition-transform duration-med ease-out hover:-translate-y-1 active:translate-y-0',
                    FOCUS,
                  ].join(' ')}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white/15 text-[1.5rem] text-white ring-1 ring-inset ring-white/25">
                    ✦
                  </span>
                  <strong className="text-[1.3rem] font-extrabold text-white">Create room</strong>
                  <span className="text-[0.86rem] font-semibold leading-snug text-[#EEE5FF]">
                    Set up a game and invite your friends
                  </span>
                  <span className="mt-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-white/85">
                    Let&apos;s host →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen('join')}
                  className={[
                    BTN_RESET,
                    'group flex flex-col items-start gap-2 rounded-[22px] p-5 text-left',
                    'bg-[linear-gradient(145deg,#168DF2,#183EA9)] ring-1 ring-inset ring-[#7CC4FF]/55',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_30px_rgba(5,2,28,0.5)]',
                    'transition-transform duration-med ease-out hover:-translate-y-1 active:translate-y-0',
                    FOCUS,
                  ].join(' ')}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white/15 text-[1.5rem] text-white ring-1 ring-inset ring-white/25">
                    ⌁
                  </span>
                  <strong className="text-[1.3rem] font-extrabold text-white">Join room</strong>
                  <span className="text-[0.86rem] font-semibold leading-snug text-[#E3F1FF]">
                    Got a code? Jump into the fun
                  </span>
                  <span className="mt-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-white/85">
                    Join a game →
                  </span>
                </button>
              </div>

              <p className="m-0 text-center text-[0.68rem] font-bold tracking-[0.08em] text-[#AE9DCC]">
                ✧ Better together, suspicious forever ✧
              </p>
            </div>
          )}

          {/* ---------------- create / join ---------------- */}
          {(screen === 'create' || screen === 'join') && (
            <form id="room-form" onSubmit={submit} className="flex flex-col gap-3 py-1">
              <header className="text-center">
                <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[#D9A9FF]">
                  {screen === 'create' ? 'Your game, your rules' : 'Your friends are waiting'}
                </span>
                <h1 className="m-0 mt-1 font-display text-[clamp(1.8rem,6.6vw,2.3rem)] font-extrabold leading-none text-white [text-shadow:0_3px_12px_rgba(8,4,32,0.9)]">
                  {screen === 'create' ? 'Create a room' : 'Join a room'}
                </h1>
                <p className="m-0 mt-1.5 text-[0.88rem] font-semibold text-[#C7BAE5]">
                  {screen === 'create' ? 'Get your crew together for game night.' : 'Enter the code and pick your disguise.'}
                </p>
              </header>

              <div className={`${CARD} p-4`}>
                <div className="flex flex-col gap-4">
                  {screen === 'join' && (
                    <label className="block">
                      <span className={LABEL}>Room code</span>
                      <input
                        className={`${FIELD} uppercase tracking-[0.22em]`}
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. ABC234"
                        minLength={6}
                        maxLength={6}
                        required
                      />
                    </label>
                  )}

                  <label className="block">
                    <span className={LABEL}>Player name</span>
                    <input
                      className={FIELD}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      minLength={2}
                      maxLength={20}
                      required
                    />
                  </label>

                  <div className="lg:flex lg:items-center lg:gap-3">
                    <span className={`${LABEL} lg:mb-0 lg:shrink-0`}>Choose your character</span>
                    <div className="mt-2 grid flex-1 grid-cols-6 gap-1.5 lg:mt-0 [&>button]:max-h-[74px]">
                      {avatars.map((item) => {
                        const active = avatar === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={item.label}
                            aria-pressed={active}
                            onClick={() => setAvatar(item.id)}
                            className={[
                              BTN_RESET,
                              'aspect-square overflow-hidden rounded-[13px] p-1 transition-transform duration-fast ease-out',
                              active
                                ? 'bg-[#5A3884] ring-2 ring-[#FFD04B] shadow-[0_0_16px_rgba(255,199,90,0.4)]'
                                : 'bg-[#39285F] ring-2 ring-[#62518C] hover:-translate-y-[2px]',
                              FOCUS,
                            ].join(' ')}
                          >
                            <img src={item.image} alt="" className="h-full w-full object-contain" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {screen === 'create' && (
                    <>
                      <div>
                        <span className={LABEL}>Game mode</span>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {(
                            [
                              { id: 'word' as const, label: 'Word', art: <WordArt /> },
                              { id: 'drawing' as const, label: 'Drawing', art: <DrawingArt /> },
                            ]
                          ).map((item) => {
                            const active = mode === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setMode(item.id)}
                                className={[
                                  BTN_RESET,
                                  'flex items-center justify-center gap-2 rounded-[12px] px-3 py-3',
                                  'text-[0.92rem] font-extrabold transition-transform duration-fast ease-out active:translate-y-[1px]',
                                  active
                                    ? 'bg-[#5933A2] text-white ring-1 ring-inset ring-[#C49AFF] shadow-[0_3px_0_#34186B]'
                                    : 'bg-[#2C2053] text-[#D7CDEB] ring-1 ring-inset ring-[#5B4A8A] hover:bg-[#342658]',
                                  FOCUS,
                                ].join(' ')}
                              >
                                <span className="block h-[19px] w-[19px]">{item.art}</span>
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <RoomSettingsFields settings={settings} onChange={patchSettings} />
                    </>
                  )}
                </div>

              </div>
            </form>
          )}

          {/* ---------------- lobby ---------------- */}
          {screen === 'lobby' && room && (
            <div className="flex flex-col gap-3 py-1">
              <header className="text-center">
                <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[#D9A9FF]">
                  The party starts here
                </span>
                <h1 className="m-0 mt-1 font-display text-[clamp(1.8rem,6.6vw,2.3rem)] font-extrabold leading-none text-white [text-shadow:0_3px_12px_rgba(8,4,32,0.9)]">
                  Game lobby
                </h1>
              </header>

              <div className={`${CARD} p-4`}>
                <div className="flex items-center justify-between gap-2 rounded-[15px] bg-[#302259] px-4 py-3 ring-1 ring-inset ring-[#7B5BAB]/60">
                  <div>
                    <span className="block text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#C9B6E6]">
                      Room code
                    </span>
                    <strong className="mt-1 block text-[1.7rem] font-extrabold leading-none tracking-[0.16em] text-[#FFD45A]">
                      {room.code}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={copyCode}
                    className={[
                      BTN_RESET,
                      'rounded-[11px] bg-white/12 px-3.5 py-2.5 text-[0.78rem] font-extrabold text-white',
                      'ring-1 ring-inset ring-white/20 transition-transform duration-fast ease-out active:translate-y-[1px]',
                      FOCUS,
                    ].join(' ')}
                  >
                    {copied ? 'Copied ✓' : 'Copy code'}
                  </button>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {[
                    room.mode === 'word' ? 'Word mode' : 'Drawing mode',
                    `${room.players.length} / ${room.settings.capacity} players`,
                    `${room.settings.rounds} round${room.settings.rounds > 1 ? 's' : ''}`,
                    room.settings.clueTimer === 0 ? 'no clue clock' : `${room.settings.clueTimer}s clues`,
                    `${room.settings.imposters} imposter${room.settings.imposters > 1 ? 's' : ''}`,
                    room.settings.domain,
                    channels === 'chat' ? 'Chat only' : channels === 'voice' ? 'Voice only' : 'Chat + voice',
                  ]
                    .filter(Boolean)
                    .map((chip) => (
                      <span
                        key={String(chip)}
                        className="rounded-full bg-[#52367E]/55 px-3 py-1.5 text-[0.76rem] font-bold text-[#E3D1FF] ring-1 ring-inset ring-[#8E6ABC]/40"
                      >
                        {chip}
                      </span>
                    ))}
                </div>

                <div className="mt-3.5 flex items-baseline justify-between">
                  <span className={LABEL}>The crew</span>
                  <span className="text-[0.76rem] font-extrabold text-[#CDBDE8]">
                    {room.players.length}/{room.settings.capacity}
                  </span>
                </div>

                <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                  {room.players.map((player) => (
                    <li
                      key={player.name}
                      className="flex items-center gap-3 rounded-[13px] bg-[#342658]/65 px-3 py-2 ring-1 ring-inset ring-[#6C5693]/40"
                    >
                      <img
                        src={avatars.find((a) => a.id === player.avatar)?.image}
                        alt=""
                        className="h-11 w-11 rounded-[11px] bg-[#55417D] object-contain"
                      />
                      <strong className="flex-1 text-[0.95rem] font-extrabold text-white">{player.name}</strong>
                      {player.host && (
                        <span className="flex items-center gap-1 text-[0.74rem] font-extrabold text-[#FFCF50]">
                          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="currentColor">
                            <path d="M3 7.5l3.4 2.6L12 4l5.6 6.1L21 7.5 19.2 17H4.8L3 7.5Z" />
                            <rect x="4.8" y="18" width="14.4" height="2.4" rx="1.2" />
                          </svg>
                          Host
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {error && (
                  <p role="alert" className="m-0 mt-3 rounded-[11px] bg-[#7A244A]/60 px-3 py-2.5 text-[0.84rem] font-semibold text-[#FFD1D8]">
                    {error}
                  </p>
                )}

                {isHost ? (
                  <button
                    type="button"
                    onClick={() => void act('room:start')}
                    disabled={room.players.filter((p) => !p.spectator).length < 3}
                    className={`${PRIMARY} mt-3.5`}
                  >
                    Start game <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <div className="mt-3.5 flex items-center justify-center gap-2 text-[0.86rem] font-bold text-[#D9CAEC]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#59EBAD] shadow-[0_0_10px_#59EBAD]" />
                    Waiting for the host to start…
                  </div>
                )}
                <p className="m-0 mt-2 text-center text-[0.78rem] font-semibold text-[#A996C8]">
                  {isHost
                    ? room.players.filter((p) => !p.spectator).length < 3
                      ? 'You need at least 3 players to start.'
                      : 'Everyone is in — start whenever you like.'
                    : 'The host starts the round.'}
                </p>
              </div>
            </div>
          )}

          {/* ---------------- playing ---------------- */}
          {screen === 'playing' && room && (
            <div className="flex flex-col gap-2 py-1">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[#C4B5FD]">
                  Room {room.code}
                </span>
                <span className="font-display text-[1.3rem] font-extrabold text-white">Game on</span>
              </div>
              <RoomGame state={room} onExit={() => setScreen('lobby')} />
            </div>
          )}
          </div>
        </div>

        {/* the form is long on a phone, so its submit lives outside the scroller and
            never scrolls away; `form=` ties it back to the form element above */}
          {(screen === 'create' || screen === 'join') && (
            <div className="shrink-0 px-0.5 pb-1 pt-2">
              {error && (
                <p role="alert" className="m-0 mb-2 rounded-[11px] bg-[#7A244A]/60 px-3 py-2.5 text-[0.84rem] font-semibold text-[#FFD1D8]">
                  {error}
                </p>
              )}
              <button type="submit" form="room-form" disabled={busy} className={PRIMARY}>
                {busy ? 'One moment…' : screen === 'create' ? 'Create room' : 'Join room'}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
      </div>
    </ScreenShell>
  );
}
