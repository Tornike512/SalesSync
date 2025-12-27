import { cn } from "@/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  ref?: React.Ref<HTMLButtonElement>;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-[var(--accent-primary)] text-white",
    "hover:bg-[var(--accent-primary-hover)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2",
  ),
  secondary: cn(
    "bg-[var(--background-200)] text-[var(--foreground-100)]",
    "hover:bg-[var(--background-300)]",
    "border border-[var(--background-300)]",
  ),
  ghost: cn(
    "bg-transparent text-[var(--foreground-100)]",
    "hover:bg-[var(--background-200)]",
  ),
  outline: cn(
    "bg-transparent text-[var(--accent-primary)]",
    "border border-[var(--accent-primary)]",
    "hover:bg-[var(--accent-primary-soft)]",
  ),
  danger: cn(
    "bg-[var(--accent-coral)] text-white",
    "hover:bg-[#EF4444]",
    "focus-visible:ring-2 focus-visible:ring-[var(--accent-coral)] focus-visible:ring-offset-2",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-lg",
};

export const Button = ({
  children,
  className,
  type = "button",
  loading,
  variant,
  size,
  disabled,
  ref,
  ...props
}: ButtonProps) => {
  const hasVariant = variant !== undefined;
  const hasSize = size !== undefined;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "cursor-pointer transition-all duration-200",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:scale-[0.98]",
        hasVariant && variantStyles[variant],
        hasSize && sizeStyles[size],
        hasVariant && "font-medium",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
