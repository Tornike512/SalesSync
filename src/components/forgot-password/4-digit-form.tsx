"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";

interface FourDigitFormProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  onBack: () => void;
}

export function FourDigitForm({
  email,
  onVerify,
  onResendCode,
  onBack,
}: FourDigitFormProps) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setVerificationError("");

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").concat(["", "", "", ""]).slice(0, 4);
      setCode(newCode);
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedData.length, 3);
      const nextInput = document.getElementById(`code-${nextIndex}`);
      nextInput?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 4) {
      setVerificationError("Please enter all 4 digits");
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(enteredCode);
    } catch {
      setVerificationError("Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setCode(["", "", "", ""]);
    setVerificationError("");
    try {
      await onResendCode();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <h1 className="mb-2 text-center font-semibold text-2xl text-[var(--foreground-100)]">
        Enter Verification Code
      </h1>
      <p className="mb-6 text-center text-[var(--foreground-100)] text-sm opacity-80">
        We've sent a 4-digit code to {email}
      </p>

      <div className="space-y-4">
        <div className="flex justify-center gap-3">
          <input
            id="code-0"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[0]}
            onChange={(e) => handleCodeChange(0, e.target.value)}
            onKeyDown={(e) => handleKeyDown(0, e)}
            onPaste={handlePaste}
            className="h-14 w-14 rounded-lg border-2 border-[var(--background-200)] bg-[var(--background-100)] text-center font-semibold text-2xl text-[var(--foreground-100)] outline-none focus:border-[var(--foreground-100)] focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
            aria-label="Digit 1"
          />
          <input
            id="code-1"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[1]}
            onChange={(e) => handleCodeChange(1, e.target.value)}
            onKeyDown={(e) => handleKeyDown(1, e)}
            className="h-14 w-14 rounded-lg border-2 border-[var(--background-200)] bg-[var(--background-100)] text-center font-semibold text-2xl text-[var(--foreground-100)] outline-none focus:border-[var(--foreground-100)] focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
            aria-label="Digit 2"
          />
          <input
            id="code-2"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[2]}
            onChange={(e) => handleCodeChange(2, e.target.value)}
            onKeyDown={(e) => handleKeyDown(2, e)}
            className="h-14 w-14 rounded-lg border-2 border-[var(--background-200)] bg-[var(--background-100)] text-center font-semibold text-2xl text-[var(--foreground-100)] outline-none focus:border-[var(--foreground-100)] focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
            aria-label="Digit 3"
          />
          <input
            id="code-3"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[3]}
            onChange={(e) => handleCodeChange(3, e.target.value)}
            onKeyDown={(e) => handleKeyDown(3, e)}
            className="h-14 w-14 rounded-lg border-2 border-[var(--background-200)] bg-[var(--background-100)] text-center font-semibold text-2xl text-[var(--foreground-100)] outline-none focus:border-[var(--foreground-100)] focus:ring-2 focus:ring-[var(--foreground-100)] focus:ring-offset-1"
            aria-label="Digit 4"
          />
        </div>

        {verificationError && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-500">
            <AlertCircle size={16} />
            <p className="font-medium text-sm">{verificationError}</p>
          </div>
        )}

        <Button
          type="button"
          onClick={handleVerifyCode}
          disabled={code.join("").length !== 4 || isVerifying}
          className="mt-2 w-full rounded-lg bg-[var(--color-dark-green)] py-2 font-semibold text-[var(--background-100)] text-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          {resendSuccess ? (
            <p className="font-medium text-[var(--color-dark-green)] text-sm">
              Code sent successfully!
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="cursor-pointer text-[var(--foreground-100)] text-xs underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-[var(--foreground-100)] text-xs underline-offset-4 hover:underline"
          >
            Back to Email
          </button>
        </div>
      </div>
    </>
  );
}
