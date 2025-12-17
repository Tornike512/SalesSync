"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SaleSyncIcon } from "@/assets/salesync-icon";
import { useSession } from "@/hooks/use-session";
import { Button } from "../button";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    setError(null);
    const result = await signIn(data);

    if (result.success) {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      router.push(callbackUrl);
    } else {
      setError(result.error || "Failed to sign in");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-sage)] to-[var(--color-yellow)]">
      <Link
        href="/"
        className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-dark-green)] bg-white text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-cream)] active:scale-95"
      >
        <ArrowLeft size={20} />
      </Link>
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl bg-[var(--color-yellow)] p-8 shadow-xl">
          <div className="flex justify-center">
            <SaleSyncIcon width={48} height={48} />
          </div>
          <h1 className="mb-6 text-center font-semibold text-2xl text-[var(--foreground-100)]">
            Sign In
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-medium text-[var(--foreground-100)] text-sm"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="font-medium text-[var(--foreground-100)] text-sm"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href={"/forgot-password"}
                className="font-medium text-[var(--foreground-100)] text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-[var(--foreground-100)] text-xs">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
