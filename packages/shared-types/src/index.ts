/**
 * One entry point for the shared game configuration.
 *
 * Room settings are exported as a namespace (`room.DEFAULT_SETTINGS`) because local play
 * and online play both define a `ROUND_RANGE` and a `maxImpostersFor` with different
 * limits — 12 local seats vs 10 online columns. Namespacing keeps both honest instead of
 * renaming one and pretending they are the same knob.
 */

export * from './localConfig';
export * from './modes';
export * from './wordBank';
export * as room from './settings';
