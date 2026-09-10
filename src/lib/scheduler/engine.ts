import { v4 as uuid } from "uuid";
import { DayInput, ScheduleBlock, Todo, UserSettings, Weekday, WEEKDAYS } from "../types";
import {
  SUNDAY_FIXED_TEMPLATE,
  SUNDAY_SPORT_MINUTES,
  SUNDAY_STUDY_MINUTES,
  TemplateBlock,
  WEEKLY_PLAN_TEMPLATES,
  WeeklyPlanVariant,
  weeklyPlanWorkMinutesPerDay,
} from "./weeklyPlanTemplates";
import { clamp, weekdayOf } from "../time";
import {
  findGapFitting,
  freeGaps,
  Interval,
  mergeIntervals,
  subtractFromGaps,
} from "./intervals";

export interface WeekEngineInput {
  weekStart: string;
  dates: string[]; // 7 dates, Monday -> Sunday
  /** Each non-Sunday date's chosen Plan+Option (e.g. "B2"). null/missing = not assigned yet. */
  dayPlans: Record<string, WeeklyPlanVariant | null>;
  dayInputs: Record<string, DayInput>;
  settings: UserSettings;
  manualEvents: ScheduleBlock[];
  todos: Todo[];
}

export interface WeekEngineOutput {
  blocksByDate: Record<string, ScheduleBlock[]>;
  studyUsedByDate: Record<string, number>;
  sportUsedByDate: Record<string, number>;
  weeklyStudyTargetMinutes: number;
  weeklySportTargetMinutes: number;
  weeklySportUsedMinutes: number;
  weeklyWorkMinutes: number;
  weeklyWorkTargetMinutes: number;
  weeklyFrenchMinutes: number;
  weeklyFreeMinutes: number;
  conflicts: { date: string; message: string }[];
}

function mkBlock(
  date: string,
  start: number,
  end: number,
  category: ScheduleBlock["category"],
  title: string,
  source: ScheduleBlock["source"],
  extra: Partial<ScheduleBlock> = {}
): ScheduleBlock {
  return {
    id: uuid(),
    date,
    startMinutes: start,
    endMinutes: end,
    category,
    title,
    source,
    ...extra,
  };
}

const isSundayDate = (date: string) => weekdayOf(date) === 6;
const SPORT_REST_GAP_DAYS = 2;

/** Keeps only the portions of each template segment not already occupied. */
function clipTemplateToOccupied(template: TemplateBlock[], occupied: Interval[]): TemplateBlock[] {
  const result: TemplateBlock[] = [];
  for (const seg of template) {
    for (const g of freeGaps(occupied, seg.start, seg.end)) {
      result.push({ start: g.start, end: g.end, category: seg.category, title: seg.title });
    }
  }
  return result;
}

/**
 * Work for a non-Sunday day: the plan template's work segments by default,
 * unless the user explicitly opted out or overrode the duration for this
 * specific day (a one-off exception on top of the weekly plan).
 */
function computeWorkBlocks(
  dayInput: DayInput,
  settings: UserSettings,
  dayStart: number,
  dayEnd: number,
  occupiedHard: Interval[],
  variant: WeeklyPlanVariant | null
): { blocks: TemplateBlock[]; conflict?: string } {
  if (dayInput.workOptOut) return { blocks: [] };

  if (dayInput.workOverrideMinutes != null) {
    const desired = dayInput.workOverrideMinutes;
    const gaps = freeGaps(occupiedHard, dayStart, dayEnd);
    const preferredGap = gaps.find(
      (g) => g.start <= settings.work.workStartMinutes && g.end - settings.work.workStartMinutes >= desired
    );
    let interval: Interval | null = null;
    if (preferredGap) {
      interval = { start: settings.work.workStartMinutes, end: settings.work.workStartMinutes + desired };
    } else {
      const fit = findGapFitting(gaps, desired);
      if (fit) interval = { start: fit.start, end: fit.start + desired };
    }
    if (!interval) {
      return { blocks: [], conflict: "Not enough free time to place the work-hours override." };
    }
    return { blocks: [{ start: interval.start, end: interval.end, category: "work", title: "Work" }] };
  }

  if (!variant) return { blocks: [] };
  const template = WEEKLY_PLAN_TEMPLATES[variant].filter((b) => b.category === "work");
  return { blocks: clipTemplateToOccupied(template, occupiedHard) };
}

/** Study for a non-Sunday day: the plan template's study segments, clipped
 *  around whatever formation/manual/work already occupies the day. */
function computeStudyBlocks(variant: WeeklyPlanVariant | null, occupiedWithWork: Interval[]): TemplateBlock[] {
  if (!variant) return [];
  const template = WEEKLY_PLAN_TEMPLATES[variant].filter((b) => b.category === "study");
  return clipTemplateToOccupied(template, occupiedWithWork);
}

interface DayLayer {
  dayStart: number;
  dayEnd: number;
  formationBlocks: ScheduleBlock[];
  occupiedHard: Interval[]; // manual events + formation
}

export function generateWeekSchedule(input: WeekEngineInput): WeekEngineOutput {
  const { dates, dayInputs, settings, manualEvents, todos, dayPlans } = input;
  const conflicts: { date: string; message: string }[] = [];

  // ---- Hard layer: manual events (always) + formation (non-Sunday only) ----
  const layerByDate: Record<string, DayLayer> = {};
  for (const date of dates) {
    const dayStart = settings.sleep.wakeMinutes;
    const dayEnd = settings.sleep.sleepMinutes;
    const events = manualEvents.filter((e) => e.date === date);
    const occupied: Interval[] = events.map((e) => ({ start: e.startMinutes, end: e.endMinutes }));
    const formationBlocks: ScheduleBlock[] = [];

    if (!isSundayDate(date)) {
      const dayInput = dayInputs[date];
      if (dayInput.isFormationDay) {
        const duration =
          dayInput.formationHoursMinutes ?? settings.formation.endMinutes - settings.formation.startMinutes;
        const formationStart = clamp(settings.formation.startMinutes, dayStart, dayEnd);
        const formationEnd = clamp(formationStart + duration, dayStart, dayEnd);
        const transport = settings.formation.transportMinutes;
        const departure = clamp(formationStart - transport, dayStart, dayEnd);
        const arrival = clamp(formationEnd + transport, dayStart, dayEnd);

        if (departure < formationStart) {
          formationBlocks.push(
            mkBlock(date, departure, formationStart, "transport", "Transport to Formation", "engine")
          );
        }
        formationBlocks.push(
          mkBlock(date, formationStart, formationEnd, "formation", "Formation Cybersecurity", "engine")
        );
        if (formationEnd < arrival) {
          formationBlocks.push(mkBlock(date, formationEnd, arrival, "transport", "Transport Home", "engine"));
        }
        occupied.push({ start: departure, end: arrival });
      }
    }

    layerByDate[date] = { dayStart, dayEnd, formationBlocks, occupiedHard: mergeIntervals(occupied) };
  }

  // ---- Work + Study: template-driven per non-Sunday date; fixed for Sunday ----
  const workBlocksByDate: Record<string, TemplateBlock[]> = {};
  const studyBlocksByDate: Record<string, TemplateBlock[]> = {};
  const studyUsedByDate: Record<string, number> = {};

  for (const date of dates) {
    const layer = layerByDate[date];
    if (isSundayDate(date)) {
      studyUsedByDate[date] = SUNDAY_STUDY_MINUTES;
      continue;
    }
    const dayInput = dayInputs[date];
    const variant = dayPlans[date] ?? null;
    const workResult = computeWorkBlocks(
      dayInput,
      settings,
      layer.dayStart,
      layer.dayEnd,
      layer.occupiedHard,
      variant
    );
    if (workResult.conflict) conflicts.push({ date, message: workResult.conflict });
    workBlocksByDate[date] = workResult.blocks;

    const occupiedWithWork = mergeIntervals([
      ...layer.occupiedHard,
      ...workResult.blocks.map((b) => ({ start: b.start, end: b.end })),
    ]);
    const study = computeStudyBlocks(variant, occupiedWithWork);
    studyBlocksByDate[date] = study;
    studyUsedByDate[date] = study.reduce((s, b) => s + (b.end - b.start), 0);
  }

  const weeklyStudyTargetMinutes = Object.values(studyUsedByDate).reduce((a, b) => a + b, 0);

  // ---- Sport: 2h sessions, weekly cap, spaced with rest days ----
  const weeklySportTargetMinutes = settings.sport.weeklyTargetMinutes;
  const sessionMinutes = settings.sport.sessionMinutes;
  const sessionsNeeded = Math.floor(weeklySportTargetMinutes / Math.max(1, sessionMinutes));
  const sportUsedByDate: Record<string, number> = {};
  const sportActivityByDate: Record<string, string> = {};
  for (const date of dates) sportUsedByDate[date] = 0;
  const sundayDate = dates.find(isSundayDate);
  if (sundayDate) {
    sportUsedByDate[sundayDate] = SUNDAY_SPORT_MINUTES;
    sportActivityByDate[sundayDate] = "Sport";
  }

  const gapsAfterStudy: Record<string, Interval[]> = {};
  for (const date of dates) {
    const layer = layerByDate[date];
    if (isSundayDate(date)) {
      const occupied = mergeIntervals([
        ...layer.occupiedHard,
        ...SUNDAY_FIXED_TEMPLATE.map((t) => ({ start: t.start, end: t.end })),
      ]);
      gapsAfterStudy[date] = freeGaps(occupied, layer.dayStart, layer.dayEnd);
      continue;
    }
    const occupied = mergeIntervals([
      ...layer.occupiedHard,
      ...workBlocksByDate[date].map((b) => ({ start: b.start, end: b.end })),
      ...studyBlocksByDate[date].map((b) => ({ start: b.start, end: b.end })),
    ]);
    gapsAfterStudy[date] = freeGaps(occupied, layer.dayStart, layer.dayEnd);
  }

  let sessionsPlaced = sundayDate ? 1 : 0; // Sunday's fixed session already counts toward the weekly quota
  let activityCursor = 0;
  const placeSport = (date: string, allowConsecutive: boolean, lastSportIdx: { v: number }, idx: number) => {
    if (sessionsPlaced >= sessionsNeeded) return false;
    if (dayInputs[date].sportOptOut) return false;
    if (!allowConsecutive && idx - lastSportIdx.v < SPORT_REST_GAP_DAYS) return false;
    if (sportUsedByDate[date] > 0) return false;
    const gaps = gapsAfterStudy[date];
    const fit = findGapFitting(gaps, sessionMinutes);
    if (!fit) return false;
    sportUsedByDate[date] = sessionMinutes;
    sportActivityByDate[date] = settings.sport.activities[activityCursor % settings.sport.activities.length];
    activityCursor++;
    sessionsPlaced++;
    lastSportIdx.v = idx;
    const placed = { start: fit.start, end: fit.start + sessionMinutes };
    gapsAfterStudy[date] = subtractFromGaps(gapsAfterStudy[date], placed);
    return true;
  };

  const lastSportIdx = { v: -99 };
  dates.forEach((date, idx) => placeSport(date, false, lastSportIdx, idx));
  const lastSportIdx2 = { v: -99 };
  dates.forEach((date, idx) => placeSport(date, true, lastSportIdx2, idx));

  // ---- Preparation ----
  const prepByDate: Record<string, Interval | null> = {};
  for (const date of dates) {
    if (isSundayDate(date)) {
      prepByDate[date] = null;
      continue;
    }
    const gaps = gapsAfterStudy[date];
    const layer = layerByDate[date];
    const firstGap = gaps
      .slice()
      .sort((a, b) => a.start - b.start)
      .find((g) => g.start < layer.dayStart + 4 * 60); // within 4h of wake
    if (firstGap) {
      const dur = Math.min(settings.preparation.durationMinutes, firstGap.end - firstGap.start);
      if (dur >= 10) {
        const interval = { start: firstGap.start, end: firstGap.start + dur };
        prepByDate[date] = interval;
        gapsAfterStudy[date] = subtractFromGaps(gaps, interval);
      } else {
        prepByDate[date] = null;
      }
    } else {
      prepByDate[date] = null;
    }
  }

  // ---- Todos: greedy across the week, each todo scheduled at most once ----
  const todoBlocksByDate: Record<string, ScheduleBlock[]> = {};
  for (const date of dates) todoBlocksByDate[date] = [];
  const eligibleTodos = todos
    .filter((t) => !t.completed && t.autoSchedule && t.estimatedMinutes)
    .sort((a, b) => {
      const prioRank = { high: 0, medium: 1, low: 2 };
      if (prioRank[a.priority] !== prioRank[b.priority]) {
        return prioRank[a.priority] - prioRank[b.priority];
      }
      const ad = a.deadline ?? "9999-12-31";
      const bd = b.deadline ?? "9999-12-31";
      return ad.localeCompare(bd);
    });

  for (const todo of eligibleTodos) {
    for (const date of dates) {
      if (isSundayDate(date)) continue; // Sunday's fixed template has no room for auto-scheduled todos
      if (todo.deadline && date > todo.deadline) continue;
      const gaps = gapsAfterStudy[date];
      const fit = findGapFitting(gaps, todo.estimatedMinutes!);
      if (!fit) continue;
      const interval = { start: fit.start, end: fit.start + todo.estimatedMinutes! };
      todoBlocksByDate[date].push(
        mkBlock(date, interval.start, interval.end, "todo", todo.title, "todo", {
          todoId: todo.id,
          subtitle: todo.category,
        })
      );
      gapsAfterStudy[date] = subtractFromGaps(gaps, interval);
      break;
    }
  }

  // ---- French ----
  const frenchByDate: Record<string, Interval | null> = {};
  for (const date of dates) {
    if (isSundayDate(date)) {
      frenchByDate[date] = null;
      continue;
    }
    const gaps = gapsAfterStudy[date];
    const fit = findGapFitting(gaps, settings.french.sessionMinutes);
    if (fit) {
      const interval = { start: fit.start, end: fit.start + settings.french.sessionMinutes };
      frenchByDate[date] = interval;
      gapsAfterStudy[date] = subtractFromGaps(gaps, interval);
    } else {
      frenchByDate[date] = null;
    }
  }

  // ---- Assemble final blocks per day ----
  const blocksByDate: Record<string, ScheduleBlock[]> = {};
  let weeklyWorkMinutes = 0;
  let weeklyFrenchMinutes = 0;
  let weeklyFreeMinutes = 0;

  for (const date of dates) {
    const layer = layerByDate[date];
    const events = manualEvents.filter((e) => e.date === date);

    if (isSundayDate(date)) {
      const clipped = clipTemplateToOccupied(SUNDAY_FIXED_TEMPLATE, layer.occupiedHard);
      const blocks: ScheduleBlock[] = [...events];
      for (const seg of clipped) {
        blocks.push(mkBlock(date, seg.start, seg.end, seg.category, seg.title, "engine"));
      }
      const finalOccupied = mergeIntervals([
        ...layer.occupiedHard,
        ...clipped.map((s) => ({ start: s.start, end: s.end })),
      ]);
      const remaining = freeGaps(finalOccupied, layer.dayStart, layer.dayEnd);
      for (const g of remaining) {
        if (g.end - g.start >= 5) {
          blocks.push(mkBlock(date, g.start, g.end, "free", "Free Time", "engine"));
          weeklyFreeMinutes += g.end - g.start;
        }
      }
      blocksByDate[date] = blocks.sort((a, b) => a.startMinutes - b.startMinutes);
      continue;
    }

    const blocks: ScheduleBlock[] = [...layer.formationBlocks, ...events];

    for (const b of workBlocksByDate[date]) {
      blocks.push(mkBlock(date, b.start, b.end, b.category, b.title, "engine"));
      weeklyWorkMinutes += b.end - b.start;
    }
    for (const b of studyBlocksByDate[date]) {
      blocks.push(mkBlock(date, b.start, b.end, b.category, b.title, "engine"));
    }

    const prep = prepByDate[date];
    if (prep) {
      const nextIsWork = workBlocksByDate[date].some((b) => Math.abs(b.start - prep.end) < 90);
      const nextIsFormation = layer.formationBlocks.some(
        (b) => b.category === "formation" && Math.abs(b.startMinutes - prep.end) < 90
      );
      const label = nextIsFormation ? "Study preparation" : nextIsWork ? "Work preparation" : "General preparation";
      blocks.push(mkBlock(date, prep.start, prep.end, "preparation", label, "engine"));
    }

    if (sportUsedByDate[date] > 0) {
      const gapsForSport = freeGaps(
        mergeIntervals([
          ...layer.occupiedHard,
          ...workBlocksByDate[date].map((b) => ({ start: b.start, end: b.end })),
          ...studyBlocksByDate[date].map((b) => ({ start: b.start, end: b.end })),
          ...(prep ? [prep] : []),
        ]),
        layer.dayStart,
        layer.dayEnd
      );
      const fit = findGapFitting(gapsForSport, sportUsedByDate[date]);
      if (fit) {
        blocks.push(
          mkBlock(
            date,
            fit.start,
            fit.start + sportUsedByDate[date],
            "sport",
            `Sport — ${sportActivityByDate[date] ?? "Training"}`,
            "engine"
          )
        );
      }
    }

    blocks.push(...todoBlocksByDate[date]);

    const french = frenchByDate[date];
    if (french) {
      blocks.push(mkBlock(date, french.start, french.end, "french", "Français", "engine"));
      weeklyFrenchMinutes += french.end - french.start;
    }

    const finalOccupied = mergeIntervals(blocks.map((b) => ({ start: b.startMinutes, end: b.endMinutes })));
    const remaining = freeGaps(finalOccupied, layer.dayStart, layer.dayEnd);
    for (const g of remaining) {
      if (g.end - g.start >= 5) {
        blocks.push(mkBlock(date, g.start, g.end, "free", "Free Time", "engine"));
        weeklyFreeMinutes += g.end - g.start;
      }
    }

    blocksByDate[date] = blocks.sort((a, b) => a.startMinutes - b.startMinutes);
  }

  const weeklySportUsedMinutes = Object.values(sportUsedByDate).reduce((a, b) => a + b, 0);
  const weeklyWorkTargetMinutes = dates.reduce((sum, date) => {
    if (isSundayDate(date)) return sum;
    const di = dayInputs[date];
    if (di.workOptOut) return sum;
    if (di.workOverrideMinutes != null) return sum + di.workOverrideMinutes;
    const variant = dayPlans[date] ?? null;
    return sum + (variant ? weeklyPlanWorkMinutesPerDay(variant) : 0);
  }, 0);

  return {
    blocksByDate,
    studyUsedByDate,
    sportUsedByDate,
    weeklyStudyTargetMinutes,
    weeklySportTargetMinutes,
    weeklySportUsedMinutes,
    weeklyWorkMinutes,
    weeklyWorkTargetMinutes,
    weeklyFrenchMinutes,
    weeklyFreeMinutes,
    conflicts,
  };
}

export function weekdayLabelForDate(dateIndex: number): Weekday {
  return WEEKDAYS[dateIndex];
}
