'use client';

import {
  CAPACITY,
  CHANNEL_MODES,
  IMPOSTER_RANGE,
  ROUND_RANGE,
  TEAM_MODES,
  maxImpostersFor,
  type RoomSettings,
} from '@/lib/rooms/settings';

/**
 * Host settings for a new online room.
 *
 * Tailwind-only (the rest of RoomScreen still uses CSS Modules; these fields are
 * new, so they follow the project's Tailwind rule). Arbitrary values for colour,
 * and every native <button> starts from a reset because preflight is off.
 */

const BTN =
  'appearance-none border-0 bg-transparent font-inherit';

/**
 * Label on the left, controls on the right.
 *
 * The settings used to be one block per control (title, hint, then a row of
 * buttons) which pushed the form to ~1160px and made a laptop scroll. Pairing a
 * label with its control halves the height.
 */
function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-[0.82rem] font-bold leading-tight text-white">{label}</span>
        {value && (
          <span className="block text-[0.64rem] font-semibold leading-tight text-[#b0a1cd]">{value}</span>
        )}
      </span>
      <span className="shrink-0">{children}</span>
    </div>
  );
}

/** A label with a full-width control underneath — for chips that need the space. */
function FieldBlock({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.82rem] font-bold leading-tight text-white">{label}</span>
        {value && <span className="text-[0.62rem] font-semibold text-[#b0a1cd]">{value}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[0.8rem] font-bold text-white">{label}</span>
      <span className="text-[0.66rem] font-semibold text-[#b0a1cd]">{value}</span>
    </div>
  );
}

function Counter({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`Fewer ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={[BTN, 'grid h-8 w-8 place-items-center rounded-[9px] bg-white/12 text-[1.05rem] font-extrabold leading-none text-white transition-colors duration-fast disabled:opacity-35 enabled:hover:bg-white/[0.22]'].join(' ')}
      >
        −
      </button>
      <span className="grid h-9 w-11 place-items-center rounded-[10px] bg-[#1b1236] text-[1rem] font-extrabold text-white ring-1 ring-inset ring-white/15">
        {value}
      </span>
      <button
        type="button"
        aria-label={`More ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={[BTN, 'grid h-8 w-8 place-items-center rounded-[9px] bg-[#5933a2] text-[1.05rem] font-extrabold leading-none text-white transition-colors duration-fast disabled:opacity-35 enabled:hover:bg-[#6b40bf]'].join(' ')}
      >
        +
      </button>
    </div>
  );
}

function Switch({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[BTN, 'flex w-full items-center justify-between gap-2 rounded-[10px] px-1.5 py-1.5 text-left transition-colors duration-fast hover:bg-white/[0.06]'].join(' ')}
    >
      <span className="min-w-0">
        <span className="block text-[0.8rem] font-bold leading-tight text-white">{label}</span>
        {note && <span className="block text-[0.64rem] font-semibold leading-tight text-[#9d8dc0]">{note}</span>}
      </span>
      <span
        aria-hidden="true"
        className={[
          'relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors duration-fast',
          checked ? 'bg-[#7c4ddb] shadow-[0_2px_0_#4722a6]' : 'bg-[#453469] ring-1 ring-inset ring-white/20',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-[left] duration-fast',
            checked ? 'left-[21px]' : 'left-[3px]',
          ].join(' ')}
        />
      </span>
    </button>
  );
}

function Chips<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={[
              BTN,
              'rounded-[10px] px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.04em] transition-transform duration-fast active:translate-y-[1px]',
              active
                ? 'bg-[#5933a2] text-white shadow-[0_2px_0_#34186b] ring-1 ring-inset ring-[#c49aff]/50'
                : 'bg-white/8 text-[#c9bee4] ring-1 ring-inset ring-white/12 hover:bg-white/14',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] bg-[#160d33]/80 p-3 ring-1 ring-inset ring-[#8a69c4]/35">
      <h3 className="m-0 mb-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] text-[#cdbde8]">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

export function RoomSettingsFields({
  settings,
  onChange,
}: {
  settings: RoomSettings;
  onChange: (patch: Partial<RoomSettings>) => void;
}) {
  const ceiling = maxImpostersFor(settings.capacity);

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <Section title="Table">
        <Field label="Max players" value={`${CAPACITY.min}–${CAPACITY.max}`}>
          <Counter
            label="players"
            value={settings.capacity}
            min={CAPACITY.min}
            max={CAPACITY.max}
            onChange={(capacity) => onChange({ capacity })}
          />
        </Field>
        <Field label="Imposters" value={`max ${ceiling}`}>
          <Counter
            label="imposters"
            value={settings.imposters}
            min={IMPOSTER_RANGE.min}
            max={ceiling}
            onChange={(imposters) => onChange({ imposters })}
          />
        </Field>
        <FieldBlock
          label="Imposter words"
          value={TEAM_MODES.find((t) => t.id === settings.imposterTeam)?.note ?? ''}
        >
          <Chips
            label="Imposter team words"
            value={settings.imposterTeam}
            options={TEAM_MODES.map((t) => ({ id: t.id, label: t.label }))}
            onChange={(imposterTeam) => onChange({ imposterTeam })}
          />
        </FieldBlock>
      </Section>

      <Section title="Rounds & clocks">
        <Field label="Rounds" value={`${ROUND_RANGE.min}–${ROUND_RANGE.max}`}>
          <Counter
            label="rounds"
            value={settings.rounds}
            min={ROUND_RANGE.min}
            max={ROUND_RANGE.max}
            onChange={(rounds) => onChange({ rounds })}
          />
        </Field>
        <FieldBlock label="Clue clock" value={settings.clueTimer === 0 ? 'off' : `${settings.clueTimer}s`}>
          <Chips
            label="Clue clock"
            value={String(settings.clueTimer)}
            options={[
              { id: '30', label: '30s' },
              { id: '60', label: '60s' },
              { id: '90', label: '90s' },
              { id: '0', label: 'Off' },
            ]}
            onChange={(value) => onChange({ clueTimer: Number(value) })}
          />
        </FieldBlock>
        <FieldBlock label="Discussion" value={settings.discussionTimer === 0 ? 'off' : `${settings.discussionTimer}s`}>
          <Chips
            label="Discussion clock"
            value={String(settings.discussionTimer)}
            options={[
              { id: '0', label: 'Off' },
              { id: '30', label: '30s' },
              { id: '60', label: '60s' },
              { id: '90', label: '90s' },
            ]}
            onChange={(value) => onChange({ discussionTimer: Number(value) })}
          />
        </FieldBlock>
      </Section>

      <Section title="Content">
        <FieldBlock label="Word domain">
          <Chips
            label="Word domain"
            value={settings.domain}
            options={[
            { id: 'food', label: 'Food' },
            { id: 'animals', label: 'Animals' },
            { id: 'places', label: 'Places' },
            { id: 'movies', label: 'Movies' },
            { id: 'objects', label: 'Objects' },
            { id: 'sports', label: 'Sports' },
          ]}
            onChange={(domain) => onChange({ domain })}
          />
        </FieldBlock>
        <div className="pt-0.5">
          <Switch
            label="Hint for imposter"
            note="They are told the category"
            checked={settings.hints}
            onChange={(hints) => onChange({ hints })}
          />
          <Switch
            label="Reveal teammates"
            note="Imposters see each other"
            checked={settings.revealTeammates}
            onChange={(revealTeammates) => onChange({ revealTeammates })}
          />
        </div>
      </Section>

      <Section title="Talk to each other">
        <FieldBlock label="Channel">
          <Chips
            label="Communication channel"
            value={settings.channels}
            options={CHANNEL_MODES.map((c) => ({ id: c.id, label: c.label }))}
            onChange={(channels) => onChange({ channels })}
          />
        </FieldBlock>
        <p className="m-0 pt-1 text-[0.64rem] font-semibold leading-snug text-[#9d8dc0]">
          {settings.channels === 'chat'
            ? 'Typed chat only — no microphone needed.'
            : settings.channels === 'voice'
              ? 'Push-to-talk mic. Chat stays off.'
              : 'Chat and mic are both available.'}
        </p>
      </Section>

      <Section title="Room flow">
        <Switch
          label="Auto-start when full"
          checked={settings.autoStart}
          onChange={(autoStart) => onChange({ autoStart })}
        />
        <Switch
          label="Allow spectators"
          note="Watch without playing"
          checked={settings.allowSpectators}
          onChange={(allowSpectators) => onChange({ allowSpectators })}
        />
        <Switch
          label="Late join"
          note="Join after round one"
          checked={settings.lateJoin}
          onChange={(lateJoin) => onChange({ lateJoin })}
        />
        <FieldBlock label="Voting">
          <Chips
            label="Voting method"
            value={settings.voting}
            options={[
              { id: 'open', label: 'Open' },
              { id: 'secret', label: 'Secret' },
            ]}
            onChange={(voting) => onChange({ voting })}
          />
        </FieldBlock>
      </Section>
    </div>
  );
}
