'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { getErrorMessage } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      await login({ email, password });
      router.replace('/chat');
    } catch (submissionError) {
      setError(getErrorMessage(submissionError, t('errors.generic')));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-foreground"
        >
          {t('auth.email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-line bg-background/90 px-4 py-3 text-base text-foreground outline-none transition focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-foreground"
        >
          {t('auth.password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          className="w-full rounded-2xl border border-line bg-background/90 px-4 py-3 text-base text-foreground outline-none transition focus:border-accent"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? t('chat.thinking') : t('auth.submitLogin')}
      </button>

      <p className="text-sm text-muted">
        {t('auth.switchToRegister')}{' '}
        <Link href="/register" className="font-semibold text-accent">
          {t('auth.register')}
        </Link>
      </p>
    </form>
  );
}
