"use client";

import { motion } from "framer-motion";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={label}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
      style={{ background: checked ? "var(--accent)" : "var(--surface-3)" }}
    >
      <motion.span
        className="inline-block h-4.5 w-4.5 rounded-full bg-white shadow"
        style={{ height: 18, width: 18 }}
        animate={{ x: checked ? 22 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}
