"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { todayKey } from "@/lib/time";
import { Todo } from "@/lib/types";
import { TodoItem } from "@/components/todo/TodoItem";
import { TodoForm } from "@/components/todo/TodoForm";
import { cn } from "@/lib/utils";

type Tab = "today" | "upcoming" | "completed" | "overdue";

const TABS: { key: Tab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
  { key: "completed", label: "Completed" },
];

const PRIORITY_RANK: Record<Todo["priority"], number> = { high: 0, medium: 1, low: 2 };

export default function TodoPage() {
  const todos = usePlannerStore((s) => s.todos);
  const toggle = usePlannerStore((s) => s.toggleTodoComplete);
  const [tab, setTab] = useState<Tab>("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  const today = todayKey();

  const filtered = useMemo(() => {
    let list = todos.filter((t) => {
      if (tab === "completed") return t.completed;
      if (t.completed) return false;
      if (tab === "overdue") return !!t.deadline && t.deadline < today;
      if (tab === "today") return !t.deadline || t.deadline === today || t.deadline < today;
      if (tab === "upcoming") return !!t.deadline && t.deadline > today;
      return true;
    });
    list = list.sort((a, b) => {
      if (tab === "completed") {
        return (b.completedAt ?? "").localeCompare(a.completedAt ?? "");
      }
      if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority]) {
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      }
      return (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999");
    });
    return list;
  }, [todos, tab, today]);

  const counts = useMemo(
    () => ({
      today: todos.filter((t) => !t.completed && (!t.deadline || t.deadline <= today)).length,
      upcoming: todos.filter((t) => !t.completed && t.deadline && t.deadline > today).length,
      overdue: todos.filter((t) => !t.completed && t.deadline && t.deadline < today).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos, today]
  );

  return (
    <div className="pt-2 lg:mx-auto lg:max-w-2xl">
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
              tab === t.key
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border-strong)] bg-[var(--surface-1)] text-[var(--text-dim)]"
            )}
          >
            {t.label}
            <span className="ml-1.5 opacity-70">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center text-sm text-[var(--text-faint)]"
            >
              Nothing here.
            </motion.p>
          ) : (
            filtered.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={() => toggle(t.id)}
                onOpen={() => {
                  setEditing(t);
                  setFormOpen(true);
                }}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        className="fixed z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_10px_30px_rgba(124,92,255,0.5)] active:scale-95 right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(6rem+var(--safe-bottom))] lg:bottom-[calc(1.5rem+var(--safe-bottom))]"
        aria-label="Add task"
      >
        <Plus size={22} />
      </button>

      <TodoForm open={formOpen} onClose={() => setFormOpen(false)} editingTodo={editing} />
    </div>
  );
}
