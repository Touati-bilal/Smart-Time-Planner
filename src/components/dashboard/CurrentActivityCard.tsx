"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_META } from "@/lib/constants";
import { minutesToDuration, minutesToTime } from "@/lib/time";
import { ScheduleBlock } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function CurrentActivityCard({
  current,
  next,
  nowMin,
}: {
  current: ScheduleBlock | null;
  next: ScheduleBlock | null;
  nowMin: number;
}) {
  if (!current) {
    return (
      <Card strong className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Right now</p>
          <p className="mt-1 text-base font-medium text-[var(--text-dim)]">Outside scheduled hours</p>
        </div>
      </Card>
    );
  }

  const meta = CATEGORY_META[current.category];
  const total = current.endMinutes - current.startMinutes;
  const elapsed = Math.min(total, Math.max(0, nowMin - current.startMinutes));
  const pct = total > 0 ? (elapsed / total) * 100 : 0;
  const remaining = Math.max(0, current.endMinutes - nowMin);

  return (
    <Card
      strong
      className="relative mb-4 overflow-hidden"
      style={{ boxShadow: `0 0 0 1px ${meta.border} inset, 0 20px 50px -20px ${meta.glow}` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{ background: meta.glow }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="pulse-glow h-2 w-2 rounded-full" style={{ background: meta.color }} />
          <p className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Right now</p>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
        >
          <CategoryIcon category={current.category} color={meta.color} size={17} />
        </div>
      </div>

      <h3 className="relative mt-2 text-xl font-semibold tracking-tight">{current.title}</h3>
      <p className="relative text-sm text-[var(--text-dim)]">
        {minutesToTime(current.startMinutes)} – {minutesToTime(current.endMinutes)} ·{" "}
        {minutesToDuration(remaining)} left
      </p>

      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: meta.color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {next && (
        <div className="relative mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-3 text-sm">
          <ArrowRight size={14} className="text-[var(--text-faint)]" />
          <span className="text-[var(--text-faint)]">Up next</span>
          <span className="font-medium text-[var(--text-dim)]">{next.title}</span>
          <span className="ml-auto font-mono-num text-xs text-[var(--text-faint)]">
            {minutesToTime(next.startMinutes)}
          </span>
        </div>
      )}
    </Card>
  );
}
