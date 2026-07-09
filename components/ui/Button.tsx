import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary:
    "text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-800",
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
