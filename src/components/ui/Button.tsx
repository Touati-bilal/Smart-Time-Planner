"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: HTMLMotionProps<"button"> & { variant?: Variant; size?: "sm" | "md" | "lg" }) {
  const variants: Record<Variant, string> = {
    primary: "brand-gradient text-white shadow-[var(--shadow-accent)] hover:brightness-110",
    secondary:
      "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--surface-3)]",
    ghost: "bg-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-1)]",
    danger: "bg-[var(--danger)]/15 text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/25",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-5 py-3 text-base rounded-xl",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cn(
        "font-medium inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
