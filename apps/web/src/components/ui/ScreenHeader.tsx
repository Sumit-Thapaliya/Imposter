'use client';

import type { ReactNode } from 'react';
import { Backdrop, type BackdropKey } from './Backdrop';
import { BackButton } from './BackButton';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

/**
 * Centred screen title + subtitle, small back arrow pinned top-left.
 * Pure Tailwind.
 */
export function ScreenHeader({ title, subtitle, onBack }: Props) {
  return (
    <>
      {onBack && <BackButton onClick={onBack} />}

      <header className="flex w-full flex-col items-center gap-1.5">
        <h1 className="m-0 text-center font-display text-[clamp(1.45rem,6vw,2.3rem)] font-extrabold leading-[1.12] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.7),0_4px_20px_rgba(0,0,0,0.55)]">
          {title}
        </h1>
        {subtitle && (
          <p className="m-0 text-center text-[clamp(0.78rem,3vw,0.95rem)] font-semibold text-white/[0.86] [text-shadow:0_1px_3px_rgba(0,0,0,0.75)]">
            {subtitle}
          </p>
        )}
      </header>
    </>
  );
}

/**
 * Shared page shell. Background comes from <Backdrop>, which picks the portrait
 * or landscape painting for the current window shape so it always fills the
 * screen without cropping anything important.
 */
export function ScreenShell({
  children,
  backdrop = 'playtype',
  scrollable = false,
}: {
  children: ReactNode;
  backdrop?: BackdropKey;
  scrollable?: boolean;
}) {
  return (
    <main className={`relative isolate flex h-[100dvh] flex-col items-center bg-void px-[clamp(12px,4vw,40px)] py-[clamp(12px,3dvh,30px)] ${scrollable ? 'justify-start overflow-y-auto max-sm:px-1' : 'justify-center overflow-hidden'}`}>
      <Backdrop screen={backdrop} />
      {children}
    </main>
  );
}
