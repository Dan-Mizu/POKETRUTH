import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === request.nextUrl.pathname.toLocaleLowerCase())
    return NextResponse.next();
  return NextResponse.redirect(
    `${request.nextUrl.origin}${request.nextUrl.pathname.toLocaleLowerCase()}${
      request.nextUrl.search
    }`
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - .*\\..* (url.extension files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     */
    '/((?!api|_next/static|.*\\..*|_next/image|favicon.ico|robots.txt).*)',
  ],
};
