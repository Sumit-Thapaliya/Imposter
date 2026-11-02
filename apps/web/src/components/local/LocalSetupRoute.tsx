'use client';

import { useSearchParams } from 'next/navigation';
import { LocalSetupScreen } from './LocalSetupScreen';
import type { LocalModeId } from '@/data/localConfig';

/** Reads `?mode` and hands it to the screen as a plain prop. */
export function LocalSetupRoute() {
  const params = useSearchParams();
  const mode: LocalModeId = params.get('mode') === 'drawing' ? 'drawing' : 'word';
  return <LocalSetupScreen mode={mode} />;
}
