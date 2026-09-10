"use client";

import { useMemo } from "react";
import { useNow } from "@/hooks/useNow";
import { useDaySchedule } from "@/hooks/useSchedule";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { todayKey, weekDates, weekStartKey, dateKey } from "@/lib/time";
import { computeDailyStats, currentAndNextBlock, dayProgress } from "@/lib/scheduler/stats";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { CurrentActivityCard } from "@/components/dashboard/CurrentActivityCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickSetupCard } from "@/components/dashboard/QuickSetupCard";
import { WeeklyOverviewCard } from "@/components/dashboard/WeeklyOverviewCard";
import { WeeklyStudyChart } from "@/components/dashboard/WeeklyStudyChart";
import { TodoPreviewCard } from "@/components/dashboard/TodoPreviewCard";
import { TimelineList } from "@/components/dashboard/TimelineList";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function DashboardPage() {
  const date = todayKey();
  const now = useNow();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const { blocks, week } = useDaySchedule(date);
  const getDayInput = usePlannerStore((s) => s.getDayInput);
  const days = usePlannerStore((s) => s.days);
  const settings = usePlannerStore((s) => s.settings);
  const todos = usePlannerStore((s) => s.todos);
  // getDayInput builds a fresh default object when there's no stored entry —
  // memoize so the identity is stable across renders (avoids re-render loops
  // in Zustand selectors and unnecessary child re-renders).
  const dayInput = useMemo(
    () => getDayInput(date),
    // getDayInput closes over the store's days/settings via get(), so both
    // must stay in the deps even though the linter can't see that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getDayInput, date, days, settings]
  );

  const stats = computeDailyStats(date, blocks);
  const { current, next } = currentAndNextBlock(blocks, nowMin);
  const progress = dayProgress(nowMin, settings.sleep.wakeMinutes, settings.sleep.sleepMinutes);

  const tasksTotal = todos.length;
  const tasksDone = todos.filter((t) => t.completed).length;
  const weekDatesList = weekDates(weekStartKey(new Date(date + "T00:00:00"))).map(dateKey);

  return (
    <div className="pt-2">
      <GreetingHeader dateKey={date} />

      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-[11px] text-[var(--text-faint)]">
          <span>Day progress</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} max={100} color="var(--accent)" height={6} />
      </div>

      {/* Single column on mobile (natural DOM order); a balanced 2-column
          dashboard on desktop via explicit grid placement below. */}
      <div className="lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-x-6">
        <div className="lg:col-start-1 lg:row-start-1">
          <CurrentActivityCard current={current} next={next} nowMin={nowMin} />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <StatsGrid
            workMinutes={stats.workMinutes}
            studyMinutes={stats.studyMinutes}
            freeMinutes={stats.freeMinutes}
            tasksDone={tasksDone}
            tasksTotal={tasksTotal}
          />
        </div>

        <div className="lg:col-start-2 lg:row-start-1">
          <QuickSetupCard date={date} dayInput={dayInput} />
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <WeeklyOverviewCard week={week} />
        </div>

        <div className="lg:col-start-2 lg:row-start-3">
          <WeeklyStudyChart dates={weekDatesList} studyByDate={week.studyUsedByDate} />
        </div>

        <div className="lg:col-start-2 lg:row-start-4">
          <TodoPreviewCard todayKey={date} />
        </div>

        <div className="mb-2 lg:col-start-1 lg:row-start-3">
          <h3 className="mb-3 text-sm font-semibold tracking-tight">Today&apos;s Timeline</h3>
          <TimelineList blocks={blocks} nowMin={nowMin} />
        </div>
      </div>
    </div>
  );
}
