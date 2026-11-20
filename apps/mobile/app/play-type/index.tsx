import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { ChoiceCard, ScreenHeader, ScreenShell } from '../../src/components/ui/Screen';
import { LocalArt, OnlineArt } from '../../src/components/ui/ModeArt';
import { SORTED_PLAY_TYPES } from '../../src/shared/index';
import { StyleSheet, View } from 'react-native';

/**
 * Select Play Type — the first real screen in the app.
 *
 * Same two cards, same order and same words as the website, because both read
 * `SORTED_PLAY_TYPES` from the shared package. The glyphs are drawn per platform: the web
 * ones are DOM elements, so there is nothing to share but the data.
 */

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
              glyph={type.id === 'local' ? <LocalArt /> : <OnlineArt />}
              sound={type.id === 'local' ? 'select-local' : 'select-online'}
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
  body: { flex: 1, gap: 14 },
  /** flex: 1 on the row + on each card = the two cards split the screen, no dead space. */
  cards: { gap: 12, flex: 1 },
});
