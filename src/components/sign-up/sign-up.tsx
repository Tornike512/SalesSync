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
    path: ["confirmPassword"], // path of error
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
    <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-sage)] to-[var(--color-yellow)]">
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
            Create Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1">
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
                className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>

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
                placeholder="Create a password"
                {...register("password")}
                className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
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
                className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-center text-[var(--foreground-100)] text-xs">
              Already have an account?{" "}
              <Link href={"/sign-in"} className="font-bold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
