import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ChoiceCard, ScreenHeader, ScreenShell } from '../../src/components/ui/Screen';
import { SORTED_GAME_MODES } from '../../src/shared/index';
import { DrawingArt, WordArt } from '../../src/components/ui/ModeArt';

/**
 * Choose Game Mode — Word or Drawing.
 *
 * `path` decides where back goes and where a card leads. The two modes keep their own
 * colours (violet and orange) exactly as they do on the website.
 */

export default function GameModeScreen() {
  const router = useRouter();
  const { path } = useLocalSearchParams<{ path?: string }>();
  const isOnline = path === 'online';

  return (
    <ScreenShell backdrop="portrait">
      <View style={styles.body}>
        <ScreenHeader
          title="Choose Game Mode"
          subtitle={isOnline ? 'The room plays this mode' : 'Pick how this table plays'}
          badge={{ label: isOnline ? 'Online' : 'Local', tone: isOnline ? 'online' : 'local' }}
          onBack={() => router.push('/play-type')}
        />
        <View style={styles.cards}>
          {SORTED_GAME_MODES.map((mode) => (
            <ChoiceCard
              key={mode.id}
              title={mode.title}
              subtitle={mode.subtitle}
              accent={mode.accent}
              glyph={mode.id === 'word' ? <WordArt /> : <DrawingArt />}
              sound={mode.id === 'word' ? 'select-word' : 'select-drawing'}
              onPress={() =>
                router.push(
                  isOnline
                    ? { pathname: '/room', params: { mode: mode.id } }
                    : { pathname: '/local/setup', params: { mode: mode.id } },
                )
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
