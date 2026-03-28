import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';
import { AUTH_SESSION_COOKIE } from './src/lib/constants';

const handleI18nRouting = createMiddleware(routing);
const protectedRoutes = ['/chat'];
const guestOnlyRoutes = new Set(['/login', '/register']);

export function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const localeMatch = request.nextUrl.pathname.match(/^\/(en|vi)(\/.*)?$/);
  const locale = localeMatch?.[1] ?? routing.defaultLocale;
  const pathnameWithoutLocale = localeMatch?.[2] ?? '/';
  const hasSession = request.cookies.get(AUTH_SESSION_COOKIE)?.value === '1';
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(`${route}/`),
  );

  if (!hasSession && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (hasSession && guestOnlyRoutes.has(pathnameWithoutLocale)) {
    return NextResponse.redirect(new URL(`/${locale}/chat`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
