import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, gradients, radius, shadow } from '@/theme/tokens';

type Props = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
};

/** Primary gold CTA with a pressed-down "3D" edge. */
export function PlayButton({ onPress, label = 'Get Started', disabled = false }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.label}>{label}</Text>
          <Svg viewBox="0 0 24 24" width={22} height={22}>
            <Path
              d="M4 12h15M13 6l6 6-6 6"
              stroke="#2B1B00"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 380, alignSelf: 'center' },
  pressable: { borderRadius: radius.pill, marginBottom: 6, ...shadow.goldGlow },
  pressed: { transform: [{ translateY: 3 }], opacity: 0.95 },
  disabled: { opacity: 0.55 },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    borderBottomWidth: 5,
    borderBottomColor: colors.goldDark,
  },
  label: { fontSize: 17, fontWeight: '800', color: '#2B1B00' },
});
