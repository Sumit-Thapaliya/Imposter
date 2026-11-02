/**
 * Start-screen character manifest.
 *
 * Three characters, each with a DIFFERENT gesture so the stage never looks
 * like the same character copied three times.
 *
 * The full 27-character roster: see assets/characters/roster/manifest.json
 * Components read from here — never hardcode a filename.
 */

export type StartCharacter = {
  id: string;
  name: string;
  /** shown under the character on the stage */
  caption: string;
  /** full-body art (WebP preferred, PNG fallback) */
  src: string;
  srcFallback: string;
  /** 192px head crop for the loading tiles */
  thumb: string;
  alt: string;
  order: number;
};

export const START_CHARACTERS: StartCharacter[] = [
  {
    id: 'pose-a-pointing',
    name: 'Red',
    caption: 'Pointing up',
    src: '/characters/start/pose-a-pointing-640.webp',
    srcFallback: '/characters/start/pose-a-pointing-cut.png',
    thumb: '/characters/start/pose-a-pointing.webp',
    alt: 'Red hooded character with glowing white eyes pointing one finger upward',
    order: 0,
  },
  {
    id: 'pose-b-waving',
    name: 'Cyan',
    caption: 'Waving hello',
    src: '/characters/start/pose-b-waving-640.webp',
    srcFallback: '/characters/start/pose-b-waving-cut.png',
    thumb: '/characters/start/pose-b-waving.webp',
    alt: 'Cyan hooded character with glowing blue eyes waving one hand',
    order: 1,
  },
  {
    id: 'pose-c-shrug',
    name: 'Cosmic',
    caption: 'Shrugging',
    src: '/characters/start/pose-c-shrug-640.webp',
    srcFallback: '/characters/start/pose-c-shrug-cut.png',
    thumb: '/characters/start/pose-c-shrug.webp',
    alt: 'Galaxy-textured hooded character shrugging with both palms up',
    order: 2,
  },
];

export const STAGE_CHARACTERS = [...START_CHARACTERS].sort((a, b) => a.order - b.order);

export const BACKGROUNDS = {
  landscape: '/backgrounds/fantasy-party-1920.jpg',
  portrait: '/backgrounds/fantasy-party-portrait-1080.jpg',
};

/** Everything the loading screen resolves before revealing the start screen. */
export const PRELOAD_IMAGES: string[] = [
  BACKGROUNDS.portrait,
  ...START_CHARACTERS.map((c) => c.src),
  ...START_CHARACTERS.map((c) => c.thumb),
];
