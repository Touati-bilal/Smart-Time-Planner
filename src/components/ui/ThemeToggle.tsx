"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggleIcon() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-1)] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolvedTheme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {resolvedTheme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const OPTIONS: { key: ThemePreference; label: string; icon: typeof Sun }[] = [
  { key: "system", label: "System", icon: Monitor },
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggleSegmented() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative grid grid-cols-3 gap-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] p-1">
      {OPTIONS.map((opt) => {
        const active = theme === opt.key;
        const Icon = opt.icon;
        return (
          <button
            key={opt.key}
            onClick={() => setTheme(opt.key)}
            className="relative flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium"
          >
            {active && (
              <motion.div
                layoutId="theme-pill"
                className="absolute inset-0 rounded-lg"
                style={{ background: "var(--accent)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex flex-col items-center gap-1",
                active ? "text-white" : "text-[var(--text-dim)]"
              )}
            >
              <Icon size={14} />
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
