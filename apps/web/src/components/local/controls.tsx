import type { JSX } from 'react';
'use client';

import type { ReactNode } from 'react';

/**
 * Native buttons inherit a grey browser-face background because Tailwind
 * preflight is off in this project. Every <button> here must clear it first.
 */
export const BTN_RESET = 'appearance-none border-0 bg-transparent font-inherit';

/** Dark glass panel used for every settings block on the setup screen. */
export function Panel({
  title,
  hint,
  children,
  className = '',
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <section
      className={[
        'relative w-full rounded-[18px] bg-[#0B0618]/92 p-2.5 ring-1 ring-inset ring-white/14',
        'shadow-[0_14px_34px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-[7px]',
        'sm:p-3.5',
        className,
      ].join(' ')}
    >
      <header className="mb-1.5 flex items-baseline justify-between gap-2">
        <h2 className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.13em] text-[#C4B5FD]">
          {title}
        </h2>
        {hint && (
          <span className="text-[0.66rem] font-bold tracking-[0.02em] text-[#B09FCE]">{hint}</span>
        )}
      </header>
      {children}
    </section>
  );
}

/** −  value  +  control. */
export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  accent: 'violet' | 'orange';
}): JSX.Element {
  const on = accent === 'violet';
  const activeTone = on
    ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_3px_0_#4C1D95]'
    : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_3px_0_#7C2D12]';

  const btn = [
    BTN_RESET,
    'grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[1.05rem] font-extrabold leading-none',
    'transition-transform duration-fast ease-out enabled:hover:-translate-y-[1px] enabled:active:translate-y-[1px]',
    'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]',
    'disabled:opacity-35',
  ].join(' ');

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.86rem] font-bold text-white/92">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className={[btn, 'bg-white/12 text-white enabled:hover:bg-white/20'].join(' ')}
        >
          −
        </button>
        <span
          aria-live="polite"
          className="grid h-8 w-11 place-items-center rounded-[10px] bg-[#0B0618]/80 text-[1rem] font-extrabold text-white ring-1 ring-inset ring-white/15"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className={[btn, 'text-white', activeTone].join(' ')}
        >
          +
        </button>
      </div>
    </div>
  );
}

/** Pill row of mutually exclusive choices (timer). */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
  accent,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  accent: 'violet' | 'orange';
}): JSX.Element {
  const on =
    accent === 'violet'
      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] text-white shadow-[0_3px_0_#4C1D95]'
      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] text-white shadow-[0_3px_0_#7C2D12]';

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-1 rounded-[12px] bg-[#0B0618]/60 p-1 ring-1 ring-inset ring-white/10"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={String(option.id)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={[
              BTN_RESET,
              'flex-1 rounded-[9px] px-1 py-2 text-[0.74rem] font-extrabold uppercase tracking-[0.05em]',
              'transition-[transform,background-color,color] duration-fast ease-out active:translate-y-[1px]',
              'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]',
              active ? on : 'text-[#B6A8D4] hover:bg-white/[0.06] hover:text-white',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** On/off switch with a one-line explanation. */
export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  accent,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  accent: 'violet' | 'orange';
}): JSX.Element {
  const on =
    accent === 'violet'
      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_2px_0_#4C1D95]'
      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_2px_0_#7C2D12]';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        BTN_RESET,
        'flex w-full items-center justify-between gap-3 rounded-[10px] px-1.5 py-1.5 text-left',
        'transition-colors duration-fast ease-out hover:bg-white/[0.06]',
        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[1px] focus-visible:outline-[#FDE68A]',
      ].join(' ')}
    >
      <span className="min-w-0">
        <span className="block text-[0.86rem] font-bold leading-tight text-white">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[0.68rem] font-semibold leading-tight text-[#BDAEDC]">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={[
          'relative h-[26px] w-[46px] shrink-0 rounded-pill transition-colors duration-fast ease-out',
          checked ? on : 'bg-[#2A1B47] ring-1 ring-inset ring-white/12',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.45)]',
            'transition-[left] duration-fast ease-out',
            checked ? 'left-[23px]' : 'left-[3px]',
          ].join(' ')}
        />
      </span>
    </button>
  );
}

/** Compact inline picker for 2–4 short options (voting style, tie rule). */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  accent,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  accent: 'violet' | 'orange';
}): JSX.Element {
  const on =
    accent === 'violet'
      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] text-white shadow-[0_2px_0_#4C1D95]'
      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] text-white shadow-[0_2px_0_#7C2D12]';

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.84rem] font-bold text-white/92">{label}</span>
      <div role="group" aria-label={label} className="flex items-center gap-1">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={[
                BTN_RESET,
                'rounded-[9px] px-2.5 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.04em]',
                'transition-transform duration-fast ease-out active:translate-y-[1px]',
                'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]',
                active ? on : 'bg-white/10 text-[#C9BEE4] ring-1 ring-inset ring-white/12 hover:bg-white/[0.16]',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Two-line switch used in the Options grid — tighter than ToggleRow. */
export function MiniToggle({
  label,
  checked,
  onChange,
  accent,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  accent: 'violet' | 'orange';
}): JSX.Element {
  const on =
    accent === 'violet'
      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_2px_0_#4C1D95]'
      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_2px_0_#7C2D12]';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        BTN_RESET,
        'flex w-full items-center justify-between gap-1.5 rounded-[10px] px-1.5 py-1 text-left',
        'transition-colors duration-fast ease-out hover:bg-white/[0.06]',
        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[1px] focus-visible:outline-[#FDE68A]',
      ].join(' ')}
    >
      <span className="min-w-0 text-[0.82rem] font-bold leading-tight text-white">{label}</span>
      <span
        aria-hidden="true"
        className={[
          'relative h-[21px] w-[37px] shrink-0 rounded-pill transition-colors duration-fast ease-out',
          checked ? on : 'bg-[#2A1B47] ring-1 ring-inset ring-white/12',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.45)]',
            'transition-[left] duration-fast ease-out',
            checked ? 'left-[16px]' : 'left-[2px]',
          ].join(' ')}
        />
      </span>
    </button>
  );
}
