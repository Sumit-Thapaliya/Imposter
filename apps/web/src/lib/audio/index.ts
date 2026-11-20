'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toneUri, type ToneName } from './tones';

/**
 * Game sounds on the web.
 *
 * One shared `AudioContext`, created lazily on the first user gesture — browsers block audio until
 * then, and creating it earlier produces a context that stays silent and logs a warning.
 *
 * Decoded buffers are cached, so a repeated tap costs nothing after the first play. Every call is
 * wrapped: a browser that refuses audio must never break a card reveal.
 *
 * `reveal` is deliberately a single sound for crew and imposter — see tones.ts.
 */

const MUTE_KEY = 'imposter.muted';

let context: AudioContext | null = null;
let muted = false;
const buffers = new Map<ToneName, AudioBuffer>();
const pending = new Map<ToneName, Promise<AudioBuffer | null>>();

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (context) return context;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    context = new Ctor();
  } catch {
    return null;
  }
  return context;
}

async function decode(name: ToneName): Promise<AudioBuffer | null> {
  const cached = buffers.get(name);
  if (cached) return cached;
  const inFlight = pending.get(name);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const audio = ctx();
    if (!audio) return null;
    try {
      const response = await fetch(toneUri(name));
      const bytes = await response.arrayBuffer();
      const buffer = await audio.decodeAudioData(bytes);
      buffers.set(name, buffer);
      return buffer;
    } catch {
      return null;
    }
  })();

  pending.set(name, promise);
  const result = await promise;
  pending.delete(name);
  return result;
}

/** Fire a game sound. Safe to call anywhere, at any time. */
export function playTone(name: ToneName): void {
  if (muted) return;
  void (async () => {
    try {
      const audio = ctx();
      if (!audio || muted) return;
      if (audio.state === 'suspended') await audio.resume();
      const buffer = await decode(name);
      if (!buffer) return;
      const source = audio.createBufferSource();
      source.buffer = buffer;
      const gain = audio.createGain();
      gain.gain.value = 0.9;
      source.connect(gain).connect(audio.destination);
      source.start();
    } catch {
      /* silence is an acceptable outcome; a crash is not */
    }
  })();
}

/** Reads the saved preference once, on mount. */
export function useSound(): readonly [boolean, (next?: boolean) => void] {
  const [value, setValue] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const saved = window.localStorage.getItem(MUTE_KEY);
      if (saved === '1') {
        muted = true;
        setValue(true);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const toggle = useCallback((next?: boolean) => {
    const target = typeof next === 'boolean' ? next : !muted;
    muted = target;
    setValue(target);
    try {
      window.localStorage.setItem(MUTE_KEY, target ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (!target) playTone('tap');
  }, []);

  return [value, toggle] as const;
}

export type { ToneName };
