"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../button";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (_data: SignInFormValues) => {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background-100)]">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-yellow)] p-8 shadow-xl">
        <h1 className="mb-6 text-center font-semibold text-2xl text-[var(--foreground-100)]">
          Sign In
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <span className="text-[var(--color-orange)] text-xs">
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
              <span className="text-[var(--color-orange)] text-xs">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Button
              type="button"
              className="font-medium text-[var(--foreground-100)] text-sm underline-offset-4 hover:underline"
            >
              Forgot password?
            </Button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
