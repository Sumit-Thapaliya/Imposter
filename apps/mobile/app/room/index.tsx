import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { ScreenShell } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/theme/tokens';
import { DEFAULT_SETTINGS, normaliseSettings, type RoomSettings } from '../../src/shared/settings';
import { getSocket, send, setSession, watchConnection } from '../../src/lib/rooms/socket';

/**
 * Online — create or join a room.
 *
 * This is the app's version of the web room entry screen, reduced to what a phone needs:
 * a name, an avatar, word or drawing, then either "create" or "join with a code". The
 * host settings that the website shows inline live on their own screen here, because a
 * phone has no room for both a settings form and a keyboard.
 */

type Step = 'gate' | 'create' | 'join';

const AVATARS = [
  { id: 'crew-red', label: 'Crew' },
  { id: 'cyber-neon', label: 'Neon' },
  { id: 'galaxy-cosmic', label: 'Cosmic' },
] as const;

export default function RoomEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();

  const [step, setStep] = useState<Step>('gate');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>('crew-red');
  const [mode, setMode] = useState<'word' | 'drawing'>(params.mode === 'drawing' ? 'drawing' : 'word');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState(false);
  const [settings, setSettings] = useState<RoomSettings>(DEFAULT_SETTINGS);

  useEffect(() => watchConnection(setOnline), []);

  const patch = useCallback(
    (change: Partial<RoomSettings>) =>
      setSettings((current) => normaliseSettings({ ...current, ...change })),
    [],
  );

  async function create() {
    setError('');
    if (name.trim().length < 2) {
      setError('Pick a name of at least 2 characters.');
      return;
    }
    setBusy(true);
    try {
      const ack = await send('room:create', {
        name: name.trim(),
        avatar,
        mode,
        settings,
      });
      if (!ack.ok || !ack.session) {
        setError(ack.error ?? 'Could not create the room.');
        return;
      }
      setSession(ack.session);
      router.push(`/room/${ack.session.code}`);
    } finally {
      setBusy(false);
    }
  }

  async function join() {
    setError('');
    const clean = code.trim().toUpperCase();
    if (clean.length !== 4) {
      setError('Room codes are 4 characters.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Pick a name of at least 2 characters.');
      return;
    }
    setBusy(true);
    try {
      const ack = await send('room:join', { code: clean, name: name.trim(), avatar });
      if (!ack.ok || !ack.session) {
        setError(ack.error ?? 'Could not join that room.');
        return;
      }
      setSession(ack.session);
      router.push(`/room/${ack.session.code}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenShell backdrop="portrait">
      <View style={styles.root}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() =>
              step === 'gate' ? router.push('/game-mode?path=online') : setStep('gate')
            }
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <Svg viewBox="0 0 24 24" width={22} height={22}>
              <Path
                d="M15 5l-7 7 7 7"
                stroke={colors.text}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>
          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>Online · {mode === 'word' ? 'Word' : 'Drawing'}</Text>
            <Text style={styles.title}>
              {step === 'create' ? 'Create room' : step === 'join' ? 'Join room' : 'Play online'}
            </Text>
          </View>
          <View style={[styles.dot, { backgroundColor: online ? '#59EBAD' : '#FF7A8A' }]} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 'gate' && (
            <>
              <Card title="Your name">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Sushil"
                  placeholderTextColor="rgba(245,240,255,0.35)"
                  maxLength={20}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </Card>

              <Card title="Avatar">
                <View style={styles.row}>
                  {AVATARS.map((item) => {
                    const active = item.id === avatar;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setAvatar(item.id)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>

              <Card title="Game mode">
                <View style={styles.row}>
                  {(['word', 'drawing'] as const).map((item) => {
                    const active = item === mode;
                    return (
                      <Pressable
                        key={item}
                        onPress={() => setMode(item)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[
                          styles.chip,
                          active && {
                            backgroundColor: item === 'word' ? '#4C1D95' : '#7C2D12',
                            borderColor: item === 'word' ? '#A78BFA' : '#FB923C',
                          },
                        ]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {item === 'word' ? 'Word' : 'Drawing'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Primary label="Create a room" busy={busy} onPress={() => setStep('create')} />
              <Ghost label="I have a code" onPress={() => setStep('join')} />
            </>
          )}

          {step === 'create' && (
            <>
              <Card title="Table" hint={`${settings.capacity} seats`}>
                <Stepper
                  label="Players"
                  value={settings.capacity}
                  min={3}
                  max={10}
                  onChange={(capacity) => patch({ capacity })}
                />
                <Stepper
                  label="Imposters"
                  value={settings.imposters}
                  min={1}
                  max={Math.max(1, Math.floor(settings.capacity / 3))}
                  onChange={(imposters) => patch({ imposters })}
                />
                <Stepper
                  label="Rounds"
                  value={settings.rounds}
                  min={1}
                  max={5}
                  onChange={(rounds) => patch({ rounds })}
                />
              </Card>

              <Card title="Talking">
                <View style={styles.row}>
                  {(
                    [
                      { id: 'chat', label: 'Chat' },
                      { id: 'voice', label: 'Voice' },
                      { id: 'both', label: 'Both' },
                    ] as const
                  ).map((item) => {
                    const active = settings.channels === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => patch({ channels: item.id })}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>

              <Card title="Word domain">
                <View style={styles.wrap}>
                  {['any', 'food', 'animals', 'places', 'movies', 'objects', 'sports'].map((id) => {
                    const active = settings.domain === id;
                    return (
                      <Pressable
                        key={id}
                        onPress={() => patch({ domain: id })}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {id === 'any' ? 'Any' : id.charAt(0).toUpperCase() + id.slice(1)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Primary label={busy ? 'Creating…' : 'Create room'} busy={busy} onPress={create} />
            </>
          )}

          {step === 'join' && (
            <>
              <Card title="Room code" hint="4 letters">
                <TextInput
                  value={code}
                  onChangeText={(text) => setCode(text.toUpperCase().slice(0, 4))}
                  placeholder="ABCD"
                  placeholderTextColor="rgba(245,240,255,0.25)"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={4}
                  style={[styles.input, styles.codeInput]}
                />
              </Card>

              <Card title="Your name">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Sushil"
                  placeholderTextColor="rgba(245,240,255,0.35)"
                  maxLength={20}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </Card>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Primary label={busy ? 'Joining…' : 'Join room'} busy={busy} onPress={join} />
            </>
          )}
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ pieces */

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
        {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.stepRow}>
      <Text style={styles.stepLabel}>{label}</Text>
      <View style={styles.stepControls}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          style={[styles.stepBtn, value <= min && styles.disabled]}
        >
          <Text style={styles.stepGlyph}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          style={[styles.stepBtn, value >= max && styles.disabled]}
        >
          <Text style={styles.stepGlyph}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Primary({
  label,
  onPress,
  busy = false,
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <LinearGradient
        colors={['#A78BFA', '#7C3AED']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.primary, busy && styles.disabled]}
      >
        <Text style={styles.primaryText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function Ghost({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}
    >
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ styles */

const styles = StyleSheet.create({
  root: { flex: 1, gap: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: {
    height: 44,
    width: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,6,24,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.45)',
  },
  titleWrap: { flex: 1, alignItems: 'center', gap: 1 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.6, color: '#C4B5FD' },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  dot: { height: 10, width: 10, borderRadius: 5, marginRight: 14 },

  scroll: { flex: 1 },
  scrollBody: { gap: 8, paddingBottom: 12 },

  card: {
    backgroundColor: 'rgba(18,10,38,0.95)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    padding: spacing.s3,
    gap: 8,
    ...shadow.card,
  },
  cardHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  cardTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1.4, color: '#C4B5FD' },
  cardHint: { fontSize: 12, fontWeight: '700', color: 'rgba(245,240,255,0.45)' },

  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.45)',
    backgroundColor: 'rgba(11,6,24,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  codeInput: { fontSize: 26, letterSpacing: 8, textAlign: 'center' },

  row: { flexDirection: 'row', gap: 6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#4C1D95', borderColor: '#A78BFA' },
  chipText: { fontSize: 13, fontWeight: '800', color: '#C9BCE6' },
  chipTextActive: { color: '#FFFFFF' },

  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepLabel: { fontSize: 15, fontWeight: '700', color: '#F5F0FF' },
  stepControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    height: 34,
    width: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  stepGlyph: { fontSize: 19, fontWeight: '800', color: '#FFFFFF', lineHeight: 21 },
  stepValue: {
    minWidth: 26,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },

  error: {
    borderRadius: 11,
    backgroundColor: 'rgba(122,36,74,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD1D8',
  },

  primary: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#4C1D95',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  ghost: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.96 },
  disabled: { opacity: 0.45 },
});
