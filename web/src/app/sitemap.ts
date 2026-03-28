import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const pages = ['', '/login', '/register', '/chat'];
const locales = ['en', 'vi'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '/chat' ? 'daily' : 'weekly',
      priority: page === '' ? 1 : 0.7,
    })),
  );
}
