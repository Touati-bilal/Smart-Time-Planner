"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { usePlannerStore } from "@/lib/store/plannerStore";
import {
  PLAN_IDS,
  PLAN_OPTIONS,
  PlanId,
  WEEKLY_PLAN_TEMPLATES,
  WeeklyPlanVariant,
  planIdOfVariant,
  weeklyPlanStudyMinutesPerDay,
  weeklyPlanWorkMinutesPerDay,
} from "@/lib/scheduler/weeklyPlanTemplates";
import { minutesToDuration, minutesToTime } from "@/lib/time";

const PLAN_TITLES: Record<PlanId, string> = {
  A: "Plan A",
  B: "Plan B",
  C: "Plan C",
  D: "Plan D",
  E: "Plan E",
};

function PlanSummary({ variant }: { variant: WeeklyPlanVariant }) {
  const study = weeklyPlanStudyMinutesPerDay(variant);
  const work = weeklyPlanWorkMinutesPerDay(variant);
  return (
    <p className="text-[11px] text-[var(--text-faint)]">
      {study > 0 ? `${minutesToDuration(study)} study` : "No study"} · {minutesToDuration(work)} work
    </p>
  );
}

type View = { step: "list" } | { step: "plan"; date: string } | { step: "option"; date: string; plan: PlanId };

/** Assigns a Plan+Option to each individual day of the week (Monday-Saturday).
 *  Sunday is never editable here — it always keeps its own fixed schedule. */
export function WeeklyPlanEditor({
  open,
  onClose,
  dates,
}: {
  open: boolean;
  onClose: () => void;
  /** The 6 non-Sunday dates for this week, Monday-Saturday. */
  dates: string[];
}) {
  const [view, setView] = useState<View>({ step: "list" });
  const dayPlansMap = usePlannerStore((s) => s.dayPlans);
  const setDayPlan = usePlannerStore((s) => s.setDayPlan);

  const handleClose = () => {
    setView({ step: "list" });
    onClose();
  };

  const title =
    view.step === "list"
      ? "Weekly Plan"
      : view.step === "plan"
      ? `${format(parseISO(view.date), "EEEE, MMM d")} — Choose a Plan`
      : `${format(parseISO(view.date), "EEEE, MMM d")} — ${PLAN_TITLES[view.plan]}`;

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      {view.step === "list" && (
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-xs text-[var(--text-dim)]">
            Assign a Plan to each day. Sunday always keeps its own fixed schedule.
          </p>
          {dates.map((date) => {
            const variant = dayPlansMap[date] ?? null;
            return (
              <button
                key={date}
                onClick={() => setView({ step: "plan", date })}
                className="flex items-center justify-between rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <div>
                  <p className="text-sm font-semibold">{format(parseISO(date), "EEEE, MMM d")}</p>
                  {variant ? (
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-[var(--accent)]">
                        {PLAN_TITLES[planIdOfVariant(variant)]}
                        {variant.length > 1 ? ` · Option ${variant[1]}` : ""}
                      </span>
                      <PlanSummary variant={variant} />
                    </div>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">Not set</p>
                  )}
                </div>
                <ChevronRight size={18} className="shrink-0 text-[var(--text-faint)]" />
              </button>
            );
          })}
        </div>
      )}

      {view.step === "plan" && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setView({ step: "list" })}
            className="mb-1 flex items-center gap-1 self-start text-xs font-medium text-[var(--accent)]"
          >
            <ChevronLeft size={14} /> Back
          </button>
          {PLAN_IDS.map((p) => {
            const options = PLAN_OPTIONS[p];
            const current = dayPlansMap[view.date] ?? null;
            const isCurrent = current != null && planIdOfVariant(current) === p;
            return (
              <button
                key={p}
                onClick={() => {
                  if (options.length === 1) {
                    setDayPlan(view.date, options[0]);
                    setView({ step: "list" });
                  } else {
                    setView({ step: "option", date: view.date, plan: p });
                  }
                }}
                className="flex items-center justify-between rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {PLAN_TITLES[p]}
                    {isCurrent && <Check size={14} className="text-[var(--accent)]" />}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <PlanSummary variant={options[0]} />
                    {options.length > 1 && (
                      <span className="text-[11px] text-[var(--text-faint)]">· {options.length} options</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-[var(--text-faint)]" />
              </button>
            );
          })}
        </div>
      )}

      {view.step === "option" && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setView({ step: "plan", date: view.date })}
            className="mb-1 flex items-center gap-1 self-start text-xs font-medium text-[var(--accent)]"
          >
            <ChevronLeft size={14} /> Back
          </button>
          {PLAN_OPTIONS[view.plan].map((variant, i) => {
            const isCurrent = (dayPlansMap[view.date] ?? null) === variant;
            return (
              <button
                key={variant}
                onClick={() => {
                  setDayPlan(view.date, variant);
                  setView({ step: "list" });
                }}
                className="flex flex-col items-start gap-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  Option {i + 1}
                  {isCurrent && <Check size={14} className="text-[var(--accent)]" />}
                </p>
                <PlanSummary variant={variant} />
                <p className="text-[10.5px] leading-relaxed text-[var(--text-faint)]">
                  {WEEKLY_PLAN_TEMPLATES[variant]
                    .map((s) => `${minutesToTime(s.start)}–${minutesToTime(s.end)} ${s.category === "study" ? "Study" : "Work"}`)
                    .join(" · ")}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
