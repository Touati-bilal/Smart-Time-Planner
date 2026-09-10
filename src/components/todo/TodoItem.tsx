"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Todo } from "@/lib/types";
import { minutesToDuration, formatShortDate, todayKey } from "@/lib/time";
import { cn } from "@/lib/utils";

const PRIORITY_COLOR: Record<Todo["priority"], string> = {
  high: "#fb7185",
  medium: "#ffb454",
  low: "#64748b",
};

export function TodoItem({
  todo,
  onToggle,
  onOpen,
}: {
  todo: Todo;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const overdue = !todo.completed && todo.deadline && todo.deadline < todayKey();
  const color = PRIORITY_COLOR[todo.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="glass flex items-center gap-3 rounded-xl px-3 py-3"
    >
      <button
        onClick={onToggle}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        style={{
          borderColor: todo.completed ? "var(--success)" : color,
          background: todo.completed ? "var(--success)" : "transparent",
        }}
      >
        {todo.completed && <Check size={13} color="#0a0e17" strokeWidth={3} />}
      </button>

      <button onClick={onOpen} className="flex-1 text-left">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            todo.completed && "text-[var(--text-faint)] line-through"
          )}
        >
          {todo.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] text-[var(--text-faint)]">
          <span
            className="rounded px-1.5 py-0.5 font-medium"
            style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}
          >
            {todo.category}
          </span>
          {todo.estimatedMinutes && <span>{minutesToDuration(todo.estimatedMinutes)}</span>}
          {todo.deadline && (
            <span className={overdue ? "font-medium text-[var(--danger)]" : ""}>
              {overdue ? "Overdue · " : "Due "}
              {formatShortDate(todo.deadline)}
            </span>
          )}
        </div>
      </button>

      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
    </motion.div>
  );
}
