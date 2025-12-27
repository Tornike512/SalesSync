"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Button } from "../button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  className,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open and handle animation timing
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      // Small delay to ensure initial state is rendered before animating
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
      document.body.style.overflow = "unset";
      // Unmount after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    // biome-ignore lint: This div is clickable for modal backdrop
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
        shouldAnimate ? "opacity-100" : "opacity-0",
      )}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with subtle blur */}
      <div
        className={cn(
          "absolute inset-0 bg-[var(--foreground-100)]/5 backdrop-blur-[2px] transition-opacity duration-200",
          shouldAnimate ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          "relative z-10 w-full max-w-lg",
          "rounded-xl bg-white",
          "border border-[var(--background-300)]",
          "shadow-[var(--shadow-xl)]",
          "transition-all duration-300",
          shouldAnimate
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0",
          className,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-[var(--background-300)] border-b px-6 py-4">
            {title && (
              <h2 className="font-display font-semibold text-[var(--foreground-100)] text-xl">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="ml-auto rounded-full p-2 text-[var(--foreground-200)] hover:text-[var(--foreground-100)]"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
