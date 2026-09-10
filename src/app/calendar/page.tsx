"use client";

import { useMemo, useState } from "react";
import { addDays, addWeeks, format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Sparkles, Pencil } from "lucide-react";
import { useWeekSchedule } from "@/hooks/useSchedule";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { dateKey, todayKey, weekDates, weekStartKey } from "@/lib/time";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { EventModal, CalendarModalState } from "@/components/calendar/EventModal";
import { WeeklyPlanEditor } from "@/components/calendar/WeeklyPlanEditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ScheduleBlock } from "@/lib/types";
import { motion } from "framer-motion";

type ViewMode = "week" | "day";

export default function CalendarPage() {
  const [mode, setMode] = useState<ViewMode>("week");
  const [anchorDate, setAnchorDate] = useState(todayKey());
  const [modalState, setModalState] = useState<CalendarModalState>(null);
  const [planEditorOpen, setPlanEditorOpen] = useState(false);
  const settings = usePlannerStore((s) => s.settings);
  const dayPlansMap = usePlannerStore((s) => s.dayPlans);

  const weekStart = useMemo(() => weekStartKey(parseISO(anchorDate)), [anchorDate]);
  const week = useWeekSchedule(weekStart);
  const dates = useMemo(() => weekDates(weekStart).map(dateKey), [weekStart]);
  const plannableDates = useMemo(() => dates.slice(0, 6), [dates]); // Monday-Saturday
  const plannedCount = useMemo(
    () => plannableDates.filter((d) => dayPlansMap[d]).length,
    [plannableDates, dayPlansMap]
  );

  const rangeStart = settings.sleep.wakeMinutes;
  const rangeEnd = settings.sleep.sleepMinutes;

  const goPrev = () => {
    if (mode === "week") setAnchorDate(dateKey(addWeeks(parseISO(anchorDate), -1)));
    else setAnchorDate(dateKey(addDays(parseISO(anchorDate), -1)));
  };
  const goNext = () => {
    if (mode === "week") setAnchorDate(dateKey(addWeeks(parseISO(anchorDate), 1)));
    else setAnchorDate(dateKey(addDays(parseISO(anchorDate), 1)));
  };
  const goToday = () => setAnchorDate(todayKey());

  const handleSelect = (block: ScheduleBlock) => setModalState({ type: "view", block });

  return (
    <div className="pt-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] p-1">
          {(["week", "day"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                mode === m ? "bg-[var(--accent)] text-white" : "text-[var(--text-dim)]"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={goToday}>
          Today
        </Button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={goPrev}
          className="rounded-full p-1.5 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
        >
          <ChevronLeft size={18} />
        </button>
        <motion.span
          key={mode === "week" ? weekStart : anchorDate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium"
        >
          {mode === "week"
            ? `${format(parseISO(dates[0]), "MMM d")} – ${format(parseISO(dates[6]), "MMM d")}`
            : format(parseISO(anchorDate), "EEEE, MMM d")}
        </motion.span>
        <button
          onClick={goNext}
          className="rounded-full p-1.5 text-[var(--text-dim)] hover:bg-[var(--surface-2)]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {plannedCount > 0 ? (
        <button
          onClick={() => setPlanEditorOpen(true)}
          className="mb-3 flex w-full items-center justify-between rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--surface-2)]"
        >
          <span className="flex items-center gap-2 text-xs font-medium">
            <Sparkles size={14} className="text-[var(--accent)]" />
            {plannedCount === plannableDates.length
              ? "Week fully planned"
              : `${plannedCount}/${plannableDates.length} days planned`}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--accent)]">
            <Pencil size={12} /> Edit
          </span>
        </button>
      ) : (
        <Card strong className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">This week has no plan yet</p>
            <p className="text-[11px] text-[var(--text-faint)]">
              Assign a Plan to each day, Monday–Saturday. Sunday is always fixed.
            </p>
          </div>
          <Button size="sm" variant="primary" onClick={() => setPlanEditorOpen(true)} className="shrink-0">
            Set Up Week
          </Button>
        </Card>
      )}

      {mode === "week" ? (
        <WeekView
          dates={dates}
          blocksByDate={week.blocksByDate}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onSelect={handleSelect}
          onDayHeaderClick={(date) => {
            setAnchorDate(date);
            setMode("day");
          }}
        />
      ) : (
        <DayView
          date={anchorDate}
          blocks={week.blocksByDate[anchorDate] ?? []}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onSelect={handleSelect}
        />
      )}

      <button
        onClick={() =>
          setModalState({
            type: "create",
            date: mode === "day" ? anchorDate : todayKey(),
          })
        }
        className="fixed z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_10px_30px_rgba(124,92,255,0.5)] active:scale-95 right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(6rem+var(--safe-bottom))] lg:bottom-[calc(1.5rem+var(--safe-bottom))]"
        aria-label="Add event"
      >
        <Plus size={22} />
      </button>

      <EventModal state={modalState} onClose={() => setModalState(null)} />

      <WeeklyPlanEditor
        open={planEditorOpen}
        onClose={() => setPlanEditorOpen(false)}
        dates={plannableDates}
      />
    </div>
  );
}
