import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StartBackdrop } from './StartBackdrop';
import { LogoLockup } from './LogoLockup';
import { START_CHARACTERS } from '../../data/characters';
import { BOOT_ASSETS, preloadAssets, wait, type LoadProgress } from '../../lib/preloadAssets';
import { colors, gradients, radius } from '../../theme/tokens';

/**
 * The loading screen's own artwork — a lit theatre stage drawn for this screen, portrait 9:19.5 so
 * it fills a phone with no letterboxing. Drawn as cover, so it crops rather than stretching.
 */
const STAGE = require('../../../assets/backgrounds/stage-portrait-720.jpg');

type Props = {
  onDone?: () => void;
  minDuration?: number;
};

/** Rotating status lines, swapped as progress passes each milestone. */
const STATUS_STEPS = [
  { at: 0, label: 'WAKING THE CREW' },
  { at: 0.28, label: 'WARMING UP THE WORDS' },
  { at: 0.55, label: 'SHARPENING PENCILS' },
  { at: 0.8, label: 'PICKING AN IMPOSTER' },
  { at: 1, label: 'READY TO PLAY' },
];

/**
 * Loading screen.
 * Progress comes from expo-asset downloads — no fake timer.
 * One character per tile, each in its own gesture.
 */
export function LoadingScreen({ onDone, minDuration = 1500 }: Props) {
  const [progress, setProgress] = useState<LoadProgress>({
    loaded: 0,
    total: BOOT_ASSETS.length,
    ratio: 0,
  });
  const [ready, setReady] = useState(false);
  const doneRef = useRef(false);
  const barAnim = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    const started = Date.now();
    /** Never let the loader own the app: if assets stall, move on anyway. */
    const guard = setTimeout(() => {
      if (alive && !doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    }, minDuration + 4000);

    preloadAssets(BOOT_ASSETS, (p) => {
      if (alive) setProgress(p);
    }).then(async () => {
      const elapsed = Date.now() - started;
      if (elapsed < minDuration) await wait(minDuration - elapsed);
      if (!alive) return;
      setReady(true);
      await wait(360);
      if (alive && !doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    });

    return () => {
      alive = false;
      clearTimeout(guard);
    };
  }, [minDuration, onDone]);

  useEffect(() => {
    Animated.timing(heroOpacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [heroOpacity]);

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: progress.ratio,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress.ratio, barAnim]);

  const pct = Math.round(progress.ratio * 100);
  const widthInterpolate = barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const status =
    [...STATUS_STEPS].reverse().find((s) => progress.ratio >= s.at) ?? STATUS_STEPS[0]!;

  return (
    <View style={styles.root}>
      <StartBackdrop />
      {/*
        Full-bleed artwork. The tiles below used to be the only imagery, so the first screen a
        player saw was a small thumbnail floating in empty space. One hero fills the screen and the
        tiles sit on top of it as progress markers.
      */}
      <Animated.Image
        source={STAGE}
        style={[StyleSheet.absoluteFill, { opacity: heroOpacity }]}
        resizeMode="cover"
      />
      {/* A dark scrim over the middle band only: the artwork's centre is bright, and the logo and
          progress bar need contrast without dimming the top and bottom of the picture. */}
      <LinearGradient
        colors={['transparent', 'rgba(11,6,24,0.55)', 'rgba(11,6,24,0.55)', 'transparent']}
        locations={[0.18, 0.34, 0.66, 0.82]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <LogoLockup tagline="Loading the crew…" />

          <View style={styles.progressWrap}>
            <View style={styles.tiles}>
              {START_CHARACTERS.map((c, i) => {
                const threshold = (i + 1) / (START_CHARACTERS.length + 1);
                const filled = progress.ratio >= threshold;
                return (
                  <View
                    key={c.id}
                    style={[
                      styles.tile,
                      filled && styles.tileFilled,
                      { transform: [{ translateY: filled ? -6 : 6 }, { scale: filled ? 1.04 : 1 }] },
                    ]}
                  >
                    <Image source={c.thumb} style={styles.tileImage} resizeMode="cover" />
                  </View>
                );
              })}
            </View>

            <View
              style={styles.track}
              accessibilityRole="progressbar"
              accessibilityValue={{ now: pct, min: 0, max: 100 }}
            >
              <Animated.View style={{ width: widthInterpolate, height: '100%' }}>
                <LinearGradient
                  colors={gradients.progress}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.fill}
                />
              </Animated.View>
            </View>

            <View style={styles.meta}>
              <Text style={styles.status}>{ready ? 'READY TO PLAY' : status.label}</Text>
              <Text style={styles.pct}>{pct}%</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  safe: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 44 },
  progressWrap: { width: '100%', maxWidth: 400, gap: 12 },
  tiles: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 8 },
  tile: {
    width: 62,
    height: 62,
    borderRadius: 99,
    overflow: 'hidden',
    opacity: 0.3,
    borderWidth: 2,
    borderColor: 'rgba(139,92,246,0.35)',
    backgroundColor: '#1b1035',
  },
  tileFilled: {
    opacity: 1,
    borderColor: 'rgba(251,191,36,0.9)',
    shadowColor: '#FBBF24',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  tileImage: { width: '100%', height: '100%' },
  track: {
    height: 13,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(11,6,24,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.35)',
    overflow: 'hidden',
  },
  fill: { flex: 1, borderRadius: radius.pill },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  status: { fontSize: 12, letterSpacing: 1.2, color: colors.textDim, fontWeight: '800' },
  pct: { fontSize: 17, fontWeight: '800', color: colors.goldSoft },
});
