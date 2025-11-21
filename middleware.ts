import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /member/hub routes
  if (pathname.startsWith('/member/hub')) {
    const sessionToken = request.cookies.get('member_session')?.value;

    if (!sessionToken) {
      const loginUrl = new URL('/member/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify session is valid by calling the auth check endpoint
    try {
      const authCheckUrl = new URL('/api/member/check-auth', request.url);
      const authResponse = await fetch(authCheckUrl.toString(), {
        headers: {
          Cookie: `member_session=${sessionToken}`,
        },
      });

      if (!authResponse.ok) {
        const loginUrl = new URL('/member/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Middleware auth check failed:', error);
      const loginUrl = new URL('/member/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/member/hub/:path*',
  ],
};
