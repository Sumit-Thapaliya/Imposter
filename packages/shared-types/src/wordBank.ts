/** Shared word selection. Pick one entry once per round and keep its word and hint together. */
import { DOMAINS, DOMAIN_IDS, FALLBACK_DOMAIN, type DomainId, type DomainChoice } from './localConfig';
import { WORD_BANK } from './wordBankData';
export { WORD_BANK } from './wordBankData';
export type { WordEntry } from './wordBankData';

export type WordPrompt = { word: string; hint: string; domain: DomainId };

/** Any chooses a category uniformly, then a word from that category. */
export function selectWord(choice: DomainChoice | string, random: () => number = Math.random, previousWord?: string | null): WordPrompt {
  const index = (length: number) => Math.max(0, Math.min(length - 1, Math.floor(random() * length)));
  const domain: DomainId = choice === 'any'
    ? DOMAIN_IDS[index(DOMAIN_IDS.length)]!
    : (DOMAIN_IDS as readonly string[]).includes(choice) ? choice as DomainId : FALLBACK_DOMAIN.id;
  const bank = WORD_BANK[domain];
  // Avoid an immediate repeat without changing the random distribution of other entries.
  const eligible = previousWord ? bank.filter(entry => entry.word !== previousWord) : bank;
  const selected = eligible[index(eligible.length)]!;
  return { domain, word: selected.word, hint: selected.hint };
}

export function domainLabel(domain: DomainId): string {
  return (DOMAINS.find(item => item.id === domain) ?? FALLBACK_DOMAIN).label;
}
