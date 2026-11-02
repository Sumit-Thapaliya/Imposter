/**
 * Image preloading with real progress reporting.
 *
 * There is no fake spinner: the loading screen advances only as actual bytes
 * arrive. Each URL reports once on settle so progress can never exceed 1.
 */
export type PreloadProgress = {
  loaded: number;
  total: number;
  ratio: number;
  failed: string[];
};

export function preloadImages(
  urls: string[],
  onProgress: (p: PreloadProgress) => void,
): { promise: Promise<PreloadProgress>; cancel: () => void } {
  let cancelled = false;
  const total = urls.length;
  let loaded = 0;
  const failed: string[] = [];

  const promise = new Promise<PreloadProgress>((resolve) => {
    if (total === 0) {
      resolve({ loaded: 0, total: 0, ratio: 1, failed });
      return;
    }

    const settle = (url: string, ok: boolean) => {
      if (cancelled) return;
      loaded += 1;
      if (!ok) failed.push(url);
      const progress: PreloadProgress = {
        loaded,
        total,
        ratio: loaded / total,
        failed,
      };
      onProgress(progress);
      if (loaded === total) resolve(progress);
    };

    urls.forEach((url) => {
      const img = new Image();
      // Load WebP variant alongside the PNG when the browser supports it.
      img.src = url;
      if (img.complete && img.naturalWidth > 0) {
        settle(url, true);
        return;
      }
      img.onload = () => settle(url, true);
      img.onerror = () => settle(url, false);
    });
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
    },
  };
}

/** Small delay helper used for the minimum on-screen time of the loader. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
