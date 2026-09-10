export const HOUR_HEIGHT = 64; // px per hour in the grid

export function hoursInRange(startMin: number, endMin: number): number[] {
  const startHour = Math.floor(startMin / 60);
  const endHour = Math.ceil(endMin / 60);
  return Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
}

export function minutesToPx(minutes: number, rangeStartMin: number): number {
  return ((minutes - rangeStartMin) / 60) * HOUR_HEIGHT;
}

export function gridHeightPx(startMin: number, endMin: number): number {
  return ((endMin - startMin) / 60) * HOUR_HEIGHT;
}
