import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { toneUri, type ToneName } from './tones';

export type { ToneName };

/**
 * Game audio — the app's only side-effecting cross-cutting concern.
 *
 * Three rules drive this file:
 *
 * 1. **Never stop his music.** On Android a sound routed to the media stream is polite: it mixes
 *    with whatever is playing. A sound routed to the *notification* or *ring* stream would duck or
 *    pause Spotify. `expo-av`'s `Audio.Sound` uses the media stream, and we never touch the audio
 *    mode or request audio focus, so playback coexists by default.
 *
 * 2. **Never make a sound in silent mode.** `playsInSilentModeIOS` stays false on iOS, and on
 *    Android we check nothing else — the system's own "media volume" is the one control the user
 *    already expects to govern a game.
 *
 * 3. **Never throw.** A phone that refuses to play a tap click must not break a card reveal. Every
 *    call is wrapped; failure is silent by design.
 *
 * `expo-av` is loaded lazily and defensively: if the native module is missing (an old APK that
 * predates this feature), the whole module degrades to a no-op instead of crashing at import.
 */

type Sound = { playAsync: () => Promise<unknown>; unloadAsync: () => Promise<unknown> };

const MUTE_KEY = 'imposter.muted';

/** In-memory mirror of the stored preference, so a tap does not wait on storage. */
let muted = false;
let hydrated = false;

const cache = new Map<ToneName, Sound>();
const loading = new Map<ToneName, Promise<Sound | null>>();

/** Expo AV, if this build has it. `null` on web and on any APK built before audio existed. */
async function loadAv(): Promise<typeof import('expo-av').Audio | null> {
  if (Platform.OS === 'web') return null;
  try {
    const av = await import('expo-av');
    return av.Audio ?? null;
  } catch {
    return null;
  }
}

/** Keeps the preference on disk without pulling in another dependency. */
const store = {
  async get(): Promise<string | null> {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.getItem(MUTE_KEY);
    } catch {
      return null;
    }
  },
  async set(value: string): Promise<void> {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(MUTE_KEY, value);
    } catch {
      /* preference is a nicety, never a requirement */
    }
  },
};

/** Decoded clips are reused; each is a few hundred KB in memory at most. */
async function getSound(name: ToneName): Promise<Sound | null> {
  const existing = cache.get(name);
  if (existing) return existing;

  const pending = loading.get(name);
  if (pending) return pending;

  const promise = (async () => {
    const Audio = await loadAv();
    if (!Audio) return null;
    try {
      await Audio.setAudioModeAsync({
        // The three lines that keep background music alive. `shouldDuckAndroid: false` means we
        // never ask the system to lower someone else's playback for us.
        playsInSilentModeIOS: false,
        shouldDuckAndroid: false,
        staysActiveInBackground: false,
        interruptionModeAndroid: 2, // duck others only when the OS forces us to
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri: toneUri(name) },
        { shouldPlay: false, volume: 1.0, isLooping: false },
      );
      cache.set(name, sound);
      return sound;
    } catch {
      return null;
    }
  })();

  loading.set(name, promise);
  const result = await promise;
  loading.delete(name);
  return result;
}

/** Fire a game sound. Safe to call on any platform, at any time. */
export function playTone(name: ToneName): void {
  if (muted) return;
  void (async () => {
    try {
      const sound = await getSound(name);
      if (!sound || muted) return;
      await sound.playAsync();
    } catch {
      /* a missing click must never surface as a crash */
    }
  })();
}

/** Sets the preference directly (the toggle goes through `useSound`). */
export async function setMuted(next: boolean): Promise<void> {
  muted = next;
  await store.set(next ? '1' : '0');
}

export function isMuted(): boolean {
  return muted;
}

/**
 * App-level hook: hydrates the saved preference once, and returns `[muted, toggle]`.
 * Mounted by the root layout so every screen shares one source of truth.
 */
export function useSound(): readonly [boolean, (next?: boolean) => void] {
  const [value, setValue] = useState(muted);
  const mounted = useRef(true);

  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    void (async () => {
      const saved = await store.get();
      if (!mounted.current) return;
      muted = saved === '1';
      setValue(muted);
    })();
    return () => {
      mounted.current = false;
    };
  }, []);

  const toggle = useCallback((next?: boolean) => {
    const target = typeof next === 'boolean' ? next : !muted;
    muted = target;
    setValue(target);
    void store.set(target ? '1' : '0');
    if (!target) playTone('tap');
  }, []);

  return [value, toggle] as const;
}

/** Unload everything — only used when the app tears the sound layer down. */
export async function unloadTones(): Promise<void> {
  for (const sound of cache.values()) {
    try {
      await sound.unloadAsync();
    } catch {
      /* ignore */
    }
  }
  cache.clear();
}
