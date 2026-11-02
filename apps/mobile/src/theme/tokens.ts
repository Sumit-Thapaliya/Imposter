/**
 * Design tokens — mirrors apps/web/src/styles/tokens.css exactly.
 * Same names, same values: change one, change the other.
 */

export const colors = {
  void: '#0B0618',
  space: '#150A2E',
  deep: '#1E1038',
  panel: '#241543',
  panel2: '#2D1A52',
  line: '#3D2A6B',

  gold: '#FBBF24',
  gold2: '#F59E0B',
  goldDark: '#B07D06',
  goldSoft: '#FDE68A',

  violet: '#8B5CF6',
  violet2: '#6D28D9',
  magenta: '#D946EF',
  pink: '#EC4899',

  text: '#F5F0FF',
  textMuted: '#A99BC9',
  textDim: '#7B6B9E',
} as const;

export const spacing = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 24, s6: 32, s7: 48, s8: 64,
} as const;

export const radius = {
  sm: 10, md: 16, lg: 24, xl: 32, pill: 999,
} as const;

export const gradients = {
  gold: ['#FBBF24', '#F59E0B'] as const,
  goldPress: ['#F59E0B', '#D97706'] as const,
  progress: ['#7C3AED', '#D946EF', '#FBBF24'] as const,
  titleText: ['#FFFFFF', '#F3E8FF', '#C4B5FD', '#8B5CF6'] as const,
} as const;

export const shadow = {
  card: { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 22, shadowOffset: { width: 0, height: 14 }, elevation: 14 },
  float: { shadowColor: '#000', shadowOpacity: 0.55, shadowRadius: 30, shadowOffset: { width: 0, height: 18 }, elevation: 20 },
  goldGlow: { shadowColor: '#FBBF24', shadowOpacity: 0.5, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
} as const;

/** Font families — loaded in app/_layout.tsx once expo-font is added. */
export const fonts = {
  display: 'Baloo2_800ExtraBold',
  displayFallback: 'System',
  body: 'System',
} as const;

export const motion = { fast: 160, med: 320, slow: 700 } as const;
