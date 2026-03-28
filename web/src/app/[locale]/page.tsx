import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function LocaleHomePage() {
  const t = await getTranslations();
  const featureCards = [
    {
      title: t('home.featureOneTitle'),
      description: t('home.featureOneDescription'),
    },
    {
      title: t('home.featureTwoTitle'),
      description: t('home.featureTwoDescription'),
    },
    {
      title: t('home.featureThreeTitle'),
      description: t('home.featureThreeDescription'),
    },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="glass-panel mesh-panel rounded-[36px] px-6 py-10 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          {t('home.eyebrow')}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          {t('home.description')}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/chat"
            className="rounded-full bg-accent px-6 py-3 text-center text-base font-semibold text-white shadow-[0_18px_36px_rgba(15,118,110,0.24)] transition hover:bg-accent-strong"
          >
            {t('home.primaryCta')}
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-line bg-background/80 px-6 py-3 text-center text-base font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            {t('home.secondaryCta')}
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        {featureCards.map((feature, index) => (
          <article
            key={feature.title}
            className="glass-panel rounded-[30px] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-sm font-bold text-accent">
                0{index + 1}
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {feature.title}
              </h2>
            </div>
            <p className="mt-4 text-base leading-7 text-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
