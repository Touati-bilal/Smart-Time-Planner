// Fixed literal weekly-plan templates. A user picks one Plan (A-E), and for
// plans with multiple day layouts, one Option — that single choice governs
// every non-Sunday day of the week identically. Sunday always runs its own
// separate fixed template, defined here too, unaffected by the weekly plan.
import { BlockCategory } from "../types";

export type PlanId = "A" | "B" | "C" | "D" | "E";
export const PLAN_IDS: PlanId[] = ["A", "B", "C", "D", "E"];

/** A plan letter maps to one or more selectable day-layout variants. */
export type WeeklyPlanVariant = "A" | "B1" | "B2" | "C1" | "C2" | "D1" | "D2" | "D3" | "D4" | "E";

export const PLAN_OPTIONS: Record<PlanId, WeeklyPlanVariant[]> = {
  A: ["A"],
  B: ["B1", "B2"],
  C: ["C1", "C2"],
  D: ["D1", "D2", "D3", "D4"],
  E: ["E"],
};

export function planIdOfVariant(variant: WeeklyPlanVariant): PlanId {
  return variant[0] as PlanId;
}

export interface TemplateBlock {
  start: number;
  end: number;
  category: BlockCategory;
  title: string;
}

// Times are minutes-from-midnight. Derived from the user's literal weekly
// availability spec — every option's study total matches its plan letter's
// target exactly (A=10h, B=7h30, C=5h, D=2h30, E=0h); only the work
// arrangement differs between a plan's options.
export const WEEKLY_PLAN_TEMPLATES: Record<WeeklyPlanVariant, TemplateBlock[]> = {
  A: [
    { start: 360, end: 450, category: "work", title: "Work" }, // 06:00-07:30
    { start: 510, end: 1110, category: "study", title: "Cybersecurity Study" }, // 08:30-18:30
    { start: 1200, end: 1350, category: "work", title: "Work" }, // 20:00-22:30
  ],
  B1: [
    { start: 360, end: 540, category: "work", title: "Work" }, // 06:00-09:00
    { start: 660, end: 1110, category: "study", title: "Cybersecurity Study" }, // 11:00-18:30
    { start: 1200, end: 1290, category: "work", title: "Work" }, // 20:00-21:30
  ],
  B2: [
    { start: 360, end: 420, category: "work", title: "Work" }, // 06:00-07:00
    { start: 510, end: 660, category: "study", title: "Cybersecurity Study" }, // 08:30-11:00
    { start: 690, end: 780, category: "work", title: "Work" }, // 11:30-13:00
    { start: 810, end: 1110, category: "study", title: "Cybersecurity Study" }, // 13:30-18:30
    { start: 1170, end: 1200, category: "work", title: "Work" }, // 19:30-20:00
  ],
  C1: [
    { start: 510, end: 810, category: "study", title: "Cybersecurity Study" }, // 08:30-13:30
    { start: 900, end: 1170, category: "work", title: "Work" }, // 15:00-19:30
  ],
  C2: [
    { start: 480, end: 720, category: "work", title: "Work" }, // 08:00-12:00
    { start: 810, end: 1110, category: "study", title: "Cybersecurity Study" }, // 13:30-18:30
  ],
  D1: [
    { start: 510, end: 660, category: "study", title: "Cybersecurity Study" }, // 08:30-11:00
    { start: 720, end: 960, category: "work", title: "Work" }, // 12:00-16:00
  ],
  D2: [
    { start: 360, end: 600, category: "work", title: "Work" }, // 06:00-10:00
    { start: 660, end: 810, category: "study", title: "Cybersecurity Study" }, // 11:00-13:30
  ],
  D3: [
    { start: 480, end: 750, category: "work", title: "Work" }, // 08:00-12:30
    { start: 810, end: 960, category: "study", title: "Cybersecurity Study" }, // 13:30-16:00
  ],
  D4: [
    { start: 480, end: 750, category: "work", title: "Work" }, // 08:00-12:30
    { start: 960, end: 1110, category: "study", title: "Cybersecurity Study" }, // 16:00-18:30
  ],
  E: [
    { start: 480, end: 840, category: "work", title: "Work" }, // 08:00-14:00
  ],
};

export const SUNDAY_FIXED_TEMPLATE: TemplateBlock[] = [
  { start: 390, end: 510, category: "sport", title: "Sport" }, // 06:30-08:30
  { start: 570, end: 720, category: "study", title: "Cybersecurity Study" }, // 09:30-12:00
  { start: 720, end: 750, category: "break", title: "Break" }, // 12:00-12:30
  { start: 750, end: 930, category: "study", title: "Cybersecurity Study" }, // 12:30-15:30
  { start: 930, end: 960, category: "break", title: "Break" }, // 15:30-16:00
  { start: 960, end: 1200, category: "study", title: "Cybersecurity Study" }, // 16:00-20:00
];

function sumByCategory(blocks: TemplateBlock[], category: BlockCategory): number {
  return blocks.filter((b) => b.category === category).reduce((s, b) => s + (b.end - b.start), 0);
}

export const SUNDAY_STUDY_MINUTES = sumByCategory(SUNDAY_FIXED_TEMPLATE, "study");
export const SUNDAY_SPORT_MINUTES = sumByCategory(SUNDAY_FIXED_TEMPLATE, "sport");

export function weeklyPlanStudyMinutesPerDay(variant: WeeklyPlanVariant): number {
  return sumByCategory(WEEKLY_PLAN_TEMPLATES[variant], "study");
}
export function weeklyPlanWorkMinutesPerDay(variant: WeeklyPlanVariant): number {
  return sumByCategory(WEEKLY_PLAN_TEMPLATES[variant], "work");
}
