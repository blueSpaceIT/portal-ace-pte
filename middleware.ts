// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // Public routes (no login required)
  const publicRoutes = ["/login"];

  // Skip internal or static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Redirect root path to login if not authenticated
  if (pathname === "/") {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // If authenticated, redirect to dashboard or home page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // If already logged in and trying to access login, redirect to dashboard
    if (accessToken && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: must have cookie
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
