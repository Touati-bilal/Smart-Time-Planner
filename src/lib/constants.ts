import { BlockCategory, UserSettings, Weekday, WEEKDAYS } from "./types";

export const APP_NAME = "PLANIN";

export const CATEGORY_META: Record<
  BlockCategory,
  { label: string; color: string; bg: string; border: string; glow: string }
> = {
  sleep: {
    label: "Sleep",
    color: "#8b93a8",
    bg: "rgba(139,147,168,0.12)",
    border: "rgba(139,147,168,0.35)",
    glow: "rgba(139,147,168,0.25)",
  },
  formation: {
    label: "Formation",
    color: "#7c5cff",
    bg: "rgba(124,92,255,0.14)",
    border: "rgba(124,92,255,0.45)",
    glow: "rgba(124,92,255,0.35)",
  },
  transport: {
    label: "Transport",
    color: "#5c8aff",
    bg: "rgba(92,138,255,0.12)",
    border: "rgba(92,138,255,0.4)",
    glow: "rgba(92,138,255,0.3)",
  },
  work: {
    label: "Work",
    color: "#00c2a8",
    bg: "rgba(0,194,168,0.13)",
    border: "rgba(0,194,168,0.45)",
    glow: "rgba(0,194,168,0.3)",
  },
  study: {
    label: "Cybersecurity Study",
    color: "#ff5c8a",
    bg: "rgba(255,92,138,0.13)",
    border: "rgba(255,92,138,0.45)",
    glow: "rgba(255,92,138,0.3)",
  },
  preparation: {
    label: "Preparation",
    color: "#ffb454",
    bg: "rgba(255,180,84,0.13)",
    border: "rgba(255,180,84,0.45)",
    glow: "rgba(255,180,84,0.3)",
  },
  sport: {
    label: "Sport",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.13)",
    border: "rgba(74,222,128,0.45)",
    glow: "rgba(74,222,128,0.3)",
  },
  french: {
    label: "Français",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.13)",
    border: "rgba(56,189,248,0.45)",
    glow: "rgba(56,189,248,0.3)",
  },
  todo: {
    label: "Task",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.13)",
    border: "rgba(244,114,182,0.45)",
    glow: "rgba(244,114,182,0.3)",
  },
  free: {
    label: "Free Time",
    color: "#64748b",
    bg: "rgba(100,116,139,0.08)",
    border: "rgba(100,116,139,0.25)",
    glow: "rgba(100,116,139,0.15)",
  },
  break: {
    label: "Break",
    color: "#d4a373",
    bg: "rgba(212,163,115,0.13)",
    border: "rgba(212,163,115,0.4)",
    glow: "rgba(212,163,115,0.25)",
  },
  custom: {
    label: "Event",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.13)",
    border: "rgba(192,132,252,0.45)",
    glow: "rgba(192,132,252,0.3)",
  },
};

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const DEFAULT_SETTINGS: UserSettings = {
  work: {
    defaultWorkHoursMinutes: 4 * 60,
    minWorkHoursMinutes: 4 * 60,
    maxWorkHoursMinutes: 6 * 60,
    workStartMinutes: 9 * 60,
  },
  formation: {
    startMinutes: 8 * 60 + 30,
    endMinutes: 18 * 60 + 30,
    transportMinutes: 60,
    defaultFormationDays: [],
  },
  sleep: {
    wakeMinutes: 6 * 60,
    sleepMinutes: 23 * 60,
  },
  sport: {
    weeklyTargetMinutes: 8 * 60,
    sessionMinutes: 2 * 60,
    activities: ["Laufen", "Radfahren", "Schwimmen", "Sada / Randonnée", "HIIT"],
  },
  french: {
    sessionMinutes: 15,
  },
  preparation: {
    durationMinutes: 30,
    types: ["Work preparation", "Study preparation", "General preparation"],
  },
};

export { WEEKDAYS };
