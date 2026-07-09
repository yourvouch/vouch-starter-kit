import type { ButtonHTMLAttributes } from "react";
import { buttonBaseStyles, buttonVariantStyles, type ButtonVariant } from "./buttonStyles";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function ActionButton({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) {
  const classes = `${buttonBaseStyles} ${buttonVariantStyles[variant]} ${className}`;

  return <button type={type} className={classes} {...props} />;
}
