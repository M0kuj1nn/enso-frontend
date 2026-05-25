import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const user = request.cookies.get('user');
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/registration');

  if (!user && !isAuthPage) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|static).*)'],
};
