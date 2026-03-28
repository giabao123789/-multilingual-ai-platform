import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function LocaleNotFound() {
  const t = await getTranslations();

  return (
    <div className="glass-panel mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center rounded-[32px] px-8 py-16 text-center">
      <h1 className="text-4xl font-semibold text-foreground">
        {t('errors.notFoundTitle')}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-muted">
        {t('errors.notFoundDescription')}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong"
      >
        {t('errors.backHome')}
      </Link>
    </div>
  );
}
