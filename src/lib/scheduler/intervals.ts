export interface Interval {
  start: number;
  end: number;
}

/** Merge overlapping/adjacent intervals, sorted ascending. */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals]
    .filter((i) => i.end > i.start)
    .sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];
  for (const cur of sorted) {
    const last = merged[merged.length - 1];
    if (last && cur.start <= last.end) {
      last.end = Math.max(last.end, cur.end);
    } else {
      merged.push({ ...cur });
    }
  }
  return merged;
}

/** Compute free gaps within [rangeStart, rangeEnd) given a set of occupied intervals. */
export function freeGaps(
  occupied: Interval[],
  rangeStart: number,
  rangeEnd: number
): Interval[] {
  const merged = mergeIntervals(occupied);
  const gaps: Interval[] = [];
  let cursor = rangeStart;
  for (const block of merged) {
    if (block.end <= rangeStart || block.start >= rangeEnd) continue; // no overlap with the query range
    const s = Math.max(block.start, rangeStart);
    const e = Math.min(block.end, rangeEnd);
    if (s > cursor) gaps.push({ start: cursor, end: s });
    cursor = Math.max(cursor, e);
  }
  if (cursor < rangeEnd) gaps.push({ start: cursor, end: rangeEnd });
  return gaps.filter((g) => g.end > g.start);
}

export function intervalDuration(i: Interval): number {
  return i.end - i.start;
}

export function totalDuration(intervals: Interval[]): number {
  return intervals.reduce((sum, i) => sum + intervalDuration(i), 0);
}

/** Take up to `minutes` from a list of gaps, returning the used sub-intervals and updated gaps. */
export function takeFromGaps(
  gaps: Interval[],
  minutes: number,
  preferEnd = false
): { taken: Interval[]; remainingGaps: Interval[]; unfulfilled: number } {
  let need = minutes;
  const taken: Interval[] = [];
  const remaining: Interval[] = [];
  const ordered = preferEnd ? [...gaps].reverse() : gaps;

  for (const gap of ordered) {
    if (need <= 0) {
      remaining.push(gap);
      continue;
    }
    const size = intervalDuration(gap);
    if (size <= need) {
      taken.push(gap);
      need -= size;
    } else {
      if (preferEnd) {
        taken.push({ start: gap.end - need, end: gap.end });
        remaining.push({ start: gap.start, end: gap.end - need });
      } else {
        taken.push({ start: gap.start, end: gap.start + need });
        remaining.push({ start: gap.start + need, end: gap.end });
      }
      need = 0;
    }
  }
  const finalRemaining = preferEnd ? remaining.reverse() : remaining;
  return {
    taken: taken.sort((a, b) => a.start - b.start),
    remainingGaps: mergeIntervals(finalRemaining),
    unfulfilled: Math.max(0, need),
  };
}

/** Remove a specific interval (assumed fully contained within one of the gaps) from the gap list. */
export function subtractFromGaps(gaps: Interval[], toRemove: Interval): Interval[] {
  const result: Interval[] = [];
  for (const g of gaps) {
    if (toRemove.start >= g.start && toRemove.end <= g.end) {
      if (g.start < toRemove.start) result.push({ start: g.start, end: toRemove.start });
      if (toRemove.end < g.end) result.push({ start: toRemove.end, end: g.end });
    } else {
      result.push(g);
    }
  }
  return mergeIntervals(result);
}

/** Find the single largest gap that can fit `minutes`, or null. */
export function findGapFitting(
  gaps: Interval[],
  minutes: number
): Interval | null {
  const candidates = gaps.filter((g) => intervalDuration(g) >= minutes);
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => intervalDuration(a) - intervalDuration(b));
  return candidates[0];
}
