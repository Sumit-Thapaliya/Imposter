/**
 * Start-screen character manifest (mobile).
 * Mirrors apps/web/src/data/characters.ts — same ids, same order, same gestures.
 */

export type StartCharacter = {
  id: string;
  name: string;
  caption: string;
  /** full-body transparent art */
  source: number;
  /** 192px head crop for loading tiles */
  thumb: number;
  order: number;
  /** entry tilt in degrees */
  tilt: number;
};

export const START_CHARACTERS: StartCharacter[] = [
  {
    id: 'pose-a-pointing',
    name: 'Red',
    caption: 'Pointing up',
    source: require('../../assets/characters/start/pose-a-pointing-cut.png'),
    thumb: require('../../assets/characters/start/pose-a-pointing.png'),
    order: 0,
    tilt: -3,
  },
  {
    id: 'pose-b-waving',
    name: 'Cyan',
    caption: 'Waving hello',
    source: require('../../assets/characters/start/pose-b-waving-cut.png'),
    thumb: require('../../assets/characters/start/pose-b-waving.png'),
    order: 1,
    tilt: 0,
  },
  {
    id: 'pose-c-shrug',
    name: 'Cosmic',
    caption: 'Shrugging',
    source: require('../../assets/characters/start/pose-c-shrug-cut.png'),
    thumb: require('../../assets/characters/start/pose-c-shrug.png'),
    order: 2,
    tilt: 3,
  },
];

export const STAGE_CHARACTERS = [...START_CHARACTERS].sort((a, b) => a.order - b.order);

export const BACKGROUNDS = {
  portrait: require('../../assets/backgrounds/fantasy-party-portrait-720.jpg'),
  landscape: require('../../assets/backgrounds/fantasy-party-landscape-1280.jpg'),
};
