"use server";

import { cookies } from "next/headers";
import { api } from "./api-client";

type SignInData = {
  email: string;
  password: string;
};

type SignInResponse = {
  access_token: string;
  token_type: string;
};

type SignUpData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

type SignUpResponse = {
  access_token: string;
  token_type: string;
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

const ACCESS_TOKEN_KEY = "access_token";

export async function signIn(
  data: SignInData,
): Promise<ActionResult<SignInResponse>> {
  try {
    const response = await api.post<SignInResponse>("/api/v1/auth/login", data);

    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_KEY, response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
  }
}

export async function signUp(
  data: SignUpData,
): Promise<ActionResult<SignUpResponse>> {
  try {
    const response = await api.post<SignUpResponse>(
      "/api/v1/auth/signup",
      data,
    );

    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_KEY, response.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
}

export async function changePassword(
  data: ChangePasswordData,
): Promise<ActionResult> {
  try {
    await api.post("/api/v1/auth/change-password", data);

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to change password",
    };
  }
}

export async function signOut(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_KEY);

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
}
