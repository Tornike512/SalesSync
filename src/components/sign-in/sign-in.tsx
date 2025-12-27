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
    <div className="relative flex min-h-svh items-center justify-center bg-[var(--background-100)]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary-soft)] via-transparent to-[var(--background-200)] opacity-50" />

      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--foreground-200)] transition-all hover:bg-[var(--background-200)] hover:text-[var(--foreground-100)]"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-[var(--background-300)] bg-white p-8 shadow-[var(--shadow-xl)]">
          <div className="mb-6 flex flex-col items-center gap-3">
            <SaleSyncIcon width={48} height={48} className="rounded-xl" />
            <h1 className="font-bold font-display text-2xl text-[var(--foreground-100)]">
              Welcome back
            </h1>
            <p className="text-[var(--foreground-200)] text-sm">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-[var(--accent-coral-soft)] p-3 text-[var(--accent-coral)] text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
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
                className="rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] px-4 py-3 text-[var(--foreground-100)] text-sm placeholder-[var(--foreground-300)] outline-none transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
              />
              {errors.email && (
                <span className="text-[var(--accent-coral)] text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
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
                className="rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] px-4 py-3 text-[var(--foreground-100)] text-sm placeholder-[var(--foreground-300)] outline-none transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
              />
              {errors.password && (
                <span className="text-[var(--accent-coral)] text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href={"/forgot-password"}
                className="text-[var(--accent-primary)] text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="mt-2 w-full rounded-xl py-3"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-[var(--foreground-200)] text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[var(--accent-primary)] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
