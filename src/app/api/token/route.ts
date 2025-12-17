import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "access_token";

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

/**
 * GET /api/token
 * Retrieves the access token from cookies, validates it, and returns it
 */
export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY);

    if (!accessToken?.value) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 404 },
      );
    }

    // Validate the token
    const isValid = await validateAccessToken(accessToken.value);
    if (!isValid) {
      // Token is invalid, delete it
      cookieStore.delete(ACCESS_TOKEN_KEY);
      return NextResponse.json(
        { error: "Access token is invalid" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        access_token: accessToken.value,
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to retrieve access token" },
      { status: 500 },
    );
  }
}
