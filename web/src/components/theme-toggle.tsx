'use client';

import { useTranslations } from 'next-intl';
import { THEME_STORAGE_KEY } from '@/lib/constants';

export function ThemeToggle() {
  const t = useTranslations('nav');

  return (
    <button
      type="button"
      onClick={() => {
        const currentTheme =
          document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      }}
      className="rounded-full border border-line bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
      aria-label={t('theme')}
    >
      {t('theme')}
    </button>
  );
}
