import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LocalePreferenceSync } from '@/components/locale-preference-sync';
import { SiteHeader } from '@/components/site-header';
import { AuthProvider } from '@/components/providers/auth-provider';
import { routing } from '@/i18n/routing';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: 'meta',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        en: '/en',
        vi: '/vi',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <LocalePreferenceSync />
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(circle_at_top_left,rgba(194,65,12,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_38%)]" />
          <SiteHeader />
          <main className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
