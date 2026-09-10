"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { minutesToDuration } from "@/lib/time";
import { Briefcase, BookOpen, Coffee, CheckCircle2 } from "lucide-react";

function Stat({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="flex flex-col gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
        >
          <Icon size={16} color={color} />
        </div>
        <p className="font-mono-num text-lg font-semibold">{value}</p>
        <p className="text-[11px] leading-tight text-[var(--text-faint)]">{label}</p>
      </Card>
    </motion.div>
  );
}

export function StatsGrid({
  workMinutes,
  studyMinutes,
  freeMinutes,
  tasksDone,
  tasksTotal,
}: {
  workMinutes: number;
  studyMinutes: number;
  freeMinutes: number;
  tasksDone: number;
  tasksTotal: number;
}) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      <Stat icon={Briefcase} label="Worked today" value={minutesToDuration(workMinutes)} color="#00c2a8" delay={0} />
      <Stat icon={BookOpen} label="Studied today" value={minutesToDuration(studyMinutes)} color="#ff5c8a" delay={0.05} />
      <Stat icon={Coffee} label="Free time left" value={minutesToDuration(freeMinutes)} color="#64748b" delay={0.1} />
      <Stat
        icon={CheckCircle2}
        label="Tasks completed"
        value={`${tasksDone}/${tasksTotal}`}
        color="#4ade80"
        delay={0.15}
      />
    </div>
  );
}
