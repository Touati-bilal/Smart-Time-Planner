import { BlockCategory, DailyStats, ScheduleBlock } from "../types";

export function computeDailyStats(date: string, blocks: ScheduleBlock[]): DailyStats {
  const sum = (cat: BlockCategory) =>
    blocks
      .filter((b) => b.category === cat)
      .reduce((s, b) => s + (b.endMinutes - b.startMinutes), 0);

  const totalScheduledMinutes = blocks
    .filter((b) => b.category !== "free")
    .reduce((s, b) => s + (b.endMinutes - b.startMinutes), 0);

  return {
    date,
    workMinutes: sum("work"),
    studyMinutes: sum("study"),
    sportMinutes: sum("sport"),
    frenchMinutes: sum("french"),
    freeMinutes: sum("free"),
    totalScheduledMinutes,
  };
}

export function currentAndNextBlock(
  blocks: ScheduleBlock[],
  nowMin: number
): { current: ScheduleBlock | null; next: ScheduleBlock | null } {
  const sorted = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);
  const current = sorted.find((b) => nowMin >= b.startMinutes && nowMin < b.endMinutes) ?? null;
  const next = sorted.find((b) => b.startMinutes > nowMin) ?? null;
  return { current, next };
}

export function dayProgress(nowMin: number, wakeMin: number, sleepMin: number): number {
  if (nowMin <= wakeMin) return 0;
  if (nowMin >= sleepMin) return 100;
  return Math.round(((nowMin - wakeMin) / (sleepMin - wakeMin)) * 100);
}
