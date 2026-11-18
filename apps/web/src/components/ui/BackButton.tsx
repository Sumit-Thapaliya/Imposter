import type { JSX } from 'react';
'use client';



/**
 * The one back button.
 *
 * It was drawn four times before this — a circle at a `clamp()` offset on the choice
 * screens, a circle at `left-0 top-0` in the room, a square with a different fill in
 * local setup — so the control moved and changed shape depending on which page you were
 * on. Now every screen renders this, so it lands in the same place at the same size with
 * the same colour, and the chrome no longer depends on each page's padding.
 *
 * Placement is `fixed`, not `absolute`: absolute resolves against whichever ancestor
 * happens to be `relative`, which is why the old buttons drifted between screens.
 */

const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]';

/** One place for the geometry. `left`/`top` clear the page padding on every screen. */
export const BACK_BUTTON_CLASS = [
  'fixed left-[clamp(12px,3.5vw,28px)] top-[clamp(12px,2.6dvh,24px)] z-40',
  'grid h-11 w-11 shrink-0 place-items-center rounded-full',
  'bg-[#0B0618]/75 text-white ring-1 ring-inset ring-[#8B5CF6]/45 backdrop-blur-[3px]',
  'transition-transform duration-fast ease-out hover:-translate-x-0.5 active:translate-x-0',
  FOCUS,
].join(' ');

export function BackButton({
  onClick,
  label = 'Go back',
  className,
}: {
  onClick: () => void;
  label?: string;
  /** only for the rare case that needs a nudge — never for position */
  className?: string;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[BACK_BUTTON_CLASS, className ?? ''].join(' ')}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M15 5l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
