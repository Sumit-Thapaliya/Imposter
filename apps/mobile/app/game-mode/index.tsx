import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ChoiceCard, ScreenHeader, ScreenShell } from '@/components/ui/Screen';
import { SORTED_GAME_MODES } from '@shared/game';

/**
 * Choose Game Mode — Word or Drawing.
 *
 * `path` decides where back goes and where a card leads. The two modes keep their own
 * colours (violet and orange) exactly as they do on the website.
 */

function WordGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={34} height={34}>
      <Rect x="3" y="4" width="18" height="16" rx="3" stroke="#fff" strokeWidth={1.9} fill="none" />
      <Path d="M7 9.5h10M7 13h7" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function DrawingGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={34} height={34}>
      <Path d="M4 20l3.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" stroke="#fff" strokeWidth={1.9} strokeLinejoin="round" fill="none" />
      <Path d="M13.5 6.5l4 4" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

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
              glyph={mode.id === 'word' ? <WordGlyph /> : <DrawingGlyph />}
              onPress={() => {
                if (isOnline) {
                  Alert.alert('Coming soon', 'Online rooms are not available in the mobile app yet.');
                  return;
                }
                router.push({ pathname: '/local/setup', params: { mode: mode.id } });
              }}
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
