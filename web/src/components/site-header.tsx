'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { APP_NAME } from '@/lib/constants';
import { LocaleSwitcher } from './locale-switcher';
import { useAuth } from './providers/auth-provider';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { status, user, logout } = useAuth();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-white shadow-[0_18px_36px_rgba(15,118,110,0.28)]">
            AI
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {APP_NAME}
            </p>
            <p className="truncate text-sm text-muted">{t('app.tagline')}</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <LocaleSwitcher />
          <ThemeToggle />

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === '/'
                  ? 'bg-accent-soft text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/chat"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname.startsWith('/chat')
                  ? 'bg-accent-soft text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {t('nav.chat')}
            </Link>
          </nav>

          {isAuthenticated && user ? (
            <>
              <div className="hidden rounded-full border border-line bg-card px-4 py-2 text-sm text-muted lg:block">
                <span className="font-medium text-foreground">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-line bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-line bg-background/80 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
