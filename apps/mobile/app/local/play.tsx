import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { ScreenShell } from '../../src/components/ui/Screen';
import { colors, radius, shadow, spacing } from '../../src/theme/tokens';
import { domainLabel, selectWord, type DomainChoice } from '../../src/shared/index';
import { DrawingBoard } from '../../src/components/drawing/DrawingBoard';
import { playTone } from '../../src/lib/audio';

/**
 * Local play — the app's twin of `apps/web/src/components/local/LocalPlayScreen.tsx`.
 *
 * Values arrive from `/local/setup` as route params, exactly like the web route. Nothing
 * is stored and no backend is involved: the word and the imposter seats are drawn when the
 * screen mounts, and again on "Play again".
 *
 * Steps:
 *   handout → pass the device, "tap to see your card"
 *   reveal  → the secret word, or "you are the imposter" + hint
 *   discuss → clue order, clocks, vote
 *   result  → who the imposter was, what the word was
 *
 * Word mode only. Drawing mode needs a canvas, which React Native does not have; the
 * handout says so rather than running the wrong game.
 */

type Step = 'handout' | 'reveal' | 'draw' | 'discuss' | 'result';

/** Everything `/local/setup` sends. Kept optional: a hand-typed URL may omit any of it. */
type PlayParams = {
  mode?: string;
  players?: string;
  imposters?: string;
  rounds?: string;
  domain?: string;
  clues?: string;
  hints?: string;
  revealWord?: string;
  randomFirst?: string;
  clueLimit?: string;
  /** comma-separated, one per seat — blank seats fall back to P1, P2… */
  names?: string;
};

const VIOLET = {
  gradient: ['#A78BFA', '#7C3AED'] as [string, string],
  edge: '#4C1D95',
  text: '#C4B5FD',
};

const PINK = {
  gradient: ['#F472B6', '#DB2777'] as [string, string],
  shadow: '#9D174D',
  text: '#FBCFE8',
};

export default function LocalPlayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<PlayParams>();

  /** Params arrive as strings — clamp them the way setup clamped them. */
  const players = Math.min(12, Math.max(3, Number(params.players ?? 6)));
  const imposters = Math.min(
    Math.max(1, Number(params.imposters ?? 1)),
    Math.max(1, Math.floor(players / 3)),
  );
  const isWord = params.mode !== 'drawing';
  const domain = (params.domain ?? 'food') as DomainChoice;
  /** Drawing runs for as many laps as Rounds — everyone adds to one picture. */
  const drawLaps = isWord ? 1 : Math.max(1, Number(params.rounds ?? 3));
  /** Every setup value now reaches this screen; these are the ones the flow needs. */
  const rounds = Math.max(1, Number(params.rounds ?? 3));
  const hintOn = params.hints !== 'false';
  const revealWord = params.revealWord !== 'false';
  const randomFirst = params.randomFirst !== 'false';
  const clueLimit = Number(params.clueLimit ?? 1);

  /**
   * Player names, one per seat, from setup. Blank seats fall back to "P3" etc, so the
   * game reads the same whether the table bothered to type names or not.
   */
  const names = useMemo(() => {
    const given = String(params.names ?? '')
      .split(',')
      .map((value) => value.trim());
    return Array.from({ length: players }, (_, i) => given[i] || `P${i + 1}`);
  }, [params.names, players]);
  /** Seat n is 1-based throughout this screen. */
  const nameOf = (seatNo: number) => names[seatNo - 1] ?? `P${seatNo}`;

  /**
   * One word per game, held in state. Selecting during render would re-roll the answer on
   * every re-render — the bug the web screen had to fix too.
   */
  const [prompt, setPrompt] = useState(() => selectWord(domain));
  const domainName = domainLabel(prompt.domain);

  /** Bumped by "Play again" so a replay re-deals the seats. */
  const [deal, setDeal] = useState(0);

  /** Seat order for the clue round; shuffled only when "random first turn" is on. */
  const order = useMemo(() => {
    const seats = Array.from({ length: players }, (_, i) => i + 1);
    return randomFirst ? shuffle(seats) : seats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, randomFirst, deal]);

  /**
   * Imposters come from a shuffled copy of the seats, never from the end of the list —
   * taking the last N seats made the same player the imposter every game.
   */
  const imposterSeats = useMemo(
    () => new Set(shuffle([...order]).slice(0, imposters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, imposters, deal],
  );

  const [step, setStep] = useState<Step>('handout');
  const [turn, setTurn] = useState(0);

  const seat = order[turn % players] ?? 1;
  const isImposter = imposterSeats.has(seat);
  const lastCard = turn >= players - 1;
  /**
   * Word mode has one lap of cards; drawing has one lap per round. Everything below is
   * scoped to its own mode — `lastTurn` used to be computed with the drawing formula in
   * word mode too, which was harmless only because nothing read it there.
   */
  const lap = Math.floor(turn / players) + 1;
  const lastTurn = isWord || turn >= drawLaps * players - 1;

  const next = useCallback(() => {
    playTone(lastCard ? 'start' : 'pass');
    if (lastCard) {
      setStep(isWord ? 'discuss' : 'draw');
      setTurn(0);
      return;
    }
    setTurn((n) => n + 1);
    setStep('handout');
  }, [lastCard, isWord]);

  /** Drawing: one tap moves the pen, exactly like the web board. */
  const passPen = useCallback(() => {
    playTone(lastTurn ? 'vote' : 'pass');
    if (lastTurn) {
      setStep('discuss');
      setTurn(0);
      return;
    }
    setTurn((n) => n + 1);
  }, [lastTurn]);

  const restart = useCallback(() => {
    playTone('start');
    setPrompt((previous) => selectWord(domain, Math.random, previous.word));
    setDeal((n) => n + 1);
    setStep('handout');
    setTurn(0);
  }, [domain]);

  const goBack = () => router.push({ pathname: '/local/setup', params: { mode: isWord ? 'word' : 'drawing' } });

  return (
    <ScreenShell backdrop="portrait">
      <View style={styles.root}>
        {/* ---- header ---- */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Back to setup"
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
            <Text style={styles.eyebrow}>Local · {isWord ? 'Word mode' : 'Drawing mode'}</Text>
            <Text style={styles.title}>
              {step === 'result'
                ? 'Result'
                : isWord
                  ? 'Round 1'
                  : `Round ${lap} of ${drawLaps}`}
            </Text>
          </View>

          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{isWord ? 'W' : 'D'}</Text>
          </View>
        </View>

        {/* ---- the card fills every spare pixel: no dead space ---- */}
        <View style={[styles.card, step === 'reveal' && isImposter && styles.cardImposter]}>
          <View style={styles.cardTop}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{domainName}</Text>
            </View>
            <Text style={styles.counter}>
              {step === 'handout'
                ? `${turn + 1}/${players}`
                : step === 'discuss'
                  ? `${players} players`
                  : nameOf(seat)}
            </Text>
          </View>

          {step === 'handout' && (
            <>
              <View style={styles.centre}>
                <Text style={styles.label}>Pass the device to</Text>
                <Text style={styles.big}>{nameOf(seat)}</Text>
                <Text style={styles.note}>
                  {isWord ? 'Everyone else, look away' : 'Crew see the word — the imposter bluffs'}
                </Text>
              </View>

              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Clue order</Text>
                {order.map((s) => (
                  <Text key={s} style={[styles.orderSeat, s === seat && styles.orderSeatNow]}>
                    {s}
                  </Text>
                ))}
              </View>
            </>
          )}

          {step === 'reveal' && (
            <View style={styles.centre}>
              {isImposter ? (
                <>
                  <View style={styles.imposterBadge}>
                    <Svg viewBox="0 0 24 24" width={30} height={30} fill="none">
                      <Path
                        d="M12 3.5l7.5 4.2v7.6L12 19.5 4.5 15.3V7.7L12 3.5Z"
                        stroke="#fff"
                        strokeWidth={1.9}
                        strokeLinejoin="round"
                      />
                      <Circle cx="9.3" cy="11" r="1.15" fill="#fff" />
                      <Circle cx="14.7" cy="11" r="1.15" fill="#fff" />
                    </Svg>
                  </View>
                  <Text style={styles.imposterTitle}>You are the imposter</Text>
                  {hintOn ? (
                    <>
                      <Text style={styles.label}>Your hint</Text>
                      <Text style={styles.hint}>{prompt.hint}</Text>
                      <Text style={styles.note}>You do not know the word. Bluff.</Text>
                    </>
                  ) : (
                    <Text style={styles.note}>No hint for you — improvise your clue.</Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.label}>The secret word is</Text>
                  <Text style={styles.word}>{prompt.word}</Text>
                  <Text style={styles.note}>
                    {clueLimit === 0
                      ? 'Free-form clue'
                      : clueLimit === 1
                        ? 'One-word clue'
                        : 'Two-word clue'}
                  </Text>
                </>
              )}
              <Text style={styles.foot}>Hide the screen before passing</Text>
            </View>
          )}

          {step === 'draw' && (
            <>
              <View style={styles.cardTop}>
                <Text style={styles.counter}>
                  {nameOf(seat)}
                  {!lastTurn ? ` → ${nameOf(order[(turn + 1) % players] ?? 1)}` : ''}
                </Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    round {lap}/{drawLaps}
                  </Text>
                </View>
              </View>
              <DrawingBoard
                nextLabel={lastTurn ? undefined : nameOf(order[(turn + 1) % players] ?? 1)}
                onDone={passPen}
              />
              <Text style={styles.foot}>Everyone adds to one picture · tap Done to pass</Text>
            </>
          )}

          {step === 'discuss' && (
            <View style={styles.centre}>
              <Text style={styles.label}>Clue order</Text>
              <View style={styles.seatGrid}>
                {order.map((s) => (
                  <View key={s} style={styles.seatTile}>
                    <Text style={styles.seatTileText} numberOfLines={1}>
                      {nameOf(s)}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.note}>
                Everyone has seen their {isWord ? 'card' : 'board'}. Give{' '}
                {clueLimit === 0 ? 'free-form' : `${clueLimit}-word`} clues in turn, then vote.
              </Text>
            </View>
          )}

          {step === 'result' && (
            <View style={styles.centre}>
              <Text style={styles.label}>
                {imposters === 1 ? 'The imposter was' : 'The imposters were'}
              </Text>
              <View style={styles.imposterRow}>
                {order
                  .filter((s) => imposterSeats.has(s))
                  .map((s) => (
                    <LinearGradient
                      key={s}
                      colors={PINK.gradient}
                      start={{ x: 0.2, y: 0 }}
                      end={{ x: 0.8, y: 1 }}
                      style={styles.imposterPill}
                    >
                      <Text style={styles.imposterPillText} numberOfLines={1}>
                        {nameOf(s)}
                      </Text>
                    </LinearGradient>
                  ))}
              </View>

              <View style={styles.divider} />

              {revealWord ? (
                <>
                  <Text style={styles.label}>The word was</Text>
                  <Text style={styles.word}>{prompt.word}</Text>
                </>
              ) : (
                <Text style={styles.note}>The word stays hidden — reveal was off in setup.</Text>
              )}
              <Text style={styles.note}>
                {domainName} · {players} players
              </Text>
            </View>
          )}
        </View>

        {/* ---- actions ---- */}
        <View style={styles.actions}>
          {step === 'handout' && (
            <Primary
              label="Tap to see your card"
              onPress={() => {
                // Deliberately silent: a card reveal is the quietest, tensest moment in the game,
                // and any sound here plays while the next player is meant to be looking away.
                setStep('reveal');
              }}
            />
          )}

          {step === 'reveal' && (
            <Primary
              label={
                lastCard
                  ? isWord
                    ? 'Pass · everyone is done'
                    : 'Everyone has a card · start drawing'
                  : `Pass to ${nameOf(order[(turn + 1) % players] ?? 1)}`
              }
              onPress={next}
            />
          )}

          {step === 'discuss' && (
            <Primary
              label="Reveal result"
              onPress={() => {
                setStep('result');
                playTone('vote');
              }}
            />
          )}

          {step === 'result' && (
            <>
              <Primary label="Play again" onPress={restart} />
              <View style={styles.ghostRow}>
                <Ghost label="Edit setup" onPress={goBack} />
                <Ghost label="Pick mode" onPress={() => router.push('/game-mode?path=local')} />
              </View>
            </>
          )}
        </View>
      </View>
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ pieces */

function Primary({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        playTone('tap');
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.primaryWrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={VIOLET.gradient}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.primary, { shadowColor: VIOLET.edge }]}
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

/* ------------------------------------------------------------------ helpers */

/** Fisher–Yates. Returns a new array; never mutates the input. */
function shuffle<T>(input: T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i]!;
    const b = out[j]!;
    out[i] = b;
    out[j] = a;
  }
  return out;
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
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.6, color: VIOLET.text },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 8,
  },
  modeBadge: {
    height: 44,
    width: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VIOLET.edge,
  },
  modeBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },

  /** flex: 1 — the card takes all the height the header and buttons leave. */
  card: {
    flex: 1,
    backgroundColor: 'rgba(18,10,38,0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    padding: spacing.s4,
    gap: 10,
    ...shadow.card,
  },
  cardImposter: {
    backgroundColor: 'rgba(42,10,30,0.95)',
    borderColor: 'rgba(244,114,182,0.35)',
  },

  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.45)',
    backgroundColor: 'rgba(124,58,237,0.30)',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8, color: '#FFFFFF' },
  counter: { fontSize: 13, fontWeight: '800', letterSpacing: 1, color: 'rgba(245,240,255,0.6)' },

  /** The band that grows: pushes content apart so the card has no hollow centre. */
  centre: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: 6 },

  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#C0B2DE',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  big: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 44,
    textAlign: 'center',
    textShadowColor: 'rgba(124,58,237,0.55)',
    textShadowRadius: 14,
  },
  word: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 46,
    textAlign: 'center',
    textShadowColor: 'rgba(124,58,237,0.75)',
    textShadowRadius: 20,
  },
  hint: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 240,
  },
  note: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(245,240,255,0.6)',
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 250,
  },
  foot: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: 'rgba(245,240,255,0.45)',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  imposterBadge: {
    height: 62,
    width: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PINK.shadow,
  },
  imposterTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: PINK.text,
    lineHeight: 29,
    textAlign: 'center',
  },

  orderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  orderLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: 'rgba(245,240,255,0.5)',
    textTransform: 'uppercase',
  },
  orderSeat: { fontSize: 13, fontWeight: '800', color: 'rgba(245,240,255,0.55)' },
  orderSeatNow: { color: '#FDE68A' },

  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 5 },
  seatTile: {
    minWidth: 56,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 7,
  },
  seatTileText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

  statRow: { flexDirection: 'row', gap: 6, alignSelf: 'stretch' },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 8,
  },
  statLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: 'rgba(245,240,255,0.55)' },
  statValue: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },

  imposterRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  imposterPill: { borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 7 },
  imposterPillText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },

  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 2,
  },

  actions: { gap: 8 },
  primaryWrap: { borderRadius: 16 },
  primary: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.96 },

  ghostRow: { flexDirection: 'row', gap: 8 },
  ghost: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 11,
  },
  ghostText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});
