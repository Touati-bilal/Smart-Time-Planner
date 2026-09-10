"use client";

import { Minus, Plus } from "lucide-react";
import { minutesToDuration } from "@/lib/time";
import { clamp } from "@/lib/time";

export function HourStepper({
  minutes,
  onChange,
  step = 30,
  min = 0,
  max = 12 * 60,
}: {
  minutes: number;
  onChange: (m: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] p-1">
      <button
        type="button"
        onClick={() => onChange(clamp(minutes - step, min, max))}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-dim)] hover:bg-[var(--surface-2)] active:scale-95"
      >
        <Minus size={14} />
      </button>
      <span className="font-mono-num min-w-[3.5rem] text-center text-sm font-medium">
        {minutesToDuration(minutes)}
      </span>
      <button
        type="button"
        onClick={() => onChange(clamp(minutes + step, min, max))}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-dim)] hover:bg-[var(--surface-2)] active:scale-95"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
