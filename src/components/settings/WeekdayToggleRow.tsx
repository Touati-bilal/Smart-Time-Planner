"use client";

import { Weekday, WEEKDAYS } from "@/lib/types";
import { WEEKDAY_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function WeekdayToggleRow({
  selected,
  onChange,
}: {
  selected: Weekday[];
  onChange: (days: Weekday[]) => void;
}) {
  const toggle = (day: Weekday) => {
    if (selected.includes(day)) onChange(selected.filter((d) => d !== day));
    else onChange([...selected, day]);
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((day) => {
        const active = selected.includes(day);
        return (
          <button
            key={day}
            onClick={() => toggle(day)}
            className={cn(
              "flex flex-col items-center rounded-lg py-2 text-[11px] font-semibold transition-colors"
            )}
            style={{
              background: active ? "var(--accent)" : "var(--surface-1)",
              color: active ? "white" : "var(--text-faint)",
            }}
          >
            {WEEKDAY_SHORT[day][0]}
          </button>
        );
      })}
    </div>
  );
}
