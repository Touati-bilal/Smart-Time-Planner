import { minutesToPx } from "./gridUtils";

export function NowLine({
  nowMin,
  startMin,
  endMin,
}: {
  nowMin: number;
  startMin: number;
  endMin: number;
}) {
  if (nowMin < startMin || nowMin > endMin) return null;
  return (
    <div
      className="absolute left-0 right-0 z-20 flex items-center"
      style={{ top: minutesToPx(nowMin, startMin) }}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
      <div className="h-px flex-1 bg-[var(--danger)]" />
    </div>
  );
}
