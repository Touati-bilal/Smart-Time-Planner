"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { HourStepper } from "@/components/ui/HourStepper";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { DayInput } from "@/lib/types";
import { weekdayOf } from "@/lib/time";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function QuickSetupCard({ date, dayInput }: { date: string; dayInput: DayInput }) {
  const updateDayInput = usePlannerStore((s) => s.updateDayInput);
  const settings = usePlannerStore((s) => s.settings);
  const [expanded, setExpanded] = useState(false);
  const isSunday = weekdayOf(date) === 6;

  if (isSunday) {
    return (
      <Card className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">Today&apos;s Inputs</h3>
        <p className="mt-1 text-[11px] text-[var(--text-faint)]">
          Sunday always follows your fixed schedule — nothing to adjust here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="text-left">
          <h3 className="text-sm font-semibold tracking-tight">Today&apos;s Inputs</h3>
          <p className="text-[11px] text-[var(--text-faint)]">
            Exceptions for today · tap to {expanded ? "collapse" : "adjust"}
          </p>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <ChevronDown size={18} className="text-[var(--text-dim)]" />
        </motion.div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mt-4 flex flex-col gap-4 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Formation day</p>
            <Switch
              checked={dayInput.isFormationDay}
              onChange={(v) => updateDayInput(date, { isFormationDay: v })}
            />
          </div>

          <div className="h-px bg-[var(--border)]" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Skip work today</p>
            <Switch
              checked={dayInput.workOptOut}
              onChange={(v) => updateDayInput(date, { workOptOut: v, workOverrideMinutes: null })}
            />
          </div>
          {!dayInput.workOptOut && (
            <div className="flex items-center justify-between pl-1">
              <div>
                <p className="text-xs text-[var(--text-dim)]">Work hours</p>
                <p className="text-[10.5px] text-[var(--text-faint)]">Leave at Plan to use the weekly template</p>
              </div>
              <div className="flex items-center gap-2">
                {dayInput.workOverrideMinutes != null && (
                  <button
                    className="text-[11px] text-[var(--accent)] underline underline-offset-2"
                    onClick={() => updateDayInput(date, { workOverrideMinutes: null })}
                  >
                    Plan
                  </button>
                )}
                <HourStepper
                  minutes={dayInput.workOverrideMinutes ?? settings.work.defaultWorkHoursMinutes}
                  min={settings.work.minWorkHoursMinutes}
                  max={settings.work.maxWorkHoursMinutes}
                  onChange={(m) => updateDayInput(date, { workOverrideMinutes: m })}
                />
              </div>
            </div>
          )}

          <div className="h-px bg-[var(--border)]" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Skip sport today</p>
            <Switch
              checked={dayInput.sportOptOut}
              onChange={(v) => updateDayInput(date, { sportOptOut: v })}
            />
          </div>
        </motion.div>
      )}
    </Card>
  );
}
