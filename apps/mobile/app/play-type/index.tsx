import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { ChoiceCard, ScreenHeader, ScreenShell } from '@/components/ui/Screen';
import { SORTED_PLAY_TYPES } from '@shared/game';
import { StyleSheet, View } from 'react-native';

/**
 * Select Play Type — the first real screen in the app.
 *
 * Same two cards, same order and same words as the website, because both read
 * `SORTED_PLAY_TYPES` from the shared package. The glyphs are drawn per platform: the web
 * ones are DOM elements, so there is nothing to share but the data.
 */

function LocalGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={34} height={34}>
      <Rect x="3" y="5" width="18" height="12" rx="2.5" stroke="#fff" strokeWidth={1.9} fill="none" />
      <Path d="M8 20h8M12 17v3" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function OnlineGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={34} height={34}>
      <Circle cx="9" cy="9" r="3.2" stroke="#fff" strokeWidth={1.9} fill="none" />
      <Circle cx="16.5" cy="11" r="2.6" stroke="#fff" strokeWidth={1.9} fill="none" />
      <Path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" fill="none" />
      <Path d="M15.5 18.8c.3-2 1.6-3.2 3.1-3.2 1.6 0 2.7 1.2 3 3" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export default function PlayTypeScreen() {
  const router = useRouter();

  return (
    <ScreenShell backdrop="portrait">
      <View style={styles.body}>
        <ScreenHeader
          title="Select Play Type"
          subtitle="How do you want to play?"
          onBack={() => router.push('/')}
        />
        <View style={styles.cards}>
          {SORTED_PLAY_TYPES.map((type) => (
            <ChoiceCard
              key={type.id}
              title={type.title}
              subtitle={type.subtitle}
              accent={type.accent}
              glyph={type.id === 'local' ? <LocalGlyph /> : <OnlineGlyph />}
              onPress={() =>
                router.push(type.id === 'local' ? '/game-mode?path=local' : '/game-mode?path=online')
              }
            />
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, gap: 14, justifyContent: 'center' },
  cards: { gap: 12 },
});
