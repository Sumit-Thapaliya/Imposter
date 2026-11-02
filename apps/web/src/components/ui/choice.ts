/**
 * Shared visual contract for the two "pick one of two" screens
 * (Select Play Type, Choose Game Mode).
 *
 * IMPORTANT: card colours and shadows are written as Tailwind *arbitrary values*
 * (`bg-[linear-gradient(...)]`), not as theme tokens. The class scanner always
 * generates these, so the cards render correctly even if `tailwind.config.ts`
 * is stale or missing the custom colour entries. Do not move them back into
 * the theme.
 */

/** The card itself — geometry only. Colour comes from CARD_TONE. */
export const CARD_BASE = [
  'group relative isolate flex w-full flex-col items-center justify-center',
  'min-h-[clamp(196px,30dvh,268px)] rounded-[22px]',
  'px-3 pb-10 pt-3 text-center sm:px-5 sm:pt-5',
  'transition-transform duration-fast ease-out',
  'hover:-translate-y-[3px] active:translate-y-[2px]',
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px]',
  'focus-visible:outline-[#FDE68A]',
].join(' ');

/**
 * Per-variant colour + 3D edge. Arbitrary values on purpose (see file header).
 * Each string is a complete, self-contained set of classes.
 */
export const CARD_TONE = {
  local:
    'bg-[linear-gradient(170deg,#4ADE80_0%,#22C55E_42%,#12A150_100%)] ' +
    'shadow-[0_9px_0_#0E7A3C,0_20px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] ' +
    'hover:shadow-[0_12px_0_#0E7A3C,0_26px_52px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] ' +
    'active:shadow-[0_5px_0_#0E7A3C,0_10px_24px_rgba(0,0,0,0.45)]',
  online:
    'bg-[linear-gradient(170deg,#65B8F8_0%,#2F8BF5_45%,#1E6FD0_100%)] ' +
    'shadow-[0_9px_0_#14508F,0_20px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] ' +
    'hover:shadow-[0_12px_0_#14508F,0_26px_52px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] ' +
    'active:shadow-[0_5px_0_#14508F,0_10px_24px_rgba(0,0,0,0.45)]',
  word:
    'bg-[linear-gradient(170deg,#A78BFA_0%,#8B5CF6_44%,#7C3AED_100%)] ' +
    'shadow-[0_9px_0_#4C1D95,0_20px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] ' +
    'hover:shadow-[0_12px_0_#4C1D95,0_26px_52px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] ' +
    'active:shadow-[0_5px_0_#4C1D95,0_10px_24px_rgba(0,0,0,0.45)]',
  drawing:
    'bg-[linear-gradient(170deg,#FB923C_0%,#F97316_45%,#EA580C_100%)] ' +
    'shadow-[0_9px_0_#7C2D12,0_20px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] ' +
    'hover:shadow-[0_12px_0_#7C2D12,0_26px_52px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)] ' +
    'active:shadow-[0_5px_0_#7C2D12,0_10px_24px_rgba(0,0,0,0.45)]',
} as const;

export type CardTone = keyof typeof CARD_TONE;

/** Glossy sheen across the top half. Arbitrary gradient, same reason as above. */
export const SHEEN =
  'pointer-events-none absolute inset-x-0.5 top-0.5 h-[44%] rounded-t-[20px] rounded-b-[46%] ' +
  'bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0))]';

/** Fixed box for the illustration, so art can never change card height. */
export const ART_BOX =
  'relative z-[1] mb-1.5 flex h-[clamp(52px,15vw,74px)] w-[clamp(104px,32vw,150px)] items-center justify-center';

/** Title — identical on both screens. */
export const TITLE =
  'relative z-[1] font-display text-[clamp(1rem,4.4vw,1.4rem)] font-extrabold leading-[1.1] text-white ' +
  '[text-shadow:0_2px_5px_rgba(0,0,0,0.35)]';

/** Subtitle — reserved two lines so a short label never sits higher than a long one. */
export const SUBTITLE =
  'relative z-[1] mt-1 flex min-h-[2.6em] max-w-[19ch] items-start justify-center ' +
  'text-[clamp(0.64rem,2.7vw,0.8rem)] font-semibold leading-[1.3] text-white/95 ' +
  '[text-shadow:0_1px_4px_rgba(0,0,0,0.3)]';

/** Small muted tag, bottom-left. */
export const TAG =
  'absolute bottom-3 left-3 z-[1] text-[0.55rem] font-extrabold uppercase tracking-[0.08em] text-white/60';

/** Round arrow, bottom-right. Text colour set per variant by the card. */
export const ARROW = [
  'absolute bottom-[10px] right-[10px] z-[1] grid h-[28px] w-[28px] place-items-center',
  'rounded-full bg-white/[0.88] shadow-[0_2px_6px_rgba(0,0,0,0.25)]',
  'transition-transform duration-fast ease-out group-hover:translate-x-0.5',
].join(' ');

/** Grid that holds exactly two cards. */
export const CARD_GRID =
  'grid w-full grid-cols-2 gap-[clamp(10px,3vw,22px)] max-[340px]:grid-cols-1';
