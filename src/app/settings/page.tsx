"use client";

import {
  Briefcase,
  GraduationCap,
  Moon,
  Dumbbell,
  Languages,
  ClipboardList,
} from "lucide-react";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { SettingsSection, FieldRow } from "@/components/settings/SettingsSection";
import { WeekdayToggleRow } from "@/components/settings/WeekdayToggleRow";
import { TagListEditor } from "@/components/settings/TagListEditor";
import { HourStepper } from "@/components/ui/HourStepper";
import { TimeInput } from "@/components/ui/TimeInput";

export default function SettingsPage() {
  const settings = usePlannerStore((s) => s.settings);
  const updateSettings = usePlannerStore((s) => s.updateSettings);

  return (
    <div className="pt-2 pb-6">
      <SettingsSection
        icon={Briefcase}
        title="Work"
        subtitle="Used when you override work hours for a specific day"
        color="#00c2a8"
      >
        <FieldRow label="Default hours / day">
          <HourStepper
            minutes={settings.work.defaultWorkHoursMinutes}
            min={settings.work.minWorkHoursMinutes}
            max={settings.work.maxWorkHoursMinutes}
            onChange={(m) => updateSettings({ work: { ...settings.work, defaultWorkHoursMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="Minimum hours / day">
          <HourStepper
            minutes={settings.work.minWorkHoursMinutes}
            max={settings.work.maxWorkHoursMinutes}
            onChange={(m) => updateSettings({ work: { ...settings.work, minWorkHoursMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="Maximum hours / day">
          <HourStepper
            minutes={settings.work.maxWorkHoursMinutes}
            min={settings.work.minWorkHoursMinutes}
            max={10 * 60}
            onChange={(m) => updateSettings({ work: { ...settings.work, maxWorkHoursMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="Preferred start time">
          <TimeInput
            minutes={settings.work.workStartMinutes}
            onChange={(m) => updateSettings({ work: { ...settings.work, workStartMinutes: m } })}
          />
        </FieldRow>
      </SettingsSection>

      <SettingsSection icon={GraduationCap} title="Formation (Cybersecurity)" color="#7c5cff">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">Default formation days</p>
          <WeekdayToggleRow
            selected={settings.formation.defaultFormationDays}
            onChange={(days) =>
              updateSettings({ formation: { ...settings.formation, defaultFormationDays: days } })
            }
          />
        </div>
        <FieldRow label="Start time">
          <TimeInput
            minutes={settings.formation.startMinutes}
            onChange={(m) => updateSettings({ formation: { ...settings.formation, startMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="End time">
          <TimeInput
            minutes={settings.formation.endMinutes}
            onChange={(m) => updateSettings({ formation: { ...settings.formation, endMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="Transport duration (each way)">
          <HourStepper
            minutes={settings.formation.transportMinutes}
            step={15}
            max={3 * 60}
            onChange={(m) => updateSettings({ formation: { ...settings.formation, transportMinutes: m } })}
          />
        </FieldRow>
      </SettingsSection>

      <SettingsSection icon={Moon} title="Sleep" color="#8b93a8">
        <FieldRow label="Wake up">
          <TimeInput
            minutes={settings.sleep.wakeMinutes}
            onChange={(m) => updateSettings({ sleep: { ...settings.sleep, wakeMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="Sleep">
          <TimeInput
            minutes={settings.sleep.sleepMinutes}
            onChange={(m) => updateSettings({ sleep: { ...settings.sleep, sleepMinutes: m } })}
          />
        </FieldRow>
      </SettingsSection>

      <SettingsSection icon={Dumbbell} title="Sport" color="#4ade80">
        <FieldRow label="Weekly target" hint="Split into session-length blocks">
          <HourStepper
            minutes={settings.sport.weeklyTargetMinutes}
            step={30}
            max={20 * 60}
            onChange={(m) => updateSettings({ sport: { ...settings.sport, weeklyTargetMinutes: m } })}
          />
        </FieldRow>
        <FieldRow label="Session duration">
          <HourStepper
            minutes={settings.sport.sessionMinutes}
            step={15}
            max={4 * 60}
            onChange={(m) => updateSettings({ sport: { ...settings.sport, sessionMinutes: m } })}
          />
        </FieldRow>
        <div>
          <p className="mb-2 text-sm font-medium">Activities</p>
          <TagListEditor
            items={settings.sport.activities}
            onChange={(items) => updateSettings({ sport: { ...settings.sport, activities: items } })}
          />
        </div>
      </SettingsSection>

      <SettingsSection icon={Languages} title="Français" color="#38bdf8">
        <FieldRow label="Session duration">
          <HourStepper
            minutes={settings.french.sessionMinutes}
            step={5}
            max={2 * 60}
            onChange={(m) => updateSettings({ french: { ...settings.french, sessionMinutes: m } })}
          />
        </FieldRow>
      </SettingsSection>

      <SettingsSection icon={ClipboardList} title="Preparation" color="#ffb454">
        <FieldRow label="Duration">
          <HourStepper
            minutes={settings.preparation.durationMinutes}
            step={5}
            max={2 * 60}
            onChange={(m) =>
              updateSettings({ preparation: { ...settings.preparation, durationMinutes: m } })
            }
          />
        </FieldRow>
        <div>
          <p className="mb-2 text-sm font-medium">Types</p>
          <TagListEditor
            items={settings.preparation.types}
            onChange={(items) =>
              updateSettings({ preparation: { ...settings.preparation, types: items } })
            }
          />
        </div>
      </SettingsSection>

      <p className="pb-4 text-center text-[11px] text-[var(--text-faint)]">
        All data is stored locally on this device
      </p>
    </div>
  );
}
