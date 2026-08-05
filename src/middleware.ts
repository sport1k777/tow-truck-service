import { auth } from '@/lib/auth.edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PREFIX = '/admin';
const LOGIN_PATH = '/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  if (pathname.startsWith(ADMIN_PREFIX) && pathname !== LOGIN_PATH) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === LOGIN_PATH) {
    const session = await auth();
    if (session?.user) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  if (pathname === '/login') {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      loginUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/login'],
};
