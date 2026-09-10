"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CalendarDays, ListChecks, Settings } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/todo", label: "To-Do", icon: ListChecks },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Persistent left navigation shown only on desktop-width viewports (AppShell hides it below `lg`). */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-[var(--border)] px-3 py-6 lg:flex">
      <div className="mb-6 px-3">
        <p className="text-sm font-semibold tracking-tight text-[var(--text-dim)]">
          Smart Time Planner
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "var(--surface-2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Icon
                  size={18}
                  strokeWidth={active ? 2.4 : 1.8}
                  color={active ? "var(--accent)" : "var(--text-dim)"}
                />
                <span className={active ? "text-[var(--text)]" : "text-[var(--text-dim)]"}>
                  {label}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
