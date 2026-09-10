import { HOUR_HEIGHT, hoursInRange } from "./gridUtils";

export function GridLines({ startMin, endMin }: { startMin: number; endMin: number }) {
  const hours = hoursInRange(startMin, endMin);
  return (
    <>
      {hours.map((h) => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t border-[var(--border)]"
          style={{ top: ((h * 60 - startMin) / 60) * HOUR_HEIGHT }}
        />
      ))}
    </>
  );
}
