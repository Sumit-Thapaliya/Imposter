import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { colors, fonts, gradients } from '@/theme/tokens';

type Props = { tagline?: string };

function Crown() {
  return (
    <Svg viewBox="0 0 64 40" width="100%" height="100%">
      <Defs>
        <LinearGradient id="crownGold" x1="32" y1="2" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDE68A" />
          <Stop offset="1" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>
      <Path
        d="M6 34 L10 6 L22 18 L32 2 L42 18 L54 6 L58 34 Z"
        fill="url(#crownGold)"
        stroke="#B07D06"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Rect x="6" y="30" width="52" height="8" rx="4" fill="url(#crownGold)" stroke="#B07D06" strokeWidth={2.5} />
      <Circle cx="20" cy="12" r="2.6" fill="#FB7185" />
      <Circle cx="32" cy="7" r="2.6" fill="#38BDF8" />
      <Circle cx="44" cy="12" r="2.6" fill="#4ADE80" />
    </Svg>
  );
}

/** "IMPOSTER" wordmark + tagline (text lockup — swap for an SVG logo later). */
export function LogoLockup({ tagline = 'Guess · Draw · Find the Imposter!' }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.crown}>
        <Crown />
      </View>

      <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Imposter Game">
        IMPOSTER
      </Text>

      <Text style={styles.tagline}>{tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  crown: { width: 46, height: 30, marginBottom: 2 },
  title: {
    fontFamily: fonts.display,
    fontSize: 46,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#EDE4FF',
    textShadowColor: 'rgba(139,92,246,0.85)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  tagline: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#E9E1FF',
    letterSpacing: 0.4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
});
