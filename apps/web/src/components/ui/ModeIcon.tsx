import type { JSX } from 'react';
'use client';

/**
 * The two mode illustrations, shared by the game-mode cards and the local setup
 * screen. Pure inline SVG — no network, no external assets.
 */

export function WordArt(): JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-full w-auto drop-shadow-[0_4px_6px_rgba(0,0,0,0.32)]"
      aria-hidden="true"
    >
      <path
        d="M8 17a8 8 0 0 1 8-8h15a8 8 0 0 1 8 8v7a8 8 0 0 1-8 8H21l-8 7v-7.4A8 8 0 0 1 8 24Z"
        fill="#FFFFFF"
        stroke="#3B0764"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="21" r="2.4" fill="#7C3AED" />
      <circle cx="24" cy="21" r="2.4" fill="#7C3AED" />
      <circle cx="31" cy="21" r="2.4" fill="#7C3AED" />
      <path
        d="M28 34h20a8 8 0 0 1 8 8v5a8 8 0 0 1-8 8h-3l-7 6v-6h-10a8 8 0 0 1-8-8v-5a8 8 0 0 1 8-8Z"
        fill="#E9D5FF"
        stroke="#3B0764"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="44" r="2.2" fill="#6D28D9" />
      <circle cx="45" cy="44" r="2.2" fill="#6D28D9" />
      <circle cx="52" cy="44" r="2.2" fill="#6D28D9" />
    </svg>
  );
}

export function DrawingArt(): JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-full w-auto drop-shadow-[0_4px_6px_rgba(0,0,0,0.32)]"
      aria-hidden="true"
    >
      <path
        d="M32 8c13 0 23 8.4 23 19 0 6.6-5.2 9.8-10.4 9.8h-3.2c-3.4 0-5.6 2.3-5.6 5.4 0 1.4.6 2.6 1.2 3.8.7 1.3 1.2 2.5 1.2 3.8 0 3.4-2.8 5.2-6.2 5.2C18.4 55 9 45.2 9 31.8 9 18.2 19.4 8 32 8Z"
        fill="#FFF7ED"
        stroke="#7C2D12"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="22" r="4.2" fill="#EF4444" />
      <circle cx="34" cy="17.5" r="4.2" fill="#FBBF24" />
      <circle cx="45" cy="24" r="4.2" fill="#22C55E" />
      <circle cx="47" cy="36" r="4.2" fill="#3B82F6" />
      <circle cx="21" cy="34" r="4.2" fill="#A855F7" />
      <path
        d="M47 47c6-3 10-8 11-14"
        stroke="#7C2D12"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
