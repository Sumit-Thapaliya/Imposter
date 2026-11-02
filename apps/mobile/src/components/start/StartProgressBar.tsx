import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius } from '@/theme/tokens';

type Props = {
  /** how long the bar takes to fill, in ms */
  duration?: number;
  /** fires once the bar reaches 100% */
  onDone?: () => void;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Decorative "warming up" bar shown before the Get Started button appears.
 * Deliberately NOT tied to real loading — assets were already preloaded on the
 * loading screen; this is a short pacing beat so the CTA does not pop in instantly.
 */
export function StartProgressBar({ duration = 1900, onDone }: Props) {
  const [pct, setPct] = useState(0);
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(width, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    const id = width.addListener(({ value }) => setPct(Math.round(easeOutCubic(value) * 100)));

    anim.start(({ finished }) => {
      if (finished) {
        setPct(100);
        onDone?.();
      }
    });

    return () => {
      anim.stop();
      width.removeListener(id);
    };
  }, [duration, onDone, width]);

  const widthInterpolate = width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const done = pct >= 100;

  return (
    <View style={styles.wrap}>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityLabel="Preparing the game"
        accessibilityValue={{ now: pct, min: 0, max: 100 }}
      >
        <Animated.View style={[styles.fillWrap, { width: widthInterpolate }]}>
          <LinearGradient
            colors={gradients.progress}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.label}>{done ? 'READY' : 'LOADING'}</Text>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 340, gap: 6 },
  track: {
    height: 11,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(11,6,24,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.35)',
    overflow: 'hidden',
  },
  fillWrap: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { flex: 1 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 2 },
  label: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, color: colors.textDim },
  pct: { fontSize: 9, fontWeight: '800', letterSpacing: 0.7, color: colors.goldSoft },
});
