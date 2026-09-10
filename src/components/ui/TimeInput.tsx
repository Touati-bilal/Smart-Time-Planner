"use client";

import { minutesToTime, timeToMinutes } from "@/lib/time";

export function TimeInput({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (m: number) => void;
}) {
  return (
    <input
      type="time"
      value={minutesToTime(minutes)}
      onChange={(e) => e.target.value && onChange(timeToMinutes(e.target.value))}
      className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-2.5 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
    />
  );
}
