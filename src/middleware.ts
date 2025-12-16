import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/cart"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*"],
};
