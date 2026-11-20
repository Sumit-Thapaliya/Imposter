'use client';

import type { JSX } from 'react';
import { useSound } from '@/lib/audio';

/**
 * Speaker toggle, top-right — the web twin of `apps/mobile/src/components/ui/SoundToggle.tsx`.
 *
 * Same 44×44 target, same stroke language as the back arrow, same persisted preference key, so the
 * two apps behave identically. `fixed` placement for the same reason the back button uses it:
 * absolute resolves against whatever ancestor happens to be relative.
 */
export function SoundToggle(): JSX.Element {
  const [muted, toggle] = useSound();

  return (
    <button
      type="button"
      onClick={() => toggle()}
      aria-pressed={muted}
      aria-label={muted ? 'Sound off. Turn sound on' : 'Sound on. Turn sound off'}
      title={muted ? 'Sound off' : 'Sound on'}
      className="fixed right-3 top-3 z-30 grid h-11 w-11 place-items-center rounded-full border-0 bg-[#0B0618]/70 text-white/90 backdrop-blur-sm transition hover:bg-[#0B0618]/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FDE68A]"
    >
      <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
        <path
          d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4z"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {muted ? (
          <path d="M16.5 9.5l4.5 5M21 9.5l-4.5 5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        ) : (
          <>
            <path d="M15.6 9.2a4 4 0 0 1 0 5.6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            <path d="M18.4 7a7 7 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}
