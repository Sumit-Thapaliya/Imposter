import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { BACKGROUNDS } from '@/data/characters';
import { colors } from '@/theme/tokens';

type Props = { reveal?: number };

const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  return { left: `${(r * 100).toFixed(1)}%`, size: 2 + Math.round(r * 3), delay: r * 8000, duration: 9000 + r * 9000 };
});

function Particle({ left, size, delay, duration }: { left: string; size: number; delay: number; duration: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [duration, delay, progress]);

  const { height } = Dimensions.get('window');
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -height * 1.12] });
  const opacity = progress.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 0.5, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        { left: left as unknown as number, width: size, height: size, opacity, transform: [{ translateY }] },
      ]}
    />
  );
}

/** Cosmic backdrop: image + vignette + drifting star particles. */
export function StartBackdrop({ reveal = 1 }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ImageBackground source={BACKGROUNDS.portrait} style={StyleSheet.absoluteFill} resizeMode="cover" />

      {/* vignette */}
      <LinearGradient
        colors={['rgba(11,6,24,0.55)', 'transparent', 'transparent', 'rgba(11,6,24,0.88)']}
        locations={[0, 0.24, 0.66, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* soft violet bloom behind the stage */}
      <View style={styles.haze} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="bloom" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.34" />
              <Stop offset="46%" stopColor="#D946EF" stopOpacity="0.16" />
              <Stop offset="100%" stopColor="#D946EF" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bloom)" />
        </Svg>
      </View>

      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    bottom: -20,
    borderRadius: 99,
    backgroundColor: '#fff',
    shadowColor: '#D8B4FE',
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  haze: {
    position: 'absolute',
    left: '-10%',
    right: '-10%',
    top: '20%',
    height: 520,
  },
});
