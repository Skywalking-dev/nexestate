import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Copper bg + white text — CTA (PRODUCT_IDENTITY.md § Button Variants)
  primary:
    "bg-accent text-white hover:brightness-[0.85] disabled:bg-gray-300 disabled:text-gray-400",
  // Gray-50 bg + navy text + gray-200 border
  secondary:
    "bg-gray-50 text-primary border border-gray-200 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-300",
  // Transparent + copper text (Tertiary per spec)
  ghost:
    "bg-transparent text-accent border border-accent hover:bg-accent/10 disabled:text-gray-400 disabled:border-gray-300",
  // Error red bg + white text
  danger:
    "bg-error text-white hover:brightness-[0.90] disabled:bg-gray-300 disabled:text-gray-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-body-sm",
  md: "px-4 py-2.5 text-body",
  lg: "px-6 py-3 text-body",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-sm font-medium transition-button",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid={`button-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}
