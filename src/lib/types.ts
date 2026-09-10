// Core data model for the Smart Time Planner.
// All times within a day are stored as minutes-from-midnight (0-1439) integers.
// Dates are stored as ISO "yyyy-MM-dd" strings.

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const WEEKDAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/** Categories drive color, icon and scheduling priority (lower = higher priority). */
export type BlockCategory =
  | "sleep"
  | "formation"
  | "transport"
  | "work"
  | "study"
  | "preparation"
  | "sport"
  | "french"
  | "todo"
  | "free"
  | "break"
  | "custom";

export const CATEGORY_PRIORITY: Record<BlockCategory, number> = {
  sleep: 0,
  formation: 1,
  transport: 2,
  work: 3,
  study: 4,
  preparation: 5,
  sport: 6,
  french: 7,
  todo: 7,
  free: 9,
  break: 2,
  custom: 3,
};

export interface WorkSettings {
  defaultWorkHoursMinutes: number; // default 4h
  minWorkHoursMinutes: number; // 4h
  maxWorkHoursMinutes: number; // 6h
  workStartMinutes: number; // preferred start time, e.g. 09:00
}

export interface FormationSettings {
  startMinutes: number; // 08:30
  endMinutes: number; // 18:30
  transportMinutes: number; // 60
  defaultFormationDays: Weekday[];
}

export interface SleepSettings {
  wakeMinutes: number; // 06:00
  sleepMinutes: number; // 23:00
}

export interface SportSettings {
  weeklyTargetMinutes: number; // 8h = 480
  sessionMinutes: number; // 2h = 120
  activities: string[];
}

export interface FrenchSettings {
  sessionMinutes: number; // 15
}

export interface PreparationSettings {
  durationMinutes: number; // 30
  types: string[]; // "Work preparation" | "Study preparation" | "General preparation"
}

export interface UserSettings {
  work: WorkSettings;
  formation: FormationSettings;
  sleep: SleepSettings;
  sport: SportSettings;
  french: FrenchSettings;
  preparation: PreparationSettings;
}

/**
 * Per-day editable inputs — occasional exceptions layered on top of the
 * week's chosen Plan template (or Sunday's fixed schedule). Study is fully
 * determined by the template; only formation, work, and sport are
 * overridable per day.
 */
export interface DayInput {
  date: string; // yyyy-MM-dd
  isFormationDay: boolean;
  formationHoursMinutes: number | null; // null = use settings default full block
  /** Skip the plan template's work blocks entirely for this day. */
  workOptOut: boolean;
  /** Replace the plan template's work blocks with one dynamic block of this
   *  duration for this day. null = use the template's work blocks as-is. */
  workOverrideMinutes: number | null;
  sportOptOut: boolean;
  notes?: string;
}

/** A single scheduled item on the timeline, produced either by the engine or manually. */
export interface ScheduleBlock {
  id: string;
  date: string; // yyyy-MM-dd
  startMinutes: number;
  endMinutes: number;
  category: BlockCategory;
  title: string;
  subtitle?: string;
  locked?: boolean; // manually placed / user-edited, engine should not move it
  source: "engine" | "manual" | "todo";
  todoId?: string;
  color?: string; // override color
}

export type TodoPriority = "low" | "medium" | "high";
export type TodoCategory =
  | "Cybersecurity"
  | "Work"
  | "Deutsch"
  | "Français"
  | "Sport"
  | "Personal"
  | "Other";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  category: TodoCategory;
  deadline: string | null; // ISO date yyyy-MM-dd
  estimatedMinutes: number | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  autoSchedule: boolean;
  scheduledDate: string | null;
}

export interface DailyStats {
  date: string;
  workMinutes: number;
  studyMinutes: number;
  sportMinutes: number;
  frenchMinutes: number;
  freeMinutes: number;
  totalScheduledMinutes: number;
}
