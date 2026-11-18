'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScreenShell } from '@/components/ui/ScreenHeader';
import { WordArt, DrawingArt } from '@/components/ui/ModeIcon';
import { BTN_RESET } from './controls';
import { DrawingPad } from './DrawingPad';
import {
  DOMAINS,
  FALLBACK_DOMAIN,
  type DomainChoice,
} from '@/data/localConfig';
import { selectWord, domainLabel } from '@shared/game/wordBank';

/**
 * Local pass-and-play handout.
 *
 * Route: /local/play?<every setup value>
 *
 * Screens, in order:
 *   handout  → whose turn it is, "tap to see your card"
 *   reveal   → the card flips over: secret word for the crew, "you are the imposter"
 *              for the imposter (plus the category hint when hints are on)
 *   discuss  → everyone has seen their card; the clue order + start result
 *   result   → who the imposters were and the word
 *
 * Motion: the card flip, the word rise and the result pop are Tailwind keyframes
 * declared in tailwind.config.ts. Each one is paired with `motion-reduce:animate-none`
 * so a phone with reduce-motion on still gets the whole flow, just without movement.
 *
 * Nothing is scored, nothing is stored: roles are derived from the setup values so the
 * flow is walkable without a backend.
 */

type Step = 'handout' | 'reveal' | 'draw' | 'discuss' | 'result';

const ART = {
  violet: 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_6px_0_#4C1D95]',
  orange: 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_6px_0_#7C2D12]',
} as const;

const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#FDE68A]';

const NO_MOTION = 'motion-reduce:animate-none';

function Inner() {
  const router = useRouter();
  const params = useSearchParams();

  const isWord = params.get('mode') !== 'drawing';
  /**
   * The host may have chosen "Any", which means "pick a category at random".
   *
   * Resolved ONCE, in state — resolving it during render would re-roll the word on
   * every re-render and change the answer under the players' feet.
   */
  const domainChoice = (params.get('domain') ?? 'food') as DomainChoice;
  // One word and its matching hint stay fixed until a new game is started.
  const [prompt, setPrompt] = useState(() => selectWord(domainChoice));
  const domainId = prompt.domain;
  const domain = DOMAINS.find((item) => item.id === domainId) ?? FALLBACK_DOMAIN;
  const domainName = domainLabel(domainId);

  const players = Math.max(3, Number(params.get('players') ?? 6));
  const imposters = Math.min(
    Math.max(1, Number(params.get('imposters') ?? 1)),
    Math.max(1, Math.floor(players / 3)),
  );
  const rounds = params.get('rounds') ?? '3';
  const hints = params.get('hints') !== 'false';
  const revealWord = params.get('revealWord') !== 'false';
  const randomFirst = params.get('randomFirst') === 'true';
  const clueLimit = Number(params.get('clueLimit') ?? 1);
  const clueTimer = Number(params.get('clueTimer') ?? 60);
  const discussionTimer = Number(params.get('discussionTimer') ?? 0);
  const drawsPerTurn = Math.min(3, Math.max(1, Number(params.get('drawsPerTurn') ?? 1)));

  /**
   * Bumped by "Play again" so the seats and the imposter are re-drawn every game.
   * A fixed seed per mount would hand out the same roles on a replay, which is exactly
   * the problem this replaced.
   */
  const [deal, setDeal] = useState(0);

  /** Fisher–Yates. `deal` reseeds it, so a replay is a fresh shuffle. */
  const order = useMemo(() => {
    const seats = Array.from({ length: players }, (_, i) => i + 1);
    if (!randomFirst) return seats;
    const shuffled = [...seats];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = shuffled[i]!;
      const b = shuffled[j]!;
      shuffled[i] = b;
      shuffled[j] = a;
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, randomFirst, deal]);

  /**
   * Imposters are drawn at random from the seats — never the last ones.
   *
   * The old version took `order.slice(players - imposters)`, so seat "Player 6" was the
   * imposter in every single game. Now the seats are shuffled and the first N win.
   */
  const imposterSeats = useMemo(() => {
    const pool = [...order];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = pool[i]!;
      const b = pool[j]!;
      pool[i] = b;
      pool[j] = a;
    }
    return new Set(pool.slice(0, imposters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, imposters, deal]);

  /**
   * Roles seen so far, by seat. Drawing used to skip the card entirely, so nobody ever
   * learned the word or that they were the imposter — the board was fully cooperative and
   * the reveal at the end was the first time it mattered. Recording the role lets the draw
   * screen show "Player 3 · Crew or imposter" without re-dealing mid-round.
   */
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const [step, setStep] = useState<Step>('handout');
  const [turn, setTurn] = useState(0);
  /** Bumped on every reveal so the flip animation replays for each player. */
  const [flip, setFlip] = useState(0);
  /** true while the device is being passed during a shared drawing turn */
  const [handedOver, setHandedOver] = useState(false);

  /**
   * Turn index runs across every lap, so it can exceed the length of `order`.
   * Wrapping here is what keeps lap 2 pointing at a real seat instead of `undefined`.
   */
  const seatAt = (index: number) => order[index % players] ?? 1;
  const seat = seatAt(turn);
  const isImposter = imposterSeats.has(seat);
  const secretWord = prompt.word;
  /**
   * Drawing runs for as many laps as the Rounds setting — the default 3 means everyone
   * adds to the same picture three times. Word mode still uses one lap of the table,
   * which is what it always did.
   */
  const drawLaps = isWord ? 1 : Math.max(1, Number(rounds) || 1);
  const lap = Math.floor(turn / players) + 1;
  const lastTurn = turn >= drawLaps * players - 1;
  /** the card phase is always one lap of the table, however many laps drawing runs */
  const lastCard = turn >= players - 1;

  const accent = isWord ? 'violet' : 'orange';
  const accentText = isWord ? 'text-[#C4B5FD]' : 'text-[#FDBA74]';
  const accentChip = isWord
    ? 'bg-[#7C3AED]/30 text-[#EDE9FE] ring-[#A78BFA]/45'
    : 'bg-[#EA580C]/30 text-[#FFEDD5] ring-[#FB923C]/45';

  const advance = useCallback(() => {
    if (lastTurn) {
      setStep('discuss');
      setTurn(0);
    } else {
      setTurn((n) => n + 1);
      setStep('handout');
    }
  }, [lastTurn]);

  function revealCard() {
    setFlip((n) => n + 1);
    setRevealed((seen) => ({ ...seen, [seat]: isImposter }));
    setStep('reveal');
  }

  /**
   * Leaving the card phase.
   *
   * Word mode rolls into the clue round as it always did. Drawing mode hands the device
   * round the table once for the cards, then opens the shared board — a completely
   * different next step, so it gets its own function instead of overloading `advance()`.
   */
  function handOver() {
    if (isWord) {
      advance();
      return;
    }
    if (lastCard) {
      setStep('draw');
      setTurn(0);
      setHandedOver(false);
      return;
    }
    setTurn((n) => n + 1);
    setStep('handout');
  }

  function restart() {
    setPrompt(previous => selectWord(domainChoice, Math.random, previous.word));
    setDeal((n) => n + 1);
    setStep('handout');
    setTurn(0);
    setHandedOver(false);
  }

  /* Escape backs out one step — a mis-tap on "tap to see your card" is otherwise final. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (step === 'reveal') setStep('handout');
      else if (step === 'discuss') setStep('result');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const header = (
    <header className="w-full shrink-0 text-center">
      <p
        className={[
          'm-0 text-[0.68rem] font-extrabold uppercase tracking-[0.2em]',
          accentText,
          NO_MOTION,
          'animate-rise-in',
        ].join(' ')}
      >
        Local · {isWord ? 'Word mode' : 'Drawing mode'}
      </p>
      <h1 className="m-0 mt-1 font-display text-[clamp(1.35rem,5.6vw,1.7rem)] font-extrabold leading-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]">
        {step === 'result' ? 'Result' : `Round 1 of ${rounds}`}
      </h1>
    </header>
  );

  const badge = (
    <div className="flex items-center gap-1.5">
      <span
        className={[
          'grid h-7 w-7 shrink-0 place-items-center rounded-[9px]',
          isWord
            ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_3px_0_#4C1D95]'
            : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_3px_0_#7C2D12]',
        ].join(' ')}
      >
        <span className="block h-5 w-5">{isWord ? <WordArt /> : <DrawingArt />}</span>
      </span>
      <span
        className={[
          'rounded-full px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.09em] ring-1 ring-inset',
          accentChip,
        ].join(' ')}
      >
        {domainName}
      </span>
      {clueTimer > 0 && (
        <span className="rounded-full bg-white/12 px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.09em] text-white/80 ring-1 ring-inset ring-white/14">
          {clueTimer}s
        </span>
      )}
    </div>
  );

  return (
    <ScreenShell backdrop="gamemode" scrollable={!isWord && step === 'draw'}>
      <div className={`relative z-[1] flex w-full flex-col items-center gap-[clamp(8px,1.7dvh,14px)] ${!isWord && step === 'draw' ? 'h-auto max-w-[960px] justify-start' : 'h-full max-w-[430px] justify-center'}`}>
        {header}

        {/* ---------------- HANDOUT ---------------- */}
        {step === 'handout' && (
          <>
            <div
              className={[
                'w-full rounded-[22px] bg-[#120A26]/95 p-4 ring-1 ring-inset ring-white/14',
                'shadow-[0_22px_46px_rgba(0,0,0,0.58)] animate-rise-in',
                NO_MOTION,
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                {badge}
                <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-white/60">
                  {turn + 1}/{players}
                </span>
              </div>

              <div className="mt-4 flex flex-col items-center gap-1.5">
                <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#C0B2DE]">
                  Pass the device to
                </span>
                <span className="font-display text-[clamp(1.9rem,9vw,2.5rem)] font-extrabold leading-none text-white [text-shadow:0_3px_14px_rgba(124,58,237,0.55)]">
                  Player {seat}
                </span>
                <span className="mt-0.5 text-[0.72rem] font-semibold text-white/65">
                  {isWord ? 'Everyone else, look away' : 'Crew see the word — the imposter bluffs'}
                </span>
              </div>

              <button
                type="button"
                onClick={revealCard}
                className={[
                  BTN_RESET,
                  'mt-5 grid w-full place-items-center rounded-[15px] px-3 py-3.5',
                  'text-[0.88rem] font-extrabold uppercase tracking-[0.12em] text-white',
                  'transition-transform duration-fast ease-out',
                  FOCUS,
                  ['animate-glow hover:-translate-y-[1px] active:translate-y-[1px]', NO_MOTION, ART[accent]].join(' '),
                ].join(' ')}
              >
                Tap to see your card
              </button>

              <div className="mt-2.5 flex items-center justify-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/50">
                <span>{isWord ? 'Clue order' : 'Draw order'}</span>
                {order.map((s) => (
                  <span key={s} className={s === seat ? 'text-[#FDE68A]' : ''}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {!isWord && (
              <p className="m-0 max-w-[340px] rounded-[11px] bg-[#0B0618]/85 px-3 py-2 text-center text-[0.68rem] font-semibold leading-[1.5] text-[#C4B5FD]">
                One shared board. Each player adds their {drawsPerTurn > 1 ? `${drawsPerTurn} strokes` : 'stroke'}
                in turn — nothing is cleared between players.
              </p>
            )}
          </>
        )}

        {/* ---------------- REVEAL: the card flips over ---------------- */}
        {step === 'reveal' && (
          <>
            <div key={flip} className="w-full [perspective:1000px]">
              <div
                className={[
                  'w-full rounded-[22px] p-4 ring-1 ring-inset animate-flip-in',
                  'shadow-[0_22px_46px_rgba(0,0,0,0.58)] [transform-style:preserve-3d]',
                  NO_MOTION,
                  isImposter
                    ? 'bg-[#2A0A1E]/95 ring-[#F472B6]/35 shadow-[0_22px_46px_rgba(0,0,0,0.58),0_0_44px_rgba(219,39,119,0.28)]'
                    : 'bg-[#120A26]/95 ring-white/14',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-white/60">
                    Player {seat}
                  </span>
                  {badge}
                </div>

                <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
                  {isImposter ? (
                    <>
                      <span
                        className={[
                          'grid h-16 w-16 place-items-center rounded-[18px] bg-[linear-gradient(170deg,#F472B6_0%,#DB2777_100%)]',
                          'shadow-[0_6px_0_#9D174D,0_0_38px_rgba(219,39,119,0.45)] animate-pop-in',
                          NO_MOTION,
                        ].join(' ')}
                      >
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                          <path d="M12 3.5l7.5 4.2v7.6L12 19.5 4.5 15.3V7.7L12 3.5Z" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
                          <circle cx="9.3" cy="11" r="1.15" fill="#fff" />
                          <circle cx="14.7" cy="11" r="1.15" fill="#fff" />
                        </svg>
                      </span>
                      <span className="mt-1.5 font-display text-[clamp(1.35rem,6.2vw,1.7rem)] font-extrabold leading-tight text-[#FBCFE8]">
                        You are the imposter
                      </span>
                      {hints ? (
                        <>
                          <span className="mt-0.5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-white/55">
                            Your hint
                          </span>
                          <span className="max-w-[280px] text-[0.9rem] font-extrabold leading-snug text-white">
                            {prompt.hint}
                          </span>
                          <span className="mt-0.5 text-[0.66rem] font-semibold text-white/55">
                            You do not know the word. Bluff.
                          </span>
                        </>
                      ) : (
                        <span className="mt-1 max-w-[290px] text-[0.74rem] font-semibold leading-snug text-white/60">
                          No hint for you — improvise your clue.
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#C0B2DE]">
                        The secret word is
                      </span>
                      <span
                        className={[
                          'font-display text-[clamp(2.1rem,11vw,2.9rem)] font-extrabold leading-none text-white',
                          '[text-shadow:0_4px_20px_rgba(124,58,237,0.75)] animate-word-in',
                          NO_MOTION,
                        ].join(' ')}
                      >
                        {secretWord}
                      </span>
                      <span className="mt-2 rounded-full bg-white/12 px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.09em] text-white/78 ring-1 ring-inset ring-white/14">
                        {domainName} · {clueLimit === 0 ? 'free-form' : clueLimit === 1 ? 'one-word' : 'two-word'} clue
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handOver}
              className={[
                BTN_RESET,
                'grid w-full place-items-center rounded-[15px] px-3 py-3.5',
                'text-[0.88rem] font-extrabold uppercase tracking-[0.12em] text-white',
                'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
                FOCUS,
                ART[accent],
              ].join(' ')}
            >
              {isWord
                ? lastTurn
                  ? 'Pass · everyone is done'
                  : `Pass to Player ${seatAt(turn + 1)}`
                : lastCard
                  ? 'Everyone has their card · start drawing'
                  : `Pass to Player ${seatAt(turn + 1)}`}
            </button>
            <p className="m-0 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/50">
              Hide the screen before passing
            </p>
          </>
        )}

        {/* ---------------- DRAW: one shared panel, turn by turn ---------------- */}
        {!isWord && step === 'draw' && (
          <>
            <div className="w-full rounded-[22px] bg-[#120A26]/95 p-1 sm:p-3 ring-1 ring-inset ring-white/14 shadow-[0_22px_46px_rgba(0,0,0,0.58)] animate-rise-in motion-reduce:animate-none">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="shrink-0 whitespace-nowrap text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-white">
                  Player {seat} · Round {lap} of {drawLaps}
                </span>
                {badge}
              </div>

              <p className="m-0 mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.66rem] font-extrabold uppercase tracking-[0.1em]">
                <span className="text-[#C4B5FD]">
                  {drawsPerTurn} stroke{drawsPerTurn > 1 ? 's' : ''} each
                </span>
                {revealed[seat] ? (
                  <span className="rounded-full bg-[#F472B6]/20 px-2 py-0.5 text-[#FBCFE8] ring-1 ring-inset ring-[#F472B6]/40">
                    Imposter
                  </span>
                ) : (
                  <span className="rounded-full bg-[#22C55E]/15 px-2 py-0.5 text-[#4ADE80] ring-1 ring-inset ring-[#22C55E]/40">
                    Crew
                  </span>
                )}
                <span className="text-white/45">keep the drawing going</span>
              </p>

              {/*
                The canvas is deliberately NOT unmounted between turns: everyone is adding
                to the same picture, so hiding it (rather than clearing it) is what keeps
                the work visible.
              */}
              <div className={handedOver ? 'hidden' : undefined}>
                <DrawingPad
                  accent={accent}
                  keepContent
                  turnLabel={`Player ${seat}`}
                />
              </div>

              {handedOver && (
                <div className="grid h-[clamp(150px,26dvh,230px)] place-items-center rounded-[13px] bg-[#171029] ring-1 ring-inset ring-white/12">
                  <p className="m-0 max-w-[240px] px-3 text-center text-[0.72rem] font-semibold leading-snug text-white/60">
                    Hand the device to{' '}
                    <span className="font-extrabold text-[#C4B5FD]">{seat}</span> —
                    the picture is hidden until they take over.
                  </p>
                </div>
              )}
            </div>

            {handedOver ? (
              <button
                type="button"
                onClick={() => setHandedOver(false)}
                className={[
                  BTN_RESET,
                  'grid w-full place-items-center rounded-[15px] px-3 py-3.5',
                  'text-[0.88rem] font-extrabold uppercase tracking-[0.12em] text-white',
                  'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
                  FOCUS,
                  ART[accent],
                ].join(' ')}
              >
                {seat} — tap to continue drawing
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (lastTurn) {
                    setStep('discuss');
                    setTurn(0);
                    setHandedOver(false);
                  } else {
                    setTurn((n) => n + 1);
                    setHandedOver(true);
                  }
                }}
                className={[
                  BTN_RESET,
                  'grid w-full place-items-center rounded-[15px] px-3 py-3.5',
                  'text-[0.88rem] font-extrabold uppercase tracking-[0.12em] text-white',
                  'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
                  FOCUS,
                  ART[accent],
                ].join(' ')}
              >
                {lastTurn
                  ? 'Finish · drawing is done'
                  : `Done · pass to ${seatAt(turn + 1)}`}
              </button>
            )}

            <p className="m-0 text-center text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/50">
              One shared picture — everyone adds to it
            </p>
          </>
        )}

        {/* ---------------- DISCUSS ---------------- */}
        {step === 'discuss' && (
          <>
            <div
              className={[
                'w-full rounded-[22px] bg-[#120A26]/95 p-4 ring-1 ring-inset ring-white/14',
                'shadow-[0_22px_46px_rgba(0,0,0,0.58)] animate-rise-in',
                NO_MOTION,
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                {badge}
                <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-white/60">
                  {players} players
                </span>
              </div>

              <p className="mt-3.5 mb-1.5 text-center text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#C0B2DE]">
                Clue order
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {order.map((s) => (
                  <span
                    key={s}
                    className="rounded-[10px] bg-white/[0.07] px-1 py-1.5 text-center text-[0.74rem] font-extrabold text-white ring-1 ring-inset ring-white/12"
                  >
                    P{s}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-1.5 text-center">
                <div className="rounded-[11px] bg-white/[0.06] px-2 py-2 ring-1 ring-inset ring-white/10">
                  <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-white/55">
                    Clue clock
                  </span>
                  <span className="block text-[0.86rem] font-extrabold text-white">
                    {clueTimer > 0 ? `${clueTimer}s` : 'Off'}
                  </span>
                </div>
                <div className="rounded-[11px] bg-white/[0.06] px-2 py-2 ring-1 ring-inset ring-white/10">
                  <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-white/55">
                    Discussion
                  </span>
                  <span className="block text-[0.86rem] font-extrabold text-white">
                    {discussionTimer > 0 ? `${discussionTimer}s` : 'Off'}
                  </span>
                </div>
              </div>

              <p className="mt-2.5 mb-0 text-center text-[0.7rem] font-semibold leading-[1.5] text-white/68">
                Every player has seen their {isWord ? 'card' : 'board'}. Give {clueLimit === 0 ? 'your' : `${clueLimit}-word`} {isWord ? 'clues' : 'guesses'} in turn, then vote.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('result')}
              className={[
                BTN_RESET,
                'grid w-full place-items-center rounded-[15px] px-3 py-3.5',
                'text-[0.88rem] font-extrabold uppercase tracking-[0.12em] text-white',
                'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
                FOCUS,
                ART[accent],
              ].join(' ')}
            >
              Reveal result
            </button>
          </>
        )}

        {/* ---------------- RESULT ---------------- */}
        {step === 'result' && (
          <>
            <div
              className={[
                'w-full rounded-[22px] bg-[#120A26]/95 p-4 ring-1 ring-inset ring-[#F472B6]/30',
                'shadow-[0_22px_46px_rgba(0,0,0,0.58)] animate-rise-in',
                NO_MOTION,
              ].join(' ')}
            >
              <p className="m-0 text-center text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#F9A8D4]">
                {imposters === 1 ? 'The imposter was' : 'The imposters were'}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                {order
                  .filter((s) => imposterSeats.has(s))
                  .map((s) => (
                    <span
                      key={s}
                      className={[
                        'inline-flex items-center rounded-full bg-[linear-gradient(170deg,#F472B6_0%,#DB2777_100%)] px-4 py-1.5',
                        'text-[0.95rem] font-extrabold text-white shadow-[0_4px_0_#9D174D] animate-pop-in',
                        NO_MOTION,
                      ].join(' ')}
                    >
                      Player {s}
                    </span>
                  ))}
              </div>

              <div className="mt-3.5 h-px bg-white/10" />

              <div className="mt-3 flex flex-col items-center gap-1 text-center">
                {revealWord ? (
                  <>
                    <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-[#C0B2DE]">
                      The word was
                    </span>
                    <span className="font-display text-[clamp(1.9rem,9vw,2.4rem)] font-extrabold leading-none text-white [text-shadow:0_4px_18px_rgba(124,58,237,0.6)]">
                      {secretWord}
                    </span>
                  </>
                ) : (
                  <span className="max-w-[300px] text-[0.74rem] font-semibold leading-snug text-white/60">
                    The word stays hidden — reveal was turned off in setup.
                  </span>
                )}
                <span className="mt-1 text-[0.68rem] font-semibold text-white/60">
                  {domainName} · {players} players · round 1 of {rounds}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={restart}
                className={[
                  BTN_RESET,
                  'grid w-full place-items-center rounded-[15px] px-3 py-3',
                  'text-[0.86rem] font-extrabold uppercase tracking-[0.12em] text-white',
                  'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
                  FOCUS,
                  ART[accent],
                ].join(' ')}
              >
                Play again
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/local/setup?mode=${isWord ? 'word' : 'drawing'}`)}
                  className={[
                    BTN_RESET,
                    'grid place-items-center rounded-[13px] bg-white/12 px-2 py-2.5',
                    'text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-white ring-1 ring-inset ring-white/18',
                    'transition-transform duration-fast ease-out active:translate-y-[1px]',
                    FOCUS,
                  ].join(' ')}
                >
                  Edit setup
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/game-mode?path=local')}
                  className={[
                    BTN_RESET,
                    'grid place-items-center rounded-[13px] bg-white/[0.07] px-2 py-2.5',
                    'text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-white/85 ring-1 ring-inset ring-white/12',
                    'transition-transform duration-fast ease-out active:translate-y-[1px]',
                    FOCUS,
                  ].join(' ')}
                >
                  Pick mode
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ScreenShell>
  );
}

export function LocalPlayScreen() {
  return <Inner />;
}
