"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { type ReactNode, useState } from "react";

interface DropdownSectionProps {
  readonly title: string;
  readonly itemCount: number;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
  readonly level?: 1 | 2;
}

export function DropdownSection({
  title,
  itemCount,
  children,
  defaultOpen = false,
  level = 1,
}: DropdownSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const bgColor = level === 1 ? "bg-white" : "bg-[var(--color-cream)]";
  const borderColor =
    level === 1
      ? "border-[var(--color-yellow)]/30"
      : "border-[var(--foreground-100)]/10";
  const padding = level === 1 ? "p-4" : "p-3";

  return (
    <div
      className={`overflow-hidden rounded-lg border-2 ${borderColor} ${bgColor} shadow-md`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between text-left transition-colors hover:bg-[var(--color-yellow)]/10"
      >
        <div className={`flex flex-1 items-center gap-3 ${padding}`}>
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-yellow)]/20 text-[var(--foreground-100)] transition-transform">
            {isOpen ? (
              <ChevronDown className="size-5 transition-transform" />
            ) : (
              <ChevronRight className="size-5 transition-transform" />
            )}
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold text-[var(--foreground-100)] ${level === 1 ? "text-lg" : "text-base"}`}
            >
              {title}
            </h3>
            <p className="text-[var(--foreground-100)]/60 text-sm">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-[var(--color-yellow)]/30 border-t ${level === 1 ? "p-4" : "p-3"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
