"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: "primary" | "ghost" | "outline";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 font-sans text-sm font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const styles: Record<string, string> = {
    primary:
      "bg-brand-primary text-white hover:bg-brand-accent shadow-[0_10px_30px_-12px_rgba(162,100,216,0.55)]",
    ghost: "bg-transparent text-brand-light hover:bg-white/5",
    outline:
      "bg-transparent text-brand-light border border-brand-border hover:border-brand-muted",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}
