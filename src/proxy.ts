import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/cart"];
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

/**
 * Validates the access token by calling the backend verify endpoint
 */
async function validateAccessToken(token: string): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return false;
    }

    const response = await fetch(`${apiUrl}/api/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Validate token for protected routes
  if (isProtectedRoute) {
    if (!accessToken) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    const isValid = await validateAccessToken(accessToken);
    if (!isValid) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(signInUrl);
      response.cookies.delete("access_token");
      return response;
    }
  }

  // Validate token for auth routes
  if (isAuthRoute && accessToken) {
    const isValid = await validateAccessToken(accessToken);
    if (isValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Token is invalid, clear it and allow access to auth routes
    const response = NextResponse.next();
    response.cookies.delete("access_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/sign-in", "/sign-up", "/forgot-password"],
};
