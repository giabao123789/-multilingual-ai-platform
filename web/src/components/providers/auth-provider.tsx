'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  fetchCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '@/lib/api';
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
  type StoredSession,
} from '@/lib/session';
import type { AppUser, AuthResponse } from '@/types/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: AppUser | null;
  token: string | null;
  login: (payload: { email: string; password: string }) => Promise<AuthResponse>;
  register: (payload: {
    email: string;
    password: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      const storedSession = readStoredSession();

      if (!storedSession) {
        clearStoredSession();

        if (isMounted) {
          setSession(null);
          setStatus('unauthenticated');
        }

        return;
      }

      try {
        const user = await fetchCurrentUser(storedSession.token);
        const nextSession = {
          token: storedSession.token,
          user,
        };

        persistSession(nextSession);

        if (isMounted) {
          setSession(nextSession);
          setStatus('authenticated');
        }
      } catch {
        clearStoredSession();

        if (isMounted) {
          setSession(null);
          setStatus('unauthenticated');
        }
      }
    }

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      token: session?.token ?? null,
      login: async (payload) => {
        const response = await loginRequest(payload);
        const nextSession = {
          token: response.accessToken,
          user: response.user,
        };

        persistSession(nextSession);
        setSession(nextSession);
        setStatus('authenticated');

        return response;
      },
      register: async (payload) => {
        const response = await registerRequest(payload);
        const nextSession = {
          token: response.accessToken,
          user: response.user,
        };

        persistSession(nextSession);
        setSession(nextSession);
        setStatus('authenticated');

        return response;
      },
      logout: () => {
        clearStoredSession();
        setSession(null);
        setStatus('unauthenticated');
        router.replace('/login');
      },
    }),
    [router, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
