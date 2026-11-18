'use client';

import { useMemo, useState, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ScreenShell } from '@/components/ui/ScreenHeader';
import { BackButton } from '@/components/ui/BackButton';
import { WordArt, DrawingArt } from '@/components/ui/ModeIcon';
import {
  Panel,
  Stepper,
  SegmentedControl,
  ChipGroup,
  MiniToggle,
  BTN_RESET,
} from './controls';
import { DomainGlyph } from './DomainGlyph';
import {
  DOMAIN_CHOICES,
  DOMAINS,
  FALLBACK_DOMAIN,
  DEFAULT_CONFIG,
  PLAYER_RANGE,
  ROUND_RANGE,
  DRAW_RANGE,
  CLUE_TIMERS,
  DISCUSSION_TIMERS,
  CLUE_LIMITS,
  VOTING,
  TIE_RULES,
  DIFFICULTIES,
  PRESET_PATCH,
  maxImpostersFor,
  normalise,
  type LocalConfig,
  type LocalModeId,
  type TimerId,
  type ClueLimit,
  type VotingId,
  type TieId,
  type DifficultyId,
} from '@shared/game';

const TILE_TONE = {
  violet: 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_4px_0_#4C1D95]',
  orange: 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_4px_0_#7C2D12]',
  blue: 'bg-[linear-gradient(170deg,#65B8F8_0%,#1E6FD0_100%)] shadow-[0_4px_0_#14508F]',
  green: 'bg-[linear-gradient(170deg,#4ADE80_0%,#12A150_100%)] shadow-[0_4px_0_#0E7A3C]',
  pink: 'bg-[linear-gradient(170deg,#F472B6_0%,#DB2777_100%)] shadow-[0_4px_0_#9D174D]',
  amber: 'bg-[linear-gradient(170deg,#FBBF24_0%,#D97706_100%)] shadow-[0_4px_0_#92400E]',
} as const;

type TabId = 'table' | 'round' | 'rules';

const TAB_LABELS: { id: TabId; label: string }[] = [
  { id: 'table', label: 'Table' },
  { id: 'round', label: 'Round' },
  { id: 'rules', label: 'Rules' },
];

/**
 * Local game configuration.
 *
 * Route: /local/setup?mode=word|drawing
 *
 * Three tabs so the ruleset stays one screen tall on a phone:
 *   Table — players, imposters, domain, difficulty presets
 *   Round — rounds, clocks, clue length, reveal
 *   Rules — voting, tie-break, switches
 *
 * Every control is real state and `normalise()` keeps it valid. Nothing is
 * generated or persisted; Start Game hands the config to /local/play via the URL.
 */
export function LocalSetupScreen({ mode }: { mode: LocalModeId }): JSX.Element {
  const router = useRouter();
  const [config, setConfig] = useState<LocalConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = useState<TabId>('table');

  const isWord = mode === 'word';
  const accent: 'violet' | 'orange' = isWord ? 'violet' : 'orange';
  const imposterCeiling = maxImpostersFor(config.players);

  function update(patch: Partial<LocalConfig>) {
    setConfig((current) => normalise({ ...current, ...patch }));
  }

  function applyPreset(difficulty: DifficultyId) {
    setConfig((current) => normalise({ ...current, ...PRESET_PATCH[difficulty], difficulty }));
  }

  const domain = useMemo(
    () =>
      config.domain === 'any'
        ? { label: 'Any category' }
        : DOMAINS.find((item) => item.id === config.domain) ?? FALLBACK_DOMAIN,
    [config.domain],
  );

  /** Everything that differs from the defaults, for the summary line. */
  const changedCount = useMemo(
    () => Object.keys(DEFAULT_CONFIG).filter((key) => {
      const k = key as keyof LocalConfig;
      return DEFAULT_CONFIG[k] !== config[k];
    }).length,
    [config],
  );

  function startGame() {
    const query = new URLSearchParams({
      mode,
      players: String(config.players),
      imposters: String(config.imposters),
      rounds: String(config.rounds),
      domain: config.domain,
      clueTimer: String(config.clueTimer),
      discussionTimer: String(config.discussionTimer),
      clueLimit: String(config.clueLimit),
      voting: config.voting,
      tieRule: config.tieRule,
      hints: String(config.hints),
      imposterKnowsWord: String(config.imposterKnowsWord),
      revealWord: String(config.revealWord),
      passAndPlay: String(config.passAndPlay),
      scoreboard: String(config.scoreboard),
      randomFirst: String(config.randomFirst),
      drawsPerTurn: String(config.drawsPerTurn),
      difficulty: config.difficulty,
    }).toString();
    router.push(`/local/play?${query}`);
  }

  return (
    <ScreenShell backdrop="gamemode">
      <div className="relative z-[1] flex h-full w-full max-w-[560px] flex-col items-center justify-center gap-[clamp(8px,1.6dvh,14px)]">
        {/* header row — back, title, mode badge */}
        <div className="flex w-full items-center gap-2">
          <BackButton onClick={() => router.push('/game-mode?path=local')} />
          <span className="h-11 w-11 shrink-0" aria-hidden="true" />

          <div className="min-w-0 flex-1 text-center">
            <h1 className="m-0 truncate font-display text-[clamp(1.25rem,5.4vw,1.7rem)] font-extrabold leading-tight text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]">
              {isWord ? 'Word Mode' : 'Drawing Mode'}
            </h1>
            <p className="m-0 truncate text-[0.8rem] font-semibold text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
              Local · {domain.label} · {config.players}p / {config.imposters}i
            </p>
          </div>

          <span
            className={[
              'grid h-11 w-11 shrink-0 place-items-center rounded-[13px]',
              isWord
                ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_3px_0_#4C1D95]'
                : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_3px_0_#7C2D12]',
            ].join(' ')}
          >
            <span className="block h-6 w-6">{isWord ? <WordArt /> : <DrawingArt />}</span>
          </span>
        </div>

        {/* tabs */}
        <div
          role="tablist"
          aria-label="Configuration sections"
          className="flex w-full items-center gap-1 rounded-[12px] bg-[#0B0618]/80 p-1 ring-1 ring-inset ring-white/12"
        >
          {TAB_LABELS.map((item) => {
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={[
                  BTN_RESET,
                  'flex-1 rounded-[10px] py-2.5 text-[0.84rem] font-extrabold uppercase tracking-[0.08em]',
                  'transition-transform duration-fast ease-out active:translate-y-[1px]',
                  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]',
                  active
                    ? isWord
                      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] text-white shadow-[0_2px_0_#4C1D95]'
                      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] text-white shadow-[0_2px_0_#7C2D12]'
                    : 'text-[#A99BC9] hover:text-white',
                ].join(' ')}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* ---------------- TABLE ---------------- */}
        {tab === 'table' && (
          <div className="w-full">
            <Panel title="Difficulty" hint="applies a preset">
              <div className="flex items-center gap-1 rounded-[12px] bg-[#0B0618]/60 p-1 ring-1 ring-inset ring-white/10">
                {DIFFICULTIES.map((item) => {
                  const active = item.id === config.difficulty;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => applyPreset(item.id)}
                      className={[
                        BTN_RESET,
                        'flex-1 rounded-[10px] px-1 py-2.5',
                        'transition-transform duration-fast ease-out active:translate-y-[1px]',
                        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]',
                        active
                          ? isWord
                            ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] text-white shadow-[0_2px_0_#4C1D95]'
                            : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] text-white shadow-[0_2px_0_#7C2D12]'
                          : 'text-[#A99BC9] hover:text-white',
                      ].join(' ')}
                    >
                      <span className="block text-[0.82rem] font-extrabold uppercase tracking-[0.05em]">
                        {item.label}
                      </span>
                      <span className="block text-[0.64rem] font-semibold leading-tight opacity-80">
                        {item.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Table" hint={`max ${imposterCeiling} imposters`}>
              <Stepper
                label="Players"
                value={config.players}
                min={PLAYER_RANGE.min}
                max={PLAYER_RANGE.max}
                onChange={(players) => update({ players })}
                accent={accent}
              />
              <div className="my-1.5 h-px bg-white/10" />
              <Stepper
                label="Imposters"
                value={config.imposters}
                min={1}
                max={imposterCeiling}
                onChange={(imposters) => update({ imposters })}
                accent={accent}
              />
            </Panel>

            <Panel title="Word domain" hint="pick one, or let the game choose">
              <div className="grid grid-cols-3 gap-1.5">
                {DOMAIN_CHOICES.map((item) => {
                  const active = item.id === config.domain;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update({ domain: item.id })}
                      className={[
                        BTN_RESET,
                        'flex items-center justify-center gap-1.5 rounded-[12px] px-1 py-2.5',
                        'transition-transform duration-fast ease-out hover:-translate-y-[1px] active:translate-y-[1px]',
                        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]',
                        active
                          ? ['text-white', TILE_TONE[(item.id === 'any' ? 'violet' : DOMAINS.find((d) => d.id === item.id)?.accent) ?? 'violet']].join(' ')
                          : 'bg-white/[0.07] text-[#C9BEE4] ring-1 ring-inset ring-white/12 hover:bg-white/12',
                      ].join(' ')}
                    >
                      <DomainGlyph id={item.id} className="h-[19px] w-[19px]" />
                      <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.03em]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>
        )}

        {/* ---------------- ROUND ---------------- */}
        {tab === 'round' && (
          <div className="w-full">
            <Panel title="Rounds" hint="a round = every player clues once">
              <Stepper
                label="Rounds"
                value={config.rounds}
                min={ROUND_RANGE.min}
                max={ROUND_RANGE.max}
                onChange={(rounds) => update({ rounds })}
                accent={accent}
              />
            </Panel>

            {!isWord && (
              <Panel title="Drawing" hint="per player, per turn">
                <Stepper
                  label="Drawings each"
                  value={config.drawsPerTurn}
                  min={DRAW_RANGE.min}
                  max={DRAW_RANGE.max}
                  onChange={(drawsPerTurn) => update({ drawsPerTurn })}
                  accent={accent}
                />
              </Panel>
            )}

            <Panel title="Clocks" hint="per phase">
              <div className="mb-1 text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[#B09FCE]">
                Clue time
              </div>
              <SegmentedControl
                label="Clue timer"
                options={CLUE_TIMERS.map((t) => ({ id: t.id, label: t.label }))}
                value={config.clueTimer}
                onChange={(clueTimer: TimerId) => update({ clueTimer })}
                accent={accent}
              />
              <div className="my-1.5 h-px bg-white/10" />
              <div className="mb-1 text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[#B09FCE]">
                Discussion time
              </div>
              <SegmentedControl
                label="Discussion timer"
                options={DISCUSSION_TIMERS.map((t) => ({ id: t.id, label: t.label }))}
                value={config.discussionTimer}
                onChange={(discussionTimer: TimerId) => update({ discussionTimer })}
                accent={accent}
              />
            </Panel>

            <Panel title="Clue length" hint="words allowed per clue">
              <SegmentedControl
                label="Clue length"
                options={CLUE_LIMITS.map((c) => ({ id: c.id, label: c.label }))}
                value={config.clueLimit}
                onChange={(clueLimit: ClueLimit) => update({ clueLimit })}
                accent={accent}
              />
              <div className="mt-1">
                <MiniToggle
                  label="Reveal word at the end"
                  checked={config.revealWord}
                  onChange={(revealWord) => update({ revealWord })}
                  accent={accent}
                />
                <MiniToggle
                  label="Clue tracker"
                  checked={config.clueTracker}
                  onChange={(clueTracker) => update({ clueTracker })}
                  accent={accent}
                />
                <MiniToggle
                  label="Random first turn"
                  checked={config.randomFirst}
                  onChange={(randomFirst) => update({ randomFirst })}
                  accent={accent}
                />
              </div>
            </Panel>
          </div>
        )}

        {/* ---------------- RULES ---------------- */}
        {tab === 'rules' && (
          <div className="w-full">
            <Panel title="Voting">
              <ChipGroup
                label="Method"
                options={VOTING.map((v) => ({ id: v.id, label: v.label }))}
                value={config.voting}
                onChange={(voting: VotingId) => update({ voting })}
                accent={accent}
              />
              <div className="my-1.5 h-px bg-white/10" />
              <ChipGroup
                label="On a tie"
                options={TIE_RULES.map((t) => ({ id: t.id, label: t.label }))}
                value={config.tieRule}
                onChange={(tieRule: TieId) => update({ tieRule })}
                accent={accent}
              />
            </Panel>

            <Panel title="Imposter rules">
              <MiniToggle
                label="Hint for imposter (gives the category)"
                checked={config.hints}
                onChange={(hints) => update({ hints })}
                accent={accent}
              />
              <MiniToggle
                label="Imposter is shown the word (they must bluff)"
                checked={config.imposterKnowsWord}
                onChange={(imposterKnowsWord) => update({ imposterKnowsWord })}
                accent={accent}
              />
            </Panel>

            <Panel title="Table flow">
              <MiniToggle
                label="Pass and play (tap to reveal each role)"
                checked={config.passAndPlay}
                onChange={(passAndPlay) => update({ passAndPlay })}
                accent={accent}
              />
              <MiniToggle
                label="Scoreboard across rounds"
                checked={config.scoreboard}
                onChange={(scoreboard) => update({ scoreboard })}
                accent={accent}
              />
            </Panel>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={startGame}
          className={[
            BTN_RESET,
            'grid h-12 w-full max-w-[360px] place-items-center rounded-[15px]',
            'text-[1rem] font-extrabold uppercase tracking-[0.12em] text-white',
            'transition-transform duration-fast ease-out hover:-translate-y-[2px] active:translate-y-[1px]',
            'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#FDE68A]',
            isWord
              ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_6px_0_#4C1D95,0_16px_34px_rgba(0,0,0,0.45)]'
              : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_6px_0_#7C2D12,0_16px_34px_rgba(0,0,0,0.45)]',
          ].join(' ')}
        >
          Start Game
          {changedCount > 0 && (
            <span className="ml-1 text-[0.7rem] font-bold normal-case tracking-normal opacity-80">
              · {changedCount} changed
            </span>
          )}
        </button>
      </div>
    </ScreenShell>
  );
}
