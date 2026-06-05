import type { NextRequest } from 'next/server';
import { proxy } from './proxy';

// Next.js middleware entrypoint.
// We keep the actual logic in `proxy.ts` to keep changes minimal.
export function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};

