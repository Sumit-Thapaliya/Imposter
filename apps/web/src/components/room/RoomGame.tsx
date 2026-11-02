'use client';

/**
 * Online game screen — driven entirely by the server.
 *
 * The server owns the phase, the roles, the word, the clue order and the tally; this
 * component renders `state` and emits events. Nothing here can cheat, because nothing
 * here decides anything.
 *
 * reveal → clues → discussion → voting → result
 */
import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BTN_RESET } from '@/components/local/controls';
import { CHANNEL_MODES } from '@/lib/rooms/settings';
import { send } from '@/lib/rooms/socket';
import type { RoomState } from '@shared/contract';
import { OnlineBoard } from './OnlineBoard';
import { VoiceDock } from './VoiceDock';

const ART = 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_4px_0_#4C1D95]';
const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]';

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export type RoomGameProps = {
  state: RoomState;
  onExit: () => void;
};

export function RoomGame({ state, onExit }: RoomGameProps): JSX.Element {
  const settings = state.settings;
  const channels = settings.channels;
  const chatOn = channels !== 'voice';
  const voiceOn = channels !== 'chat';
  const isHost = state.hostId === state.you.id;

  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [state.chat.length, state.phase]);

  // One tick a second is plenty for a countdown and costs nothing.
  useEffect(() => {
    if (!state.deadline) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [state.deadline]);

  const secondsLeft = state.deadline ? Math.max(0, Math.ceil((state.deadline - now) / 1000)) : null;

  const byId = new Map(state.players.map((p) => [p.id, p]));
  const upId = state.clueOrder[state.clueIndex] ?? null;
  const upName = upId ? byId.get(upId)?.name ?? 'Player' : null;
  const isMyTurn = upId === state.you.id;
  const seated = state.players.filter((p) => !p.spectator);

  /** One place decides whether this player may write right now. */
  const canType =
    chatOn && state.phase !== 'lobby' && state.phase !== 'voting' && state.phase !== 'result'
      ? state.phase === 'clues'
        ? isMyTurn
        : true
      : false;

  async function chat() {
    const text = draft.trim();
    if (!text || !canType) return;
    setDraft('');
    const ack = state.phase === 'clues' && isMyTurn
      ? await send('game:clue', { text })
      : await send('game:chat', { text });
    if (!ack.ok) {
      setError(ack.error ?? 'That did not send.');
      setDraft(text);
    }
  }

  async function vote(targetId: string | null) {
    setError('');
    const ack = await send('game:vote', { targetId });
    if (!ack.ok) setError(ack.error ?? 'That vote did not count.');
  }

  async function act(
    event: 'game:voting' | 'game:ready' | 'game:again' | 'game:toLobby' | 'game:nextRound',
  ) {
    const ack = await send(event);
    if (!ack.ok) setError(ack.error ?? 'That did not work.');
  }

  const channelLabel = CHANNEL_MODES.find((c) => c.id === channels)?.label ?? 'Chat';
  const isDrawing = state.mode === 'drawing';

  return (
    <div className="flex w-full flex-col gap-2">
      {/* ---------- status bar ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] bg-[#160d33]/85 px-3 py-2 ring-1 ring-inset ring-[#8a69c4]/35">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#5933a2] px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white">
            Round {state.round} of {state.totalRounds}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white/80">
            {isDrawing ? 'Drawing' : 'Word'}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white/80">
            {channelLabel}
          </span>
        </div>
        {secondsLeft !== null ? (
          <span
            className={[
              'rounded-full px-3 py-1 text-[0.78rem] font-extrabold tabular-nums',
              secondsLeft === 0 ? 'bg-[#F472B6]/25 text-[#FBCFE8]' : 'bg-white/12 text-white',
            ].join(' ')}
            aria-live="polite"
          >
            {secondsLeft === 0 ? "Time's up" : fmt(secondsLeft)}
          </span>
        ) : (
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white/50">
            {state.phase === 'reveal'
              ? 'Reading cards'
              : state.phase === 'clues'
                ? 'Clues'
                : state.phase === 'voting'
                  ? 'Voting'
                  : 'Result'}
          </span>
        )}
      </div>

      {/* ---------- your card ---------- */}
      {state.phase === 'reveal' && (
        <div className="rounded-[16px] bg-[#160d33]/85 p-3.5 ring-1 ring-inset ring-[#8a69c4]/35">
          <p className="m-0 text-center text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#C4B5FD]">
            Your card
          </p>
          {state.you.role === 'imposter' ? (
            <>
              <p className="m-0 mt-1 text-center font-display text-[1.35rem] font-extrabold text-[#F9A8D4]">
                You are the imposter
              </p>
              <p className="m-0 mt-1 text-center text-[0.82rem] font-semibold text-white/70">
                {state.you.hint ?? 'Blend in and guess the word.'}
              </p>
              {state.you.teammates.length > 0 && (
                <p className="m-0 mt-1 text-center text-[0.76rem] font-bold text-white/55">
                  With you: {state.you.teammates.join(', ')}
                </p>
              )}
            </>
          ) : state.you.role === 'crew' ? (
            <>
              <p className="m-0 mt-1 text-center font-display text-[1.7rem] font-extrabold text-white">
                {state.you.word}
              </p>
              <p className="m-0 mt-1 text-center text-[0.76rem] font-semibold text-white/55">
                Keep it secret — describe it without saying it.
              </p>
            </>
          ) : (
            <p className="m-0 mt-1 text-center text-[0.82rem] font-semibold text-white/60">
              {isDrawing ? 'One shared board — everyone adds to it in turn.' : 'Waiting for cards…'}
            </p>
          )}
          <p className="m-0 mt-2 text-center text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white/40">
            {seated.filter((p) => p.ready).length}/{seated.length} ready
          </p>
        </div>
      )}

      {/* ---------- who is up ---------- */}
      {state.phase === 'clues' && (
        <p className="m-0 text-center text-[0.86rem] font-extrabold text-white">
          <span className="text-[#C4B5FD]">{isDrawing ? 'Drawing:' : 'Now writing:'}</span>{' '}
          {isMyTurn ? 'You' : upName}
          <span className="ml-2 text-[0.7rem] font-bold text-white/45">
            {Math.min(state.clueIndex + 1, state.clueOrder.length)}/{state.clueOrder.length}
          </span>
        </p>
      )}

      {/* ---------- the board (drawing rooms) ---------- */}
      {isDrawing && (state.phase === 'clues' || state.phase === 'discussion') && (
        <OnlineBoard state={state} canDraw={state.phase === 'clues' && isMyTurn} />
      )}

      {/* ---------- chat surface ---------- */}
      <div className="rounded-[16px] bg-[#0F0822] ring-1 ring-inset ring-white/12">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.13em] text-[#C4B5FD]">
            Room chat
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
            <span className="text-[0.66rem] font-bold text-white/55">
              {state.players.filter((p) => p.connected).length} in room
            </span>
          </span>
        </div>

        <div
          ref={feedRef}
          className={[
            'overflow-y-auto px-2.5 py-2 transition-[height] duration-med',
            state.phase === 'result' ? 'h-[11dvh]' : 'h-[clamp(130px,21dvh,200px)]',
          ].join(' ')}
        >
          {state.chat.length === 0 && (
            <p className="m-0 px-1 py-6 text-center text-[0.74rem] font-semibold leading-snug text-white/35">
              {state.phase === 'reveal'
                ? 'Check your card, then say you are ready.'
                : 'No messages yet.'}
            </p>
          )}
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {state.chat.map((message) => (
              <li key={message.id}>
                {message.kind === 'system' ? (
                  <p className="m-0 rounded-[9px] bg-white/[0.06] px-2.5 py-1.5 text-center text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#C4B5FD]">
                    {message.text}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#5933a2] text-[0.6rem] font-extrabold text-white">
                      {(message.name ?? '?').slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[0.64rem] font-extrabold uppercase tracking-[0.07em] text-[#B0A1CD]">
                        {message.name}
                        {message.kind === 'clue' && (
                          <span className="ml-1 normal-case tracking-normal text-[#8B5CF6]">clue</span>
                        )}
                      </span>
                      <span className="block break-words text-[0.86rem] font-semibold leading-snug text-white">
                        {message.text}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* input row — the server decides whether a line becomes a clue or a chat */}
        <div className="flex items-center gap-1.5 border-t border-white/10 px-2.5 py-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // the disabled attribute does not stop Enter, so guard here too
              if (event.key === 'Enter' && canType) void chat();
            }}
            disabled={!canType}
            placeholder={
              !chatOn
                ? 'Chat is off in this room'
                : state.phase === 'clues'
                  ? isMyTurn
                    ? 'Write your clue'
                    : `Waiting for ${upName}…`
                  : state.phase === 'discussion'
                    ? 'Accuse, defend, discuss…'
                    : state.phase === 'result'
                      ? 'The round is over'
                      : 'Chat opens with the discussion'
            }
            aria-label="Message"
            className="min-w-0 flex-1 rounded-[11px] border-0 bg-[#1b1236] px-3 py-2.5 text-[0.86rem] font-semibold text-white placeholder:text-white/35 disabled:opacity-45"
          />
          <button
            type="button"
            onClick={() => void chat()}
            disabled={!canType || !draft.trim()}
            className={[
              BTN_RESET,
              'grid h-10 w-12 shrink-0 place-items-center rounded-[11px] text-white',
              'transition-transform duration-fast ease-out active:translate-y-[1px] disabled:opacity-35',
              FOCUS,
              ART,
            ].join(' ')}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M4 12l16-8-6 16-2.6-6.2L4 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ---------- voice ---------- */}
      {voiceOn && <VoiceDock state={state} />}

      {error && (
        <p role="alert" className="m-0 rounded-[10px] bg-[#7A244A]/60 px-3 py-2 text-[0.8rem] font-semibold text-[#FFD1D8]">
          {error}
        </p>
      )}

      {/* ---------- phase actions ---------- */}
      {state.phase === 'reveal' && (
        <button
          type="button"
          onClick={() => void act('game:ready')}
          disabled={state.you.role !== null && seated.find((p) => p.id === state.you.id)?.ready}
          className={[
            BTN_RESET,
            'grid w-full place-items-center rounded-[14px] px-3 py-3',
            'text-[0.9rem] font-extrabold uppercase tracking-[0.1em] text-white',
            'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-45',
            FOCUS,
            ART,
          ].join(' ')}
        >
          {seated.find((p) => p.id === state.you.id)?.ready ? 'Ready — waiting for the others' : "I've seen my card"}
        </button>
      )}

      {state.phase === 'clues' && isDrawing && isMyTurn && (
        <button
          type="button"
          onClick={() => void send('draw:pass', { keep: true })}
          className={[
            BTN_RESET,
            'grid w-full place-items-center rounded-[14px] px-3 py-3',
            'text-[0.9rem] font-extrabold uppercase tracking-[0.1em] text-white',
            'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
            FOCUS,
            'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_4px_0_#7C2D12]',
          ].join(' ')}
        >
          {state.clueIndex + 1 >= state.clueOrder.length
            ? 'Done — everyone has drawn'
            : `Done — pass to ${byId.get(state.clueOrder[state.clueIndex + 1] ?? '')?.name ?? 'the next player'}`}
        </button>
      )}

      {state.phase === 'clues' && isHost && (
        <button
          type="button"
          onClick={() => void act('game:voting')}
          className={[
            BTN_RESET,
            'grid w-full place-items-center rounded-[14px] px-3 py-3',
            'text-[0.9rem] font-extrabold uppercase tracking-[0.1em] text-white',
            'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
            FOCUS,
            ART,
          ].join(' ')}
        >
          Skip to discussion
        </button>
      )}

      {state.phase === 'discussion' && isHost && (
        <button
          type="button"
          onClick={() => void act('game:voting')}
          className={[
            BTN_RESET,
            'grid w-full place-items-center rounded-[14px] px-3 py-3',
            'text-[0.9rem] font-extrabold uppercase tracking-[0.1em] text-white',
            'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
            FOCUS,
            ART,
          ].join(' ')}
        >
          Go to vote
        </button>
      )}

      {state.phase === 'voting' && (
        <div className="rounded-[16px] bg-[#160d33]/85 p-3 ring-1 ring-inset ring-[#8a69c4]/35">
          <p className="m-0 mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#C4B5FD]">
            {state.you.hasVoted ? 'Vote locked in' : 'Who is the imposter?'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {seated
              .filter((p) => p.id !== state.you.id)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => void vote(p.id)}
                  disabled={state.you.hasVoted}
                  className={[
                    BTN_RESET,
                    'rounded-[10px] bg-white/10 px-3 py-2 text-[0.78rem] font-extrabold text-white',
                    'ring-1 ring-inset ring-white/14 transition-transform duration-fast ease-out',
                    'hover:bg-white/[0.18] active:translate-y-[1px] disabled:opacity-40',
                    FOCUS,
                  ].join(' ')}
                >
                  {p.name}
                </button>
              ))}
            <button
              type="button"
              onClick={() => void vote(null)}
              disabled={state.you.hasVoted}
              className={[
                BTN_RESET,
                'rounded-[10px] bg-white/[0.06] px-3 py-2 text-[0.74rem] font-extrabold uppercase tracking-[0.06em] text-white/70',
                'ring-1 ring-inset ring-white/12 transition-transform duration-fast ease-out',
                'active:translate-y-[1px] disabled:opacity-40',
                FOCUS,
              ].join(' ')}
            >
              Abstain
            </button>
          </div>
          <p className="m-0 mt-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white/40">
            {state.players.filter((p) => !p.spectator).length} voting · results when everyone is in
          </p>
        </div>
      )}

      {state.phase === 'result' && state.result && (
        <div className="max-h-[46dvh] overflow-y-auto rounded-[16px] bg-[#160d33]/95 p-3.5 ring-1 ring-inset ring-[#F472B6]/30">
          <p className="m-0 text-center text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[#F9A8D4]">
            The crew voted out
          </p>
          <p className="m-0 mt-1 text-center font-display text-[1.5rem] font-extrabold text-white">
            {state.result.ejectedName ?? 'Nobody'}
          </p>
          {state.result.ejectedName && (
            <p className="m-0 mt-1 text-center text-[0.82rem] font-bold text-white/70">
              {state.result.caught ? 'Caught! They were the imposter.' : 'Wrong call — they were crew.'}
            </p>
          )}
          <p className="m-0 mt-1 text-center text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#C4B5FD]">
            {state.result.winner === 'crew' ? 'Crew wins' : 'Imposters win'}
          </p>

          <div className="mt-3 h-px bg-white/10" />

          <p className="m-0 mt-2.5 text-center text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-[#C4B5FD]">
            {state.result.imposters.length === 1 ? 'The imposter was' : 'The imposters were'}
          </p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
            {state.result.imposters.map((p) => (
              <span
                key={p.id}
                className="rounded-full bg-[linear-gradient(170deg,#F472B6_0%,#DB2777_100%)] px-3.5 py-1 text-[0.84rem] font-extrabold text-white shadow-[0_3px_0_#9D174D]"
              >
                {p.name}
              </span>
            ))}
          </div>
          <p className="m-0 mt-2.5 text-center text-[0.78rem] font-semibold text-white/60">
            The word was <span className="font-extrabold text-white">{state.result.word}</span>
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void act(state.round >= state.totalRounds ? 'game:again' : 'game:nextRound')}
              disabled={!isHost}
              className={[
                BTN_RESET,
                'grid w-full place-items-center rounded-[12px] px-3 py-2.5',
                'text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-white',
                'transition-transform duration-fast ease-out active:translate-y-[1px] disabled:opacity-45',
                FOCUS,
                ART,
              ].join(' ')}
            >
              {state.round >= state.totalRounds ? 'Play again' : `Next round (${state.round + 1}/${state.totalRounds})`}
            </button>
            <button
              type="button"
              onClick={() => void act('game:toLobby')}
              disabled={!isHost}
              className={[
                BTN_RESET,
                'grid w-full place-items-center rounded-[12px] bg-white/10 px-3 py-2.5',
                'text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-white',
                'ring-1 ring-inset ring-white/14 transition-transform duration-fast ease-out active:translate-y-[1px] disabled:opacity-45',
                FOCUS,
              ].join(' ')}
            >
              Back to lobby
            </button>
            {!isHost && (
              <p className="m-0 text-center text-[0.66rem] font-bold uppercase tracking-[0.08em] text-white/40">
                Waiting for the host
              </p>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onExit}
        className={[
          BTN_RESET,
          'mx-auto mt-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-white/45 underline-offset-4 hover:text-white/70 hover:underline',
          FOCUS,
        ].join(' ')}
      >
        Leave the game
      </button>
    </div>
  );
}
