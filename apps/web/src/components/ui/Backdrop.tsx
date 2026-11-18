'use client';

import { useEffect, useState, type JSX } from 'react';

/**
 * Backdrop art, one painting per screen, in two orientations.
 *
 * A single portrait painting can never fill a desktop window without either
 * cropping the character out or leaving letterbox bars. So each screen ships a
 * portrait AND a landscape composition of the same scene, and we pick by the
 * window's aspect ratio — not by CSS media queries, because a tall browser
 * window on a wide monitor should still get the portrait art.
 */
export const BACKDROPS = {
  playtype: {
    portrait: '/backgrounds/playtype-portrait-1600.jpg',
    landscape: '/backgrounds/playtype-landscape-1920.jpg',
  },
  gamemode: {
    portrait: '/backgrounds/gamemode-portrait-1400.jpg',
    landscape: '/backgrounds/gamemode-landscape-1920.jpg',
  },
} as const;

export type BackdropKey = keyof typeof BACKDROPS;

/** Tailwind `sm` breakpoint. Matches portrait phones. */
const BREAKPOINT = 640;

function useIsPortraitWindow() {
  // Start as null so server and first client render agree (no hydration mismatch),
  // then resolve to the real value on mount.
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isPortrait;
}

type Props = { screen: BackdropKey };

/**
 * Renders the art so it ALWAYS fills the viewport:
 *
 * - before/without JS → the portrait image, `cover` (safe on phones)
 * - portrait window   → portrait image, `cover`
 * - landscape window  → landscape image, `cover`
 *
 * Because each orientation has a painting composed for that shape, `cover` no
 * longer has to slice anything important off — the character and castle are
 * inside the safe area of both compositions.
 */
export function Backdrop({ screen }: Props) : JSX.Element {
  const isPortrait = useIsPortraitWindow();
  const art = BACKDROPS[screen];
  const src = isPortrait === false ? art.landscape : art.portrait;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover object-bottom"
      />
      {/* soft top scrim so titles stay legible over bright skies */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,6,24,0.55)_0%,transparent_28%,transparent_72%,rgba(11,6,24,0.45)_100%)]"
      />
    </>
  );
}
