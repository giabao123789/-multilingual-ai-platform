export const APP_NAME = 'Lingua AI Studio';
export const AUTH_SESSION_COOKIE = 'lingua_ai_session';
export const SESSION_STORAGE_KEY = 'lingua_ai_session_payload';
export const LOCALE_STORAGE_KEY = 'lingua_ai_locale';
export const THEME_STORAGE_KEY = 'lingua_ai_theme';
export const LOCALES = ['en', 'vi'] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale =
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE === 'en' ? 'en' : 'vi';
