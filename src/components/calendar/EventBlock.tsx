"use client";

import { motion } from "framer-motion";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_META } from "@/lib/constants";
import { minutesToTime } from "@/lib/time";
import { ScheduleBlock } from "@/lib/types";
import { minutesToPx } from "./gridUtils";

export function EventBlock({
  block,
  rangeStart,
  onClick,
  compact = false,
  lane = 0,
  lanes = 1,
}: {
  block: ScheduleBlock;
  rangeStart: number;
  onClick: (b: ScheduleBlock) => void;
  compact?: boolean;
  lane?: number;
  lanes?: number;
}) {
  const meta = CATEGORY_META[block.category] ?? CATEGORY_META.custom;
  const top = minutesToPx(block.startMinutes, rangeStart);
  const height = Math.max(minutesToPx(block.endMinutes, rangeStart) - top, 20);
  const tiny = height < 34;
  const isFree = block.category === "free";
  const widthPct = 100 / lanes;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(block)}
      className="absolute overflow-hidden rounded-lg text-left"
      style={{
        top,
        height,
        left: `calc(${lane * widthPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        background: isFree ? "var(--surface-1)" : meta.bg,
        border: `1px solid ${isFree ? "var(--border)" : meta.border}`,
      }}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px]"
        style={{ background: isFree ? "transparent" : meta.color }}
      />
      <div className="h-full px-1.5 py-1">
        {!compact && !tiny && (
          <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: meta.color }}>
            <CategoryIcon category={block.category} size={11} color={meta.color} />
            <span className="truncate">{minutesToTime(block.startMinutes)}</span>
          </div>
        )}
        <p
          className="truncate text-[11px] font-medium leading-tight"
          style={{ color: isFree ? "var(--text-faint)" : "var(--text)" }}
        >
          {block.title}
        </p>
        {!tiny && !compact && (
          <p className="truncate text-[10px] text-[var(--text-faint)]">
            {minutesToTime(block.startMinutes)}–{minutesToTime(block.endMinutes)}
          </p>
        )}
      </div>
    </motion.button>
  );
}
