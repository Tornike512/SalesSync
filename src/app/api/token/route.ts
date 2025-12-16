import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "access_token";

/**
 * GET /api/auth/token
 * Retrieves the access token from cookies and returns it
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
