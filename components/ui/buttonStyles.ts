export type ButtonVariant = "primary" | "secondary";

export const buttonBaseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary:
    "text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-800",
};
