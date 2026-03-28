'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALE_STORAGE_KEY, type AppLocale } from '@/lib/constants';

const localeOptions: Array<{
  locale: AppLocale;
  label: string;
}> = [
  { locale: 'vi', label: '🇻🇳 VI' },
  { locale: 'en', label: '🇺🇸 EN' },
];

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  return (
    <div
      className="flex items-center gap-2 rounded-full border border-line bg-background/80 p-1"
      aria-label={t('switch')}
    >
      {localeOptions.map((option) => {
        const isActive = option.locale === locale;

        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => {
              window.localStorage.setItem(LOCALE_STORAGE_KEY, option.locale);
              document.cookie = `NEXT_LOCALE=${option.locale}; path=/; max-age=31536000; samesite=lax`;
              router.replace(pathname, { locale: option.locale });
            }}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-accent text-white shadow-[0_12px_30px_rgba(15,118,110,0.28)]'
                : 'text-muted hover:text-foreground'
            }`}
            aria-label={option.locale === 'vi' ? t('vi') : t('en')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
