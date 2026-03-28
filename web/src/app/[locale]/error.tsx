'use client';

import { useTranslations } from 'next-intl';

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="glass-panel mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center rounded-[32px] px-8 py-16 text-center">
      <h1 className="text-4xl font-semibold text-foreground">
        {t('errors.errorTitle')}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-muted">
        {t('errors.errorDescription')}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong"
      >
        {t('chat.retry')}
      </button>
    </div>
  );
}
