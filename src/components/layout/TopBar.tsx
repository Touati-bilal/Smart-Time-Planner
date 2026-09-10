"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggleIcon } from "@/components/ui/ThemeToggle";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/calendar": "Calendar",
  "/todo": "To-Do",
  "/settings": "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 pb-3 pt-[calc(0.75rem+var(--safe-top))] sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, var(--bg) 60%, color-mix(in srgb, var(--bg) 45%, transparent) 85%, transparent)",
      }}
    >
      <h1 className="text-lg font-semibold leading-tight tracking-tight lg:text-xl">{title}</h1>
      <div className="flex items-center gap-2">
        <ThemeToggleIcon />
        <Link
          href="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-1)] text-[var(--text-dim)] transition-colors hover:text-[var(--text)] lg:hidden"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>
      </div>
    </header>
  );
}
