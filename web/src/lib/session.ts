import type { AppUser } from '@/types/api';
import { AUTH_SESSION_COOKIE, SESSION_STORAGE_KEY } from './constants';

export interface StoredSession {
  token: string;
  user: AppUser;
}

export function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function persistSession(session: StoredSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  document.cookie = `${AUTH_SESSION_COOKIE}=1; path=/; max-age=604800; samesite=lax`;
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
