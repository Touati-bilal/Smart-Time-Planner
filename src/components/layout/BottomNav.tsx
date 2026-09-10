"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CalendarDays, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/todo", label: "To-Do", icon: ListChecks },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-md items-stretch justify-around border-t border-[var(--border)] px-2 pb-[calc(0.5rem+var(--safe-bottom))] pt-2 transition-colors lg:hidden"
      style={{
        background: "color-mix(in srgb, var(--bg-elevated) 86%, transparent)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
      }}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5"
          >
            {active && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-x-3 -top-0.5 h-0.5 rounded-full bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={22}
              strokeWidth={active ? 2.4 : 1.8}
              color={active ? "var(--accent)" : "var(--text-dim)"}
            />
            <span
              className={cn(
                "text-[10.5px] font-medium tracking-wide",
                active ? "text-[var(--text)]" : "text-[var(--text-faint)]"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
