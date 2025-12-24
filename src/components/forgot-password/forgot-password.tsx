"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SaleSyncIcon } from "@/assets/salesync-icon";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { useResetPassword } from "@/hooks/use-reset-password";
import { useVerifyResetCode } from "@/hooks/use-verify-reset-code";
import { Button } from "../button";
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

const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type Step = "email" | "verification" | "resetPassword" | "success";

export function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const {
    mutate: forgotPassword,
    mutateAsync: forgotPasswordAsync,
    isPending,
  } = useForgotPassword();
  const { mutateAsync: verifyResetCode } = useVerifyResetCode();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
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

  const handleVerifyCode = async (verificationCode: string) => {
    const result = await verifyResetCode({ email, code: verificationCode });
    setResetToken(result.reset_token || "");
    setStep("resetPassword");
  };

  const onResetPassword = async (data: ResetPasswordValues) => {
    resetPassword(
      {
        reset_token: resetToken,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => {
          setStep("success");
        },
      },
    );
  };

  const handleResendCode = async () => {
    await forgotPasswordAsync({ email });
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-sage)] to-[var(--color-yellow)]">
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
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertCircle size={14} />
                      <span className="font-medium text-sm">
                        {errors.email.message}
                      </span>
                    </div>
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
          ) : step === "resetPassword" ? (
            <>
              <h1 className="mb-2 text-center font-semibold text-2xl text-[var(--foreground-100)]">
                Reset Password
              </h1>
              <p className="mb-6 text-center text-[var(--foreground-100)] text-sm opacity-80">
                Enter your new password below.
              </p>

              <form
                onSubmit={handleSubmitReset(onResetPassword)}
                className="space-y-4"
              >
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="new_password"
                    className="font-medium text-[var(--foreground-100)] text-sm"
                  >
                    New Password
                  </label>
                  <input
                    id="new_password"
                    type="password"
                    placeholder="Enter new password"
                    {...registerReset("new_password")}
                    className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
                  />
                  {resetErrors.new_password && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertCircle size={14} />
                      <span className="font-medium text-sm">
                        {resetErrors.new_password.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="confirm_password"
                    className="font-medium text-[var(--foreground-100)] text-sm"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm new password"
                    {...registerReset("confirm_password")}
                    className="rounded-lg border border-[var(--background-200)] bg-[var(--background-100)] px-4 py-2 text-[var(--foreground-100)] text-sm outline-none focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
                  />
                  {resetErrors.confirm_password && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertCircle size={14} />
                      <span className="font-medium text-sm">
                        {resetErrors.confirm_password.message}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isResetting}
                  className="mt-2 w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90 disabled:opacity-60"
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 flex justify-center text-4xl text-[var(--color-dark-green)]">
                ✓
              </div>
              <h1 className="mb-2 font-semibold text-2xl text-[var(--foreground-100)]">
                Password Reset Successfully
              </h1>
              <p className="mb-6 text-[var(--foreground-100)] text-sm opacity-80">
                Your password has been reset. You can now log in with your new
                password.
              </p>
              <Link href="/sign-in">
                <Button className="w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90">
                  Back to Log In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
