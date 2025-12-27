"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SaleSyncIcon } from "@/assets/salesync-icon";
import { useSession } from "@/hooks/use-session";
import { Button } from "../button";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUp() {
  const router = useRouter();
  const { signUp } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setError(null);
    const result = await signUp({
      full_name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    });

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Failed to create account");
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-[var(--background-100)] py-8">
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
              Create account
            </h1>
            <p className="text-[var(--foreground-200)] text-sm">
              Get started with SalesSync
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-[var(--accent-coral-soft)] p-3 text-[var(--accent-coral)] text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="font-medium text-[var(--foreground-100)] text-sm"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className="rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] px-4 py-3 text-[var(--foreground-100)] text-sm placeholder-[var(--foreground-300)] outline-none transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
              />
              {errors.name && (
                <span className="text-[var(--accent-coral)] text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

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
                placeholder="Create a password"
                {...register("password")}
                className="rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] px-4 py-3 text-[var(--foreground-100)] text-sm placeholder-[var(--foreground-300)] outline-none transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
              />
              {errors.password && (
                <span className="text-[var(--accent-coral)] text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="font-medium text-[var(--foreground-100)] text-sm"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                {...register("confirmPassword")}
                className="rounded-xl border border-[var(--background-300)] bg-[var(--background-100)] px-4 py-3 text-[var(--foreground-100)] text-sm placeholder-[var(--foreground-300)] outline-none transition-all focus:border-[var(--accent-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-primary-soft)]"
              />
              {errors.confirmPassword && (
                <span className="text-[var(--accent-coral)] text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="mt-4 w-full rounded-xl py-3"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-center text-[var(--foreground-200)] text-sm">
              Already have an account?{" "}
              <Link
                href={"/sign-in"}
                className="font-semibold text-[var(--accent-primary)] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
