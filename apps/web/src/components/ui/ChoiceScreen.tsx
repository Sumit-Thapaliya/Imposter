'use client';

import type { ReactNode, JSX } from 'react';
import { ScreenHeader, ScreenShell } from './ScreenHeader';
import type { BackdropKey } from './Backdrop';
import { CARD_GRID } from './choice';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** optional pill under the header (LOCAL / ONLINE) */
  badge?: { label: string; tone: 'local' | 'online' };
  /** the two cards */
  children: ReactNode;
  footer?: string;
  /** which painting sits behind the screen */
  backdrop?: BackdropKey;
};

/**
 * Shared layout for both choice screens.
 *
 * Every slot has a fixed height, so Select Play Type and Choose Game Mode
 * line up pixel-for-pixel: header → badge row → cards → footer row.
 * Screens supply content only; they never position anything themselves.
 */
export function ChoiceScreen({ title, subtitle, onBack, badge, children, footer, backdrop = 'playtype' }: Props) : JSX.Element {
  return (
    <ScreenShell backdrop={backdrop}>
      <div className="relative z-[1] flex h-full w-full max-w-[680px] flex-col items-center justify-center gap-[clamp(10px,2.2dvh,20px)]">
        <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} />

        {/* badge row — always occupies space so cards never shift between screens */}
        <div className="flex h-6 items-center justify-center">
          {badge && (
            <span
              className={[
                'rounded-pill px-3 py-1 text-[0.56rem] font-extrabold uppercase',
                'tracking-[0.14em] ring-1 ring-inset backdrop-blur-[2px]',
                badge.tone === 'local'
                  ? 'bg-[#22C55E]/15 text-[#4ADE80] ring-[#22C55E]/45'
                  : 'bg-[#2F8BF5]/15 text-[#65B8F8] ring-[#2F8BF5]/45',
              ].join(' ')}
            >
              {badge.label}
            </span>
          )}
        </div>

        <div className={CARD_GRID}>{children}</div>

        {/* footer row — fixed height, same on both screens */}
        <div className="flex h-4 items-center justify-center">
          {footer && (
            <p className="m-0 text-center text-[0.6rem] font-bold tracking-[0.04em] text-text-dim">
              {footer}
            </p>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
