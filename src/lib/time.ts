import { addDays, format, parseISO, startOfWeek } from "date-fns";

export function minutesToTime(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function minutesToDuration(minutes: number): string {
  if (minutes <= 0) return "0min";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

export function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function weekStartKey(d: Date = new Date()): string {
  return dateKey(startOfWeek(d, { weekStartsOn: 1 }));
}

export function weekDates(weekStart: string): Date[] {
  const start = parseISO(weekStart);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function weekdayOf(dateStr: string): number {
  // 0 = Monday ... 6 = Sunday
  const d = parseISO(dateStr);
  const day = d.getDay(); // 0 = Sunday
  return day === 0 ? 6 : day - 1;
}

export function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export function formatNiceDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE, MMMM d");
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
