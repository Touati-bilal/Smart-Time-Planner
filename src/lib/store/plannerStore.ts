import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import {
  DayInput,
  ScheduleBlock,
  Todo,
  UserSettings,
  Weekday,
} from "../types";
import { WeeklyPlanVariant } from "../scheduler/weeklyPlanTemplates";
import { DEFAULT_SETTINGS } from "../constants";
import { weekdayOf, weekStartKey } from "../time";

const WEEKDAY_ORDER: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function buildDefaultDayInput(date: string, settings: UserSettings): DayInput {
  const wd = WEEKDAY_ORDER[weekdayOf(date)];
  return {
    date,
    isFormationDay: settings.formation.defaultFormationDays.includes(wd),
    formationHoursMinutes: null,
    workOptOut: false,
    workOverrideMinutes: null,
    sportOptOut: false,
  };
}

interface PlannerState {
  settings: UserSettings;
  days: Record<string, DayInput>;
  /** The chosen Plan+Option (e.g. "B2") for each individual date, Mon-Sat. */
  dayPlans: Record<string, WeeklyPlanVariant>;
  todos: Todo[];
  manualEvents: ScheduleBlock[];
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;

  updateSettings: (partial: Partial<UserSettings>) => void;
  getDayInput: (date: string) => DayInput;
  updateDayInput: (date: string, partial: Partial<DayInput>) => void;
  /** null means this date has no plan assigned yet. */
  getDayPlan: (date: string) => WeeklyPlanVariant | null;
  setDayPlan: (date: string, variant: WeeklyPlanVariant) => void;

  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "completed" | "completedAt">) => string;
  updateTodo: (id: string, partial: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoComplete: (id: string) => void;

  addManualEvent: (event: Omit<ScheduleBlock, "id">) => string;
  updateManualEvent: (id: string, partial: Partial<ScheduleBlock>) => void;
  deleteManualEvent: (id: string) => void;
  getManualEventsForDate: (date: string) => ScheduleBlock[];
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      days: {},
      dayPlans: {},
      todos: [],
      manualEvents: [],
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),

      getDayInput: (date) => {
        const existing = get().days[date];
        if (existing) return existing;
        return buildDefaultDayInput(date, get().settings);
      },

      updateDayInput: (date, partial) => {
        const current = get().getDayInput(date);
        set((state) => ({
          days: { ...state.days, [date]: { ...current, ...partial, date } },
        }));
      },

      getDayPlan: (date) => get().dayPlans[date] ?? null,

      setDayPlan: (date, variant) =>
        set((state) => ({
          dayPlans: { ...state.dayPlans, [date]: variant },
        })),

      addTodo: (todo) => {
        const id = uuid();
        const newTodo: Todo = {
          ...todo,
          id,
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ todos: [newTodo, ...state.todos] }));
        return id;
      },

      updateTodo: (id, partial) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...partial } : t)),
        })),

      deleteTodo: (id) =>
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),

      toggleTodoComplete: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : null,
                }
              : t
          ),
        })),

      addManualEvent: (event) => {
        const id = uuid();
        set((state) => ({
          manualEvents: [...state.manualEvents, { ...event, id }],
        }));
        return id;
      },

      updateManualEvent: (id, partial) =>
        set((state) => ({
          manualEvents: state.manualEvents.map((e) =>
            e.id === id ? { ...e, ...partial } : e
          ),
        })),

      deleteManualEvent: (id) =>
        set((state) => ({
          manualEvents: state.manualEvents.filter((e) => e.id !== id),
        })),

      getManualEventsForDate: (date) =>
        get().manualEvents.filter((e) => e.date === date),
    }),
    {
      name: "chronos-planner-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        settings: state.settings,
        days: state.days,
        dayPlans: state.dayPlans,
        todos: state.todos,
        manualEvents: state.manualEvents,
      }),
    }
  )
);

export function weekStartFor(date: string): string {
  return weekStartKey(new Date(date + "T00:00:00"));
}
