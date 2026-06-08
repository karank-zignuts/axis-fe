'use client';

import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'axis-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Theme | null;
    if (stored) {
      setTheme(stored);
      return;
    }

    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((value) => (value === 'dark' ? 'light' : 'dark')), []);

  return { theme, setTheme, toggle };
}
