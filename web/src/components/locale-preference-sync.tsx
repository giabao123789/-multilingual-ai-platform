'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { LOCALE_STORAGE_KEY, type AppLocale } from '@/lib/constants';

export function LocalePreferenceSync() {
  const locale = useLocale() as AppLocale;

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  return null;
}
