import type { JSX } from 'react';
'use client';

import { useSearchParams } from 'next/navigation';
import { LocalSetupScreen } from './LocalSetupScreen';
import type { LocalModeId } from '@shared/game';

/** Reads `?mode` and hands it to the screen as a plain prop. */
export function LocalSetupRoute(): JSX.Element {
  const params = useSearchParams();
  const mode: LocalModeId = params.get('mode') === 'drawing' ? 'drawing' : 'word';
  return <LocalSetupScreen mode={mode} />;
}
