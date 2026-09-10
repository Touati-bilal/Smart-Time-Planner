import { minutesToTime } from "@/lib/time";
import { HOUR_HEIGHT, hoursInRange } from "./gridUtils";

export function HourGutter({ startMin, endMin }: { startMin: number; endMin: number }) {
  const hours = hoursInRange(startMin, endMin);
  return (
    <div className="relative w-11 shrink-0 select-none">
      {hours.map((h) => (
        <div
          key={h}
          className="absolute right-1.5 -translate-y-1/2 text-[10px] text-[var(--text-faint)]"
          style={{ top: ((h * 60 - startMin) / 60) * HOUR_HEIGHT }}
        >
          {minutesToTime(h * 60)}
        </div>
      ))}
    </div>
  );
}
