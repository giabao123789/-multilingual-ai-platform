import { getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/components/auth/register-form';

export default async function RegisterPage() {
  const t = await getTranslations();

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
      <div className="glass-panel mesh-panel rounded-[36px] px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          {t('auth.register')}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground">
          {t('auth.registerTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          {t('auth.registerDescription')}
        </p>
      </div>

      <div className="glass-panel rounded-[32px] p-6 sm:p-8">
        <RegisterForm />
      </div>
    </section>
  );
}
