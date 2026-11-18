import { useCallback, useRef, useState } from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACKGROUNDS } from '@/data/characters';
import { colors, radius, shadow, spacing } from '@/theme/tokens';

/**
 * Screen furniture for the app — the native twin of `ui/ScreenShell` + `ui/ScreenHeader`
 * on web.
 *
 * The back button is deliberately identical in behaviour to the web one: same 44×44
 * target, same top-left position, same place on every screen. It is laid out in the flow
 * rather than absolutely positioned, which is the one place native and web legitimately
 * differ — safe-area insets mean the "same" pixel offset is not the same visual position.
 */

export function ScreenShell({
  children,
  backdrop = 'portrait',
}: {
  children: React.ReactNode;
  backdrop?: 'portrait' | 'landscape';
}) {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={BACKGROUNDS[backdrop]}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(11,6,24,0.45)', 'rgba(11,6,24,0.86)', 'rgba(11,6,24,0.97)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {children}
      </SafeAreaView>
    </View>
  );
}

export function BackButton({ onPress, label = 'Go back' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
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
  );
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  badge,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  badge?: { label: string; tone: 'local' | 'online' } | undefined;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {onBack ? <BackButton onPress={onBack} /> : <View style={styles.backSpacer} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.badgeSlot}>
        {badge ? (
          <View style={[styles.badge, badge.tone === 'local' ? styles.badgeLocal : styles.badgeOnline]}>
            <Text
              style={[
                styles.badgeText,
                { color: badge.tone === 'local' ? '#4ADE80' : '#65B8F8' },
              ]}
            >
              {badge.label}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/**
 * One of the two big choice cards (Local / Online, Word / Drawing).
 *
 * Press feedback is a real `Animated` scale rather than a style swap: on a phone the
 * press has to be felt before the next screen appears, and a colour change alone reads as
 * a lag.
 */
export function ChoiceCard({
  title,
  subtitle,
  accent,
  glyph,
  onPress,
}: {
  title: string;
  subtitle: string;
  accent: 'local' | 'online' | 'violet' | 'orange';
  glyph: React.ReactNode;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = useCallback(
    (to: number) =>
      Animated.spring(scale, {
        toValue: to,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }).start(),
    [scale],
  );

  const [top, bottom, edge] = CARD_COLOURS[accent] ?? CARD_COLOURS.violet!;

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animate(0.97)}
        onPressOut={() => animate(1)}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={[styles.cardEdge, { backgroundColor: edge }]}>
          <LinearGradient
            colors={[top, bottom]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.cardFace}
          >
            <View style={styles.cardGlyph}>{glyph}</View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/** Each card keeps its own colour — Local green, Online blue, Word violet, Drawing orange. */
const CARD_COLOURS: Record<'local' | 'online' | 'violet' | 'orange', [string, string, string]> = {
  local: ['#22C55E', '#15803D', '#0B4D26'],
  online: ['#3B82F6', '#1D4ED8', '#122E6B'],
  violet: ['#A78BFA', '#7C3AED', '#4C1D95'],
  orange: ['#FB923C', '#EA580C', '#7C2D12'],
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  safe: { flex: 1, paddingHorizontal: spacing.s4, paddingVertical: spacing.s3 },

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
  backPressed: { transform: [{ translateX: -2 }] },
  backSpacer: { height: 44, width: 44 },

  header: { alignItems: 'center', gap: 2 },
  headerRow: { flexDirection: 'row', alignSelf: 'stretch' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(245,240,255,0.84)',
    textAlign: 'center',
  },
  badgeSlot: { height: 26, alignItems: 'center', justifyContent: 'center' },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeLocal: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.45)' },
  badgeOnline: { backgroundColor: 'rgba(47,139,245,0.15)', borderColor: 'rgba(47,139,245,0.45)' },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },

  cardWrap: { width: '100%' },
  cardEdge: { borderRadius: radius.lg, paddingBottom: 5, ...shadow.card },
  cardFace: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s4,
    minHeight: 150,
    justifyContent: 'center',
    gap: 4,
  },
  cardGlyph: { marginBottom: 6 },
  cardTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  cardSubtitle: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
});
