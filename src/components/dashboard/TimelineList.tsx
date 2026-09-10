"use client";

import { motion } from "framer-motion";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_META } from "@/lib/constants";
import { minutesToTime } from "@/lib/time";
import { ScheduleBlock } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TimelineList({
  blocks,
  nowMin,
}: {
  blocks: ScheduleBlock[];
  nowMin: number;
}) {
  const sorted = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-[var(--border-strong)]" />
      {sorted.map((block, i) => {
        const meta = CATEGORY_META[block.category];
        const isPast = nowMin >= block.endMinutes;
        const isCurrent = nowMin >= block.startMinutes && nowMin < block.endMinutes;
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.035, 0.4), duration: 0.3 }}
            className="relative mb-3 flex gap-3"
          >
            <div
              className={cn(
                "absolute -left-5 top-1 h-3 w-3 rounded-full border-2",
                isCurrent && "pulse-glow"
              )}
              style={{
                borderColor: meta.color,
                background: isCurrent ? meta.color : "var(--bg)",
              }}
            />
            <div
              className={cn(
                "flex flex-1 items-center justify-between rounded-xl border px-3 py-2.5 transition-opacity",
                isPast && "opacity-45"
              )}
              style={{
                background: isCurrent ? meta.bg : "var(--surface-1)",
                borderColor: isCurrent ? meta.border : "var(--border)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <CategoryIcon category={block.category} color={meta.color} size={16} />
                <div>
                  <p className="text-sm font-medium leading-tight">{block.title}</p>
                  {block.subtitle && (
                    <p className="text-[11px] text-[var(--text-faint)]">{block.subtitle}</p>
                  )}
                </div>
              </div>
              <span className="font-mono-num shrink-0 text-[11px] text-[var(--text-faint)]">
                {minutesToTime(block.startMinutes)}–{minutesToTime(block.endMinutes)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
