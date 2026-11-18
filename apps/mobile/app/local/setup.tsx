import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { ScreenShell } from '@/components/ui/Screen';
import { colors, radius, shadow, spacing } from '@/theme/tokens';
import {
  CLUE_LIMITS,
  CLUE_TIMERS,
  DEFAULT_CONFIG,
  DIFFICULTIES,
  DISCUSSION_TIMERS,
  DOMAIN_CHOICES,
  DRAW_RANGE,
  PLAYER_RANGE,
  PRESET_PATCH,
  TIE_RULES,
  VOTING,
  maxImpostersFor,
  normalise,
  type DifficultyId,
  type LocalConfig,
} from '@shared/game';

/**
 * Local setup — the app's version of the web form.
 *
 * Same three tabs, same presets, same limits, because everything comes from
 * `@shared/game`. What differs is presentation only: a phone has no room for a full
 * desktop grid, so the sections scroll inside one container and the CTA is pinned.
 *
 * Not done yet: the setup hands off to `/local/play`, which does not exist in the app.
 */

type Tab = 'table' | 'round' | 'rules';

const TABS: { id: Tab; label: string }[] = [
  { id: 'table', label: 'Table' },
  { id: 'round', label: 'Round' },
  { id: 'rules', label: 'Rules' },
];

export default function LocalSetupScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isWord = mode !== 'drawing';

  const [tab, setTab] = useState<Tab>('table');
  const [config, setConfig] = useState<LocalConfig>(DEFAULT_CONFIG);

  const accent = isWord ? VIOLET : ORANGE;
  const update = (patch: Partial<LocalConfig>) =>
    setConfig((current) => normalise({ ...current, ...patch }));

  /** A preset rewrites the switch block; individual keys stay editable afterwards. */
  const applyPreset = (id: DifficultyId) =>
    setConfig((current) => normalise({ ...current, ...PRESET_PATCH[id], difficulty: id }));

  const imposterCeiling = maxImpostersFor(config.players);
  const domainLabels = useMemo(
    () => DOMAIN_CHOICES.map((item) => item.label).join(' · '),
    [],
  );

  return (
    <ScreenShell backdrop="portrait">
      <View style={styles.body}>
        {/* header row — back, title, mode badge */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.push('/game-mode?path=local')}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            style={({ pressed }) => [styles.back, pressed && { transform: [{ translateX: -2 }] }]}
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
            <Text style={styles.title}>{isWord ? 'Word Mode' : 'Drawing Mode'}</Text>
            <Text style={styles.subtitle}>
              Local · {config.players}p / {config.imposters}i
            </Text>
          </View>

          <View style={[styles.modeBadge, { backgroundColor: accent.edge }]}>
            <Text style={styles.modeBadgeText}>{isWord ? 'W' : 'D'}</Text>
          </View>
        </View>

        {/* tabs */}
        <View style={styles.tabs}>
          {TABS.map((item) => {
            const active = item.id === tab;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTab(item.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={styles.tab}
              >
                {active ? (
                  <LinearGradient
                    colors={accent.gradient}
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    style={styles.tabActive}
                  >
                    <Text style={styles.tabLabelActive}>{item.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabIdle}>
                    <Text style={styles.tabLabel}>{item.label}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* one scroll container — no nested panes, same rule as web */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tab === 'table' && (
            <>
              <Panel title="Difficulty" hint="applies a preset">
                <View style={styles.segment}>
                  {DIFFICULTIES.map((item) => {
                    const active = item.id === config.difficulty;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => applyPreset(item.id)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={styles.segmentItem}
                      >
                        {active ? (
                          <LinearGradient
                            colors={accent.gradient}
                            start={{ x: 0.2, y: 0 }}
                            end={{ x: 0.8, y: 1 }}
                            style={styles.segmentActive}
                          >
                            <Text style={styles.segmentLabelActive}>{item.label}</Text>
                            <Text style={styles.segmentNoteActive}>{item.note}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.segmentIdle}>
                            <Text style={styles.segmentLabel}>{item.label}</Text>
                            <Text style={styles.segmentNote}>{item.note}</Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </Panel>

              <Panel title="Table" hint={`max ${imposterCeiling} imposters`}>
                <Stepper
                  label="Players"
                  value={config.players}
                  min={PLAYER_RANGE.min}
                  max={PLAYER_RANGE.max}
                  onChange={(players) => update({ players })}
                  accent={accent}
                />
                <Divider />
                <Stepper
                  label="Imposters"
                  value={config.imposters}
                  min={1}
                  max={imposterCeiling}
                  onChange={(imposters) => update({ imposters })}
                  accent={accent}
                />
              </Panel>
            </>
          )}

          {tab === 'round' && (
            <>
              <Panel title="Rounds">
                <Stepper
                  label="Rounds"
                  value={config.rounds}
                  min={1}
                  max={5}
                  onChange={(rounds) => update({ rounds })}
                  accent={accent}
                />
                {!isWord && (
                  <>
                    <Divider />
                    <Stepper
                      label="Drawings each"
                      value={config.drawsPerTurn}
                      min={DRAW_RANGE.min}
                      max={DRAW_RANGE.max}
                      onChange={(drawsPerTurn) => update({ drawsPerTurn })}
                      accent={accent}
                    />
                  </>
                )}
              </Panel>

              <Panel title="Clocks">
                <Chips
                  label="Clue timer"
                  options={CLUE_TIMERS.map((t) => ({ id: String(t.id), label: t.label }))}
                  value={String(config.clueTimer)}
                  onChange={(id) => update({ clueTimer: Number(id) as LocalConfig['clueTimer'] })}
                  accent={accent}
                />
                <Divider />
                <Chips
                  label="Discussion timer"
                  options={DISCUSSION_TIMERS.map((t) => ({ id: String(t.id), label: t.label }))}
                  value={String(config.discussionTimer)}
                  onChange={(id) =>
                    update({ discussionTimer: Number(id) as LocalConfig['discussionTimer'] })
                  }
                  accent={accent}
                />
                <Divider />
                <Chips
                  label="Clue length"
                  options={CLUE_LIMITS.map((c) => ({ id: String(c.id), label: c.label }))}
                  value={String(config.clueLimit)}
                  onChange={(id) => update({ clueLimit: Number(id) as LocalConfig['clueLimit'] })}
                  accent={accent}
                />
              </Panel>

              <Panel title="Category">
                <Text style={styles.domainList}>{domainLabels}</Text>
                <Chips
                  label="Chosen"
                  options={DOMAIN_CHOICES.map((d) => ({ id: d.id, label: d.label }))}
                  value={config.domain}
                  onChange={(domain) => update({ domain: domain as LocalConfig['domain'] })}
                  accent={accent}
                />
              </Panel>
            </>
          )}

          {tab === 'rules' && (
            <>
              <Panel title="Voting">
                <Chips
                  label="Method"
                  options={VOTING.map((v) => ({ id: v.id, label: v.label }))}
                  value={config.voting}
                  onChange={(voting) => update({ voting: voting as LocalConfig['voting'] })}
                  accent={accent}
                />
                <Divider />
                <Chips
                  label="On a tie"
                  options={TIE_RULES.map((t) => ({ id: t.id, label: t.label }))}
                  value={config.tieRule}
                  onChange={(tieRule) => update({ tieRule: tieRule as LocalConfig['tieRule'] })}
                  accent={accent}
                />
              </Panel>

              <Panel title="Switches">
                <Toggle
                  label="Hint for the imposter"
                  note="gives the category, never the word"
                  value={config.hints}
                  onChange={(hints) => update({ hints })}
                />
                <Divider />
                <Toggle
                  label="Reveal word at the end"
                  value={config.revealWord}
                  onChange={(revealWord) => update({ revealWord })}
                />
                <Divider />
                <Toggle
                  label="Random first turn"
                  value={config.randomFirst}
                  onChange={(randomFirst) => update({ randomFirst })}
                />
              </Panel>
            </>
          )}
        </ScrollView>

        <Pressable onPress={start} accessibilityRole="button" accessibilityLabel="Start game">
          <LinearGradient
            colors={accent.gradient}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Start game</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ScreenShell>
  );

  /** Hands off to the play screen, which the app does not have yet. */
  function start() {
    Alert.alert('Coming soon', 'Local gameplay is not available in the mobile app yet.');
  }
}

/* ------------------------------------------------------------------ pieces */

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHead}>
        <Text style={styles.panelTitle}>{title}</Text>
        {hint ? <Text style={styles.panelHint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  accent: Accent;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          style={({ pressed }) => [
            styles.stepBtn,
            value <= min && styles.stepDisabled,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.stepGlyph}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          style={({ pressed }) => [
            styles.stepBtn,
            value >= max && styles.stepDisabled,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.stepGlyph, { color: accent.text }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Chips({
  label,
  options,
  value,
  onChange,
  accent,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  accent: Accent;
}) {
  return (
    <View style={styles.chipBlock}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const active = option.id === value;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.chip,
                active && { backgroundColor: accent.edge, borderColor: accent.text },
              ]}
            >
              <Text style={[styles.chipText, active && { color: '#FFFFFF' }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Toggle({
  label,
  note,
  value,
  onChange,
}: {
  label: string;
  note?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.toggleText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {note ? <Text style={styles.rowNote}>{note}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: '#3D2A6B', true: VIOLET.edge }}
        thumbColor={value ? VIOLET.text : '#A99BC9'}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ palette */

type Accent = { gradient: [string, string]; edge: string; text: string };

const VIOLET: Accent = { gradient: ['#A78BFA', '#7C3AED'], edge: '#4C1D95', text: '#C4B5FD' };
const ORANGE: Accent = { gradient: ['#FB923C', '#EA580C'], edge: '#7C2D12', text: '#FDBA74' };

const styles = StyleSheet.create({
  body: { flex: 1, gap: 10 },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: {
    height: 44,
    width: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,6,24,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.4)',
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 12, fontWeight: '600', color: 'rgba(245,240,255,0.8)' },
  modeBadge: {
    height: 44,
    width: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },

  tabs: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(11,6,24,0.8)',
    borderRadius: radius.sm,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tab: { flex: 1 },
  tabActive: { borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  tabIdle: { borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  tabLabelActive: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, letterSpacing: 0.6 },
  tabLabel: { color: '#A99BC9', fontWeight: '800', fontSize: 13, letterSpacing: 0.6 },

  scroll: { flex: 1 },
  scrollContent: { gap: 8, paddingBottom: 8 },

  panel: {
    backgroundColor: 'rgba(18,10,38,0.95)',
    borderRadius: radius.md,
    padding: spacing.s3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    gap: 8,
    ...shadow.card,
  },
  panelHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: '#C4B5FD' },
  panelHint: { fontSize: 10, fontWeight: '700', color: 'rgba(245,240,255,0.45)' },

  segment: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(11,6,24,0.6)',
    borderRadius: radius.sm,
    padding: 4,
  },
  segmentItem: { flex: 1 },
  segmentActive: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 4, alignItems: 'center' },
  segmentIdle: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 4, alignItems: 'center' },
  segmentLabelActive: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  segmentLabel: { fontSize: 12, fontWeight: '800', color: '#A99BC9' },
  segmentNoteActive: { fontSize: 9, fontWeight: '600', color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  segmentNote: { fontSize: 9, fontWeight: '600', color: 'rgba(169,155,201,0.8)', textAlign: 'center' },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  rowLabel: { fontSize: 14, fontWeight: '700', color: '#F5F0FF', flexShrink: 1 },
  rowNote: { fontSize: 10, fontWeight: '600', color: 'rgba(245,240,255,0.5)' },
  toggleText: { flex: 1, gap: 1 },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  stepDisabled: { opacity: 0.35 },
  stepGlyph: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', lineHeight: 22 },
  stepValue: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },

  chipBlock: { gap: 5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipText: { fontSize: 11, fontWeight: '800', color: '#C9BCE6', letterSpacing: 0.3 },

  domainList: { fontSize: 11, fontWeight: '600', color: 'rgba(245,240,255,0.5)' },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.10)' },

  cta: { borderRadius: 15, paddingVertical: 14, alignItems: 'center' },
  ctaText: { fontSize: 15, fontWeight: '800', letterSpacing: 1.4, color: '#FFFFFF' },
});
