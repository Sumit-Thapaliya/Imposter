import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSound } from '../../lib/audio';
import { colors } from '../../theme/tokens';

/**
 * Speaker toggle, drawn with the same stroke language as the back arrow so it reads as part of
 * the furniture rather than a bolted-on control. 44×44 hit target, top-right, present on every
 * screen that has a header.
 *
 * The preference persists across launches; the icon reflects state, not the last tap.
 */
export function SoundToggle({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [muted, toggle] = useSound();
  const stroke = tone === 'dark' ? '#1A1230' : colors.text;

  return (
    <Pressable
      onPress={() => toggle()}
      accessibilityRole="switch"
      accessibilityState={{ checked: !muted }}
      accessibilityLabel={muted ? 'Sound off. Turn sound on' : 'Sound on. Turn sound off'}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Svg viewBox="0 0 24 24" width={22} height={22}>
        {/* speaker body */}
        <Path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4z" fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
        {muted ? (
          <Path d="M16.5 9.5l4.5 5M21 9.5l-4.5 5" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        ) : (
          <>
            <Path d="M15.6 9.2a4 4 0 0 1 0 5.6" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
            <Path d="M18.4 7a7 7 0 0 1 0 10" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
          </>
        )}
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,6,24,0.45)',
  },
  pressed: { opacity: 0.6 },
});
