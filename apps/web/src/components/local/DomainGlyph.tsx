'use client';

import type { DomainChoice } from '@/data/localConfig';

/**
 * Domain icons.
 *
 * Inline SVG on purpose — emoji glyphs depend on a system emoji font and render
 * as empty boxes on machines that lack one. These always look the same.
 */
export function DomainGlyph({ id, className = 'h-5 w-5' }: { id: DomainChoice; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (id) {
    case 'any':
      // a dice — "surprise me"
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="9" cy="9" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="15" cy="9" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="9" cy="15" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'food':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10.6V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.4" />
          <circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="12.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'animals':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <ellipse cx="12" cy="15.5" rx="6" ry="5" />
          <circle cx="5" cy="9" r="2.1" />
          <circle cx="9.5" cy="5.5" r="2.1" />
          <circle cx="14.5" cy="5.5" r="2.1" />
          <circle cx="19" cy="9" r="2.1" />
        </svg>
      );
    case 'places':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
      );
    case 'movies':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2.4" />
          <path d="M3 11.5h18M7.5 7 10 11.5M13 7l2.5 4.5M18 7l2 3.6" />
        </svg>
      );
    case 'objects':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <path d="M12 3.5 20 8v8l-8 4.5L4 16V8Z" />
          <path d="M4 8l8 4.5L20 8M12 12.5v8" />
        </svg>
      );
    case 'sports':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5c3 3.2 3 13.3 0 17M3.5 12h17" />
          <path d="M6.2 6.4c3.6 1.4 8 1.4 11.6 0M6.2 17.6c3.6-1.4 8-1.4 11.6 0" />
        </svg>
      );
    default:
      return null;
  }
}
