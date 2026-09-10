"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { minutesToDuration } from "@/lib/time";
import { WeekEngineOutput } from "@/lib/scheduler/engine";

function Row({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="font-medium text-[var(--text-dim)]">{label}</span>
        <span className="font-mono-num text-[var(--text-faint)]">
          {minutesToDuration(value)} / {minutesToDuration(target)}
        </span>
      </div>
      <ProgressBar value={value} max={Math.max(target, value, 1)} color={color} />
    </div>
  );
}

export function WeeklyOverviewCard({ week }: { week: WeekEngineOutput }) {
  return (
    <Card className="mb-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">This Week</h3>
        <span className="text-[11px] text-[var(--text-faint)]">Mon – Sun</span>
      </div>
      <div className="flex flex-col gap-3.5">
        <Row label="Work" value={week.weeklyWorkMinutes} target={week.weeklyWorkTargetMinutes} color="#00c2a8" />
        <Row
          label="Cybersecurity"
          value={week.weeklyStudyTargetMinutes}
          target={week.weeklyStudyTargetMinutes}
          color="#ff5c8a"
        />
        <Row
          label="Sport"
          value={week.weeklySportUsedMinutes}
          target={week.weeklySportTargetMinutes}
          color="#4ade80"
        />
        <Row label="Français" value={week.weeklyFrenchMinutes} target={Math.max(week.weeklyFrenchMinutes, 105)} color="#38bdf8" />
      </div>
    </Card>
  );
}
