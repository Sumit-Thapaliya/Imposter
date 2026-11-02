/** @type {import('tailwindcss').Config} */
/**
 * NativeWind theme — mirrors apps/web/tailwind.config.ts and src/theme/tokens.ts.
 * Same names, same values. Change one, change all three.
 */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        void: '#0B0618',
        space: '#150A2E',
        deep: '#1E1038',
        panel: '#241543',
        'panel-2': '#2D1A52',
        line: '#3D2A6B',

        gold: '#FBBF24',
        'gold-2': '#F59E0B',
        'gold-dark': '#B07D06',
        'gold-soft': '#FDE68A',

        violet: '#8B5CF6',
        'violet-2': '#6D28D9',
        magenta: '#D946EF',
        pink: '#EC4899',

        text: '#F5F0FF',
        'text-muted': '#A99BC9',
        'text-dim': '#7B6B9E',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
