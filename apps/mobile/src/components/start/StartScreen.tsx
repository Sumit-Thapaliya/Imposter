import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StartBackdrop } from './StartBackdrop';
import { LogoLockup } from './LogoLockup';
import { CharacterStage } from './CharacterStage';
import { PlayButton } from './PlayButton';
import { StartProgressBar } from './StartProgressBar';
import { colors } from '@/theme/tokens';
import { PLAY_TYPES, DOMAINS, DEFAULT_CONFIG } from '@shared/game';

/** Start screen — backdrop, logo, character stage, CTA. */
export function StartScreen({ onPlay }: { onPlay?: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <View style={styles.root}>
      <StartBackdrop />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <LogoLockup />
        </View>

        <View style={styles.middle}>
          <CharacterStage />
        </View>

        <View style={styles.bottom}>
          <View style={styles.ctaSlot}>
            {loaded ? <PlayButton onPress={onPlay} /> : <StartProgressBar onDone={handleLoaded} />}
          </View>
          {/* Reads straight from the shared package, so this line can never disagree
              with what the website says or with the setup screens that follow. */}
          <Text style={styles.hint}>
            {PLAY_TYPES.map((type) => type.title.toUpperCase()).join(' · ')}
          </Text>
          <Text style={styles.hintDim}>
            {DOMAINS.length} CATEGORIES · {DEFAULT_CONFIG.players} PLAYERS BY DEFAULT
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  // narrow side padding: the character trio is meant to sit wide on the screen
  safe: { flex: 1, paddingHorizontal: 8, paddingVertical: 12 },
  top: { paddingTop: 12, alignItems: 'center' },
  middle: { flex: 1, justifyContent: 'flex-end', paddingBottom: 28 },
  bottom: { paddingBottom: 16, gap: 10, alignItems: 'center' },
  ctaSlot: { minHeight: 62, width: '100%', alignItems: 'center', justifyContent: 'center' },
  hintDim: {
    fontSize: 9,
    letterSpacing: 1.1,
    fontWeight: '600',
    color: colors.textDim,
  },
  hint: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.textDim,
    textAlign: 'center',
  },
});
