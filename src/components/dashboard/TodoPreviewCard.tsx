"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { Todo } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PRIORITY_COLOR: Record<Todo["priority"], string> = {
  high: "#fb7185",
  medium: "#ffb454",
  low: "#64748b",
};

export function TodoPreviewCard({ todayKey }: { todayKey: string }) {
  const todos = usePlannerStore((s) => s.todos);
  const toggle = usePlannerStore((s) => s.toggleTodoComplete);

  const relevant = todos
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const rank = { high: 0, medium: 1, low: 2 };
      if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
      const ad = a.deadline ?? "9999-12-31";
      const bd = b.deadline ?? "9999-12-31";
      return ad.localeCompare(bd);
    })
    .slice(0, 4);

  return (
    <Card className="mb-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Important To-Do</h3>
        <Link href="/todo" className="flex items-center gap-0.5 text-xs text-[var(--accent)]">
          See all <ChevronRight size={13} />
        </Link>
      </div>
      {relevant.length === 0 ? (
        <p className="py-2 text-xs text-[var(--text-faint)]">Nothing pending. Nice work.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {relevant.map((t, i) => {
            const overdue = t.deadline && t.deadline < todayKey;
            return (
              <motion.button
                key={t.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggle(t.id)}
                className="flex items-center gap-2.5 rounded-lg px-1 py-1 text-left hover:bg-[var(--surface-1)]"
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full border-2"
                  style={{ borderColor: PRIORITY_COLOR[t.priority] }}
                />
                <span className="flex-1 truncate text-sm">{t.title}</span>
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-medium",
                    overdue ? "text-[var(--danger)]" : "text-[var(--text-faint)]"
                  )}
                >
                  {t.category}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
