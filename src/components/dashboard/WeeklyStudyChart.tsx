"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { WEEKDAY_SHORT } from "@/lib/constants";
import { WEEKDAYS } from "@/lib/types";
import { minutesToDuration, todayKey } from "@/lib/time";

export function WeeklyStudyChart({
  dates,
  studyByDate,
}: {
  dates: string[];
  studyByDate: Record<string, number>;
}) {
  const today = todayKey();
  const data = dates.map((date, i) => ({
    date,
    label: WEEKDAY_SHORT[WEEKDAYS[i]],
    minutes: Math.round((studyByDate[date] ?? 0) / 5) * 5,
    isToday: date === today,
  }));

  return (
    <Card className="mb-4">
      <h3 className="mb-3 text-sm font-semibold tracking-tight">Cybersecurity Study — Daily Split</h3>
      <div style={{ width: "100%", height: 140 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-faint)", fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-1)" }}
              contentStyle={{
                background: "var(--bg-card-solid)",
                border: "1px solid var(--border-strong)",
                borderRadius: 10,
                fontSize: 12,
                boxShadow: "var(--shadow-card)",
              }}
              labelStyle={{ color: "var(--text-dim)" }}
              formatter={(value) => [minutesToDuration(Number(value ?? 0)), "Study"]}
            />
            <Bar dataKey="minutes" radius={[6, 6, 6, 6]} maxBarSize={22}>
              {data.map((d) => (
                <Cell key={d.date} fill={d.isToday ? "#ff5c8a" : "rgba(255,92,138,0.35)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
