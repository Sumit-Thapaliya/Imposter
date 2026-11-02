import { Asset } from 'expo-asset';
import { START_CHARACTERS, BACKGROUNDS } from '@/data/characters';

export type LoadProgress = { loaded: number; total: number; ratio: number };

/**
 * Preload every asset the boot sequence needs, reporting real progress.
 * A failed asset resolves anyway so boot can never hang.
 */
export function preloadAssets(
  assets: number[],
  onProgress: (p: LoadProgress) => void,
): Promise<void> {
  const total = assets.length;
  let loaded = 0;

  return new Promise((resolve) => {
    if (total === 0) {
      onProgress({ loaded: 0, total: 0, ratio: 1 });
      resolve();
      return;
    }

    assets.forEach((mod) => {
      const asset = Asset.fromModule(mod);
      const done = () => {
        loaded += 1;
        onProgress({ loaded, total, ratio: loaded / total });
        if (loaded === total) resolve();
      };

      if (asset.downloaded) {
        done();
        return;
      }
      asset.downloadAsync().then(done).catch(done);
    });
  });
}

export const BOOT_ASSETS: number[] = [
  BACKGROUNDS.portrait,
  ...START_CHARACTERS.map((c) => c.source),
  ...START_CHARACTERS.map((c) => c.thumb),
];

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
