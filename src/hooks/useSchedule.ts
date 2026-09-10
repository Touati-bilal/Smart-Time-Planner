"use client";

import { useMemo } from "react";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { generateWeekSchedule, WeekEngineOutput } from "@/lib/scheduler/engine";
import { weekDates, dateKey } from "@/lib/time";
import { DayInput } from "@/lib/types";
import { WeeklyPlanVariant } from "@/lib/scheduler/weeklyPlanTemplates";

export function useWeekSchedule(weekStart: string): WeekEngineOutput {
  const settings = usePlannerStore((s) => s.settings);
  const days = usePlannerStore((s) => s.days);
  const dayPlansStore = usePlannerStore((s) => s.dayPlans);
  const todos = usePlannerStore((s) => s.todos);
  const manualEvents = usePlannerStore((s) => s.manualEvents);
  const getDayInput = usePlannerStore((s) => s.getDayInput);
  const getDayPlan = usePlannerStore((s) => s.getDayPlan);

  return useMemo(() => {
    const dates = weekDates(weekStart).map(dateKey);
    const dayInputs: Record<string, DayInput> = {};
    const dayPlans: Record<string, WeeklyPlanVariant | null> = {};
    for (const date of dates) {
      dayInputs[date] = getDayInput(date);
      dayPlans[date] = getDayPlan(date);
    }
    return generateWeekSchedule({
      weekStart,
      dates,
      dayPlans,
      dayInputs,
      settings,
      manualEvents,
      todos,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, settings, days, dayPlansStore, todos, manualEvents]);
}

export function useDaySchedule(date: string) {
  const weekStart = useMemo(() => {
    const d = new Date(date + "T00:00:00");
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return dateKey(d);
  }, [date]);
  const week = useWeekSchedule(weekStart);
  return {
    blocks: week.blocksByDate[date] ?? [],
    week,
  };
}
