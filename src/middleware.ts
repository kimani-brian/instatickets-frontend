import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes requiring authentication
const PROTECTED = ["/organizer", "/buyer"];

// Routes only for unauthenticated users
const AUTH_ONLY = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the auth cookie set by useAuth hook
  const token = request.cookies.get("instatickets_token")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  // Not authenticated → redirect to login, saving the intended URL
  if (isProtected && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Already authenticated → bounce away from login/register
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)",
  ],
};