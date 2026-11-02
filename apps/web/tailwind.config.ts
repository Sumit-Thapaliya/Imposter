import type { Config } from 'tailwindcss';

/**
 * Tailwind theme mapped 1:1 onto the design tokens in src/styles/tokens.css.
 * Mirror of apps/mobile/tailwind.config.js — same names, same values.
 *
 * Rule: never put a raw hex value in a className. Add it here, or use a token.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Preflight is OFF on purpose: globals.css already has a reset, and Tailwind's
  // preflight would re-style the art-directed start/loading screens that are
  // already verified. Turn it on only if you migrate those screens too.
  corePlugins: { preflight: false },
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

        // play-type card accents
        local: '#22C55E',
        'local-deep': '#12A150',
        'local-edge': '#0E7A3C',
        online: '#2F8BF5',
        'online-deep': '#1E6FD0',
        'online-edge': '#14508F',

        text: '#F5F0FF',
        'text-muted': '#A99BC9',
        'text-dim': '#7B6B9E',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px',
      },
      backgroundImage: {
        'card-local': 'linear-gradient(170deg, #4ADE80 0%, #22C55E 42%, #12A150 100%)',
        'card-online': 'linear-gradient(170deg, #65B8F8 0%, #2F8BF5 45%, #1E6FD0 100%)',
        sheen: 'linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0))',
      },
      boxShadow: {
        'card-local': '0 9px 0 #0E7A3C, 0 20px 44px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
        'card-local-hover': '0 12px 0 #0E7A3C, 0 26px 52px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.45)',
        'card-local-active': '0 5px 0 #0E7A3C, 0 10px 24px rgba(0,0,0,0.45)',
        'card-online': '0 9px 0 #14508F, 0 20px 44px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
        'card-online-hover': '0 12px 0 #14508F, 0 26px 52px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.45)',
        'card-online-active': '0 5px 0 #14508F, 0 10px 24px rgba(0,0,0,0.45)',
        card: '0 18px 44px rgba(0, 0, 0, 0.5)',
        float: '0 24px 60px rgba(0, 0, 0, 0.55)',
        'glow-violet': '0 0 60px rgba(139, 92, 246, 0.45)',
        'glow-gold': '0 0 34px rgba(251, 191, 36, 0.45)',
      },
      fontFamily: {
        display: ['Baloo 2', 'Fredoka', 'Trebuchet MS', 'system-ui', 'sans-serif'],
        body: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        micro: '0.66rem',
        label: '0.72rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        fast: '160ms',
        med: '320ms',
        slow: '700ms',
      },
      /**
       * Motion for the local play flow. Every consumer also pairs these with
       * `motion-reduce:animate-none` so the flow is still usable without motion.
       */
      keyframes: {
        'flip-in': {
          '0%': { opacity: '0', transform: 'perspective(900px) rotateY(-86deg) scale(0.88)' },
          '55%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'perspective(900px) rotateY(0deg) scale(1)' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '65%': { opacity: '1', transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'word-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.9)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(167,139,250,0.42)' },
          '50%': { boxShadow: '0 0 34px 6px rgba(167,139,250,0.30)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'flip-in': 'flip-in 620ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'rise-in': 'rise-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'word-in': 'word-in 520ms cubic-bezier(0.22, 1, 0.36, 1) 180ms both',
        'glow': 'glow 2.6s ease-in-out infinite',
        'drift': 'drift 5.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
