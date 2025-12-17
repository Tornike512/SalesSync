"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { Button } from "../button";
import { SaleSyncIcon } from "../icons/salesync-icon";
import { FourDigitForm } from "./4-digit-form";

const GoBackLink = () => (
  <Link
    href="/"
    className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-dark-green)] bg-white text-[var(--color-dark-green)] transition-all hover:bg-[var(--color-cream)] active:scale-95"
  >
    <ArrowLeft size={20} />
  </Link>
);

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

type Step = "email" | "verification" | "success";

export function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setEmail(data.email);
          setStep("verification");
        },
      },
    );
  };

  const handleVerifyCode = async (_code: string) => {
    // Simulate API call to verify code
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, accept any 4-digit code
    // In production, this would validate against the backend
    setStep("success");
  };

  const handleResendCode = async () => {
    // Simulate resending code
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Could show a toast notification here
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background-100)]">
      <GoBackLink />
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl bg-[var(--color-yellow)] p-8 shadow-xl">
          <div className="flex justify-center">
            <SaleSyncIcon width={48} height={48} />
          </div>
          {step === "email" ? (
            <>
              <h1 className="mb-2 text-center font-semibold text-2xl text-[var(--foreground-100)]">
                Forgot Password?
              </h1>
              <p className="mb-6 text-center text-[var(--foreground-100)] text-sm opacity-80">
                Enter your email and we'll send you a code to reset your
                password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="font-medium text-[var(--foreground-100)] text-sm"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
                  />
                  {errors.email && (
                    <span className="text-[var(--color-orange)] text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? "Sending..." : "Send Reset Code"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/sign-in"
                    className="cursor-pointer text-[var(--foreground-100)] text-xs underline-offset-4 hover:underline"
                    onClick={() => window.history.back()}
                  >
                    Back to Log In
                  </Link>
                </div>
              </form>
            </>
          ) : step === "verification" ? (
            <FourDigitForm
              email={email}
              onVerify={handleVerifyCode}
              onResendCode={handleResendCode}
              onBack={() => setStep("email")}
            />
          ) : (
            <div className="text-center">
              <div className="mb-4 flex justify-center text-4xl text-[var(--color-dark-green)]">
                ✉️
              </div>
              <h1 className="mb-2 font-semibold text-2xl text-[var(--foreground-100)]">
                Check your email
              </h1>
              <p className="mb-6 text-[var(--foreground-100)] text-sm opacity-80">
                We have sent a password reset code to your inbox.
              </p>
              <Button
                onClick={() => setStep("email")}
                className="w-full rounded-lg border border-[var(--foreground-100)] py-2 font-semibold text-[var(--foreground-100)] text-sm transition hover:bg-[var(--background-100)]"
              >
                Try another email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
