/**
 * Secret words and imposter hints — shared by web, mobile and the server.
 *
 * The server used to keep its own copy of these strings; both now read this file,
 * so a word change cannot drift between online and local play.
 */

/**
 * Placeholder secret words.
 *
 * One fixed word per domain — the real word bank is still to come. Everything
 * downstream reads `wordFor(domain)` so swapping this for a proper bank later is
 * a single-file change.
 *
 * Deliberately NOT "game logic": no scoring, no randomness, no win conditions.
 */

import { DOMAINS, FALLBACK_DOMAIN, type DomainId } from './localConfig';

export const DEFAULT_WORDS: Record<DomainId, string> = {
  food: 'Sushi',
  animals: 'Panda',
  places: 'Paris',
  movies: 'Titanic',
  objects: 'Umbrella',
  sports: 'Cricket',
};

/** The secret word for a domain. Always returns something. */
export function wordFor(domain: DomainId): string {
  return DEFAULT_WORDS[domain] ?? DEFAULT_WORDS[FALLBACK_DOMAIN.id];
}

/**
 * The imposter's hint — a *category*, never the word itself.
 *
 * The domain's `sample` list is deliberately NOT used here: it contains the secret
 * word (Food's sample is "Sushi · Tacos · Pizza", and Sushi is the food word), so
 * showing it handed the imposter the answer.
 */
export const DOMAIN_HINTS: Record<DomainId, string> = {
  food: 'Something you eat — dishes and snacks',
  animals: 'A living creature — wild or tame',
  places: 'Somewhere you can travel to',
  movies: 'A film people have watched',
  objects: 'A thing you can hold or use',
  sports: 'A game people play to win',
};

export function hintFor(domain: DomainId): string {
  return DOMAIN_HINTS[domain] ?? DOMAIN_HINTS[FALLBACK_DOMAIN.id];
}

/** A short label like "Food" / "Animals" for chips. */
export function domainLabel(domain: DomainId): string {
  return (DOMAINS.find((item) => item.id === domain) ?? FALLBACK_DOMAIN).label;
}
