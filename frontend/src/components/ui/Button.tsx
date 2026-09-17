import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-border hover:bg-surface-alt",
  danger: "bg-danger text-white hover:bg-danger-strong",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
