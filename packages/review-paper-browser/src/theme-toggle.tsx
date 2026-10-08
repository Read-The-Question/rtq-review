'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'rtq-color-theme:v1';
const THEME_ORDER = ['system', 'light', 'dark'] as const;

type Theme = (typeof THEME_ORDER)[number];

function isTheme(value: string | null): value is Theme {
  return THEME_ORDER.some((theme) => theme === value);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === 'light') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
    );
  }

  if (theme === 'dark') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="12" rx="2" width="18" x="3" y="4" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    let storedTheme: string | null = null;
    try {
      storedTheme = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Keep the system setting when storage is unavailable.
    }

    const initialTheme = isTheme(storedTheme) ? storedTheme : 'system';
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const syncTheme = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const nextTheme = isTheme(event.newValue) ? event.newValue : 'system';
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const nextTheme =
    THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
  const currentLabel = `${theme[0].toUpperCase()}${theme.slice(1)}`;
  const nextLabel = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)}`;

  return (
    <button
      aria-label={`Theme: ${currentLabel}. Switch to ${nextLabel}.`}
      className="theme-toggle"
      onClick={() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
        try {
          window.localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
          // The selected theme still applies for the current page.
        }
      }}
      title={`Theme: ${currentLabel} · click for ${nextLabel}`}
      type="button"
    >
      <ThemeIcon theme={theme} />
      <span>{currentLabel}</span>
    </button>
  );
}
