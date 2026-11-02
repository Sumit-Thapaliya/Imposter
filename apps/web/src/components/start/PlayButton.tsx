'use client';

import styles from './PlayButton.module.css';

type Props = {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  reveal?: number;
};

/**
 * Primary gold CTA. Full width on phones, fixed max-width on desktop.
 * The arrow nudges on hover — the only motion, so it stays calm.
 */
export function PlayButton({ onClick, label = 'Get Started', disabled = false, reveal = 1 }: Props) {
  return (
    <div
      className={styles.wrap}
      style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 22}px)` }}
    >
      <button
        type="button"
        className={`btn ${styles.button}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={styles.label}>{label}</span>
        <svg
          className={styles.arrow}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12h15M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
