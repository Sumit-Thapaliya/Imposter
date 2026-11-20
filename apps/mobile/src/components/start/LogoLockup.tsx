import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, fonts, gradients } from '../../theme/tokens';

type Props = { tagline?: string };

function Crown() {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Defs>
        <LinearGradient id="gold" x1="32" y1="4" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FDE68A" />
          <Stop offset="1" stopColor="#F59E0B" />
        </LinearGradient>
        <LinearGradient id="mask" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#C4B5FD" />
          <Stop offset="0.45" stopColor="#8B5CF6" />
          <Stop offset="1" stopColor="#5B21B6" />
        </LinearGradient>
      </Defs>

      {/* crown — same mark as the app icon, so the icon and the logo agree */}
      <Path
        d="M20 17.5l3 3.6 3.6-5.6 3.4 5.6 3-3.6 2 7.5H18l2-7.5Z"
        fill="url(#gold)"
        stroke="#B07D06"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />

      {/* the mask */}
      <Path
        d="M32 21c8.4 0 14.5 3.6 14.5 9.2 0 9.4-6.2 17.3-14.5 20.3-8.3-3-14.5-10.9-14.5-20.3C17.5 24.6 23.6 21 32 21Z"
        fill="url(#mask)"
        stroke="#2E1065"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M25 26.5c-3.6 1.4-5.4 4-5.4 7.2"
        stroke="#EDE9FE"
        strokeOpacity={0.55}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Ellipse cx={25.6} cy={34.4} rx={3.5} ry={3.9} fill="#0B0618" />
      <Ellipse cx={38.4} cy={34.4} rx={3.5} ry={3.9} fill="#0B0618" />
      <Circle cx={26.7} cy={33.2} r={1.15} fill="#C4B5FD" />
      <Circle cx={39.5} cy={33.2} r={1.15} fill="#C4B5FD" />
      <Path
        d="M27.4 42.6c1.4 1.5 3.1 2.2 4.6 2.2s3.2-.7 4.6-2.2"
        stroke="#2E1065"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
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
  crown: { width: 52, height: 52, marginBottom: 0 },
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
    fontSize: 13,
    fontWeight: '600',
    color: '#E9E1FF',
    letterSpacing: 0.4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
});
