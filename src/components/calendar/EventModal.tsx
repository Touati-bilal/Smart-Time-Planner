"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_META } from "@/lib/constants";
import { minutesToTime, timeToMinutes } from "@/lib/time";
import { BlockCategory, ScheduleBlock } from "@/lib/types";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { Trash2 } from "lucide-react";

const EDITABLE_CATEGORIES: BlockCategory[] = [
  "custom",
  "work",
  "study",
  "sport",
  "french",
  "preparation",
  "transport",
  "break",
];

export type CalendarModalState =
  | { type: "view"; block: ScheduleBlock }
  | { type: "create"; date: string; startMinutes?: number }
  | null;

export function EventModal({
  state,
  onClose,
}: {
  state: CalendarModalState;
  onClose: () => void;
}) {
  const title =
    state?.type === "view" ? state.block.title : state?.type === "create" ? "New Event" : "Event";
  const key =
    state?.type === "view"
      ? state.block.id
      : state?.type === "create"
      ? `create-${state.date}-${state.startMinutes ?? ""}`
      : "empty";

  return (
    <Modal open={!!state} onClose={onClose} title={title}>
      {state && <EventModalBody key={key} state={state} onClose={onClose} />}
    </Modal>
  );
}

function EventModalBody({
  state,
  onClose,
}: {
  state: Exclude<CalendarModalState, null>;
  onClose: () => void;
}) {
  const addManualEvent = usePlannerStore((s) => s.addManualEvent);
  const updateManualEvent = usePlannerStore((s) => s.updateManualEvent);
  const deleteManualEvent = usePlannerStore((s) => s.deleteManualEvent);
  const toggleTodoComplete = usePlannerStore((s) => s.toggleTodoComplete);

  const isManualEdit = state.type === "view" && state.block.source === "manual";
  const isTodo = state.type === "view" && state.block.source === "todo";
  const isEngine = state.type === "view" && state.block.source === "engine";
  const isCreate = state.type === "create";

  const [title, setTitle] = useState(state.type === "view" ? state.block.title : "");
  const [category, setCategory] = useState<BlockCategory>(
    state.type === "view" ? state.block.category : "custom"
  );
  const [start, setStart] = useState(
    state.type === "view"
      ? minutesToTime(state.block.startMinutes)
      : minutesToTime(state.startMinutes ?? 9 * 60)
  );
  const [end, setEnd] = useState(
    state.type === "view"
      ? minutesToTime(state.block.endMinutes)
      : minutesToTime((state.startMinutes ?? 9 * 60) + 60)
  );

  const meta = state.type === "view" ? CATEGORY_META[state.block.category] : CATEGORY_META.custom;

  const handleSave = () => {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    if (endMinutes <= startMinutes || !title.trim()) return;

    if (isCreate && state.type === "create") {
      addManualEvent({
        date: state.date,
        startMinutes,
        endMinutes,
        category,
        title: title.trim(),
        source: "manual",
        locked: true,
      });
    } else if (isManualEdit && state.type === "view") {
      updateManualEvent(state.block.id, {
        title: title.trim(),
        category,
        startMinutes,
        endMinutes,
      });
    }
    onClose();
  };

  if (isEngine && state.type === "view") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
          >
            <CategoryIcon category={state.block.category} color={meta.color} size={18} />
          </div>
          <div>
            <p className="font-medium">{state.block.title}</p>
            <p className="text-xs text-[var(--text-faint)]">
              {minutesToTime(state.block.startMinutes)} – {minutesToTime(state.block.endMinutes)}
            </p>
          </div>
        </div>
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-3 text-xs text-[var(--text-dim)]">
          This is auto-scheduled by the Smart Scheduling Engine. Adjust it from Today&apos;s Inputs on the Dashboard or
          from Settings, and the timeline will recalculate automatically.
        </p>
      </div>
    );
  }

  if (isTodo && state.type === "view") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
          >
            <CategoryIcon category="todo" color={meta.color} size={18} />
          </div>
          <div>
            <p className="font-medium">{state.block.title}</p>
            <p className="text-xs text-[var(--text-faint)]">
              {minutesToTime(state.block.startMinutes)} – {minutesToTime(state.block.endMinutes)} ·{" "}
              {state.block.subtitle}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            if (state.block.todoId) toggleTodoComplete(state.block.todoId);
            onClose();
          }}
        >
          Mark task complete
        </Button>
      </div>
    );
  }

  if (isCreate || isManualEdit) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Start</label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-[var(--text-dim)]">End</label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {EDITABLE_CATEGORIES.map((c) => {
              const m = CATEGORY_META[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: active ? m.bg : "var(--surface-1)",
                    border: `1px solid ${active ? m.border : "var(--border)"}`,
                    color: active ? m.color : "var(--text-dim)",
                  }}
                >
                  <CategoryIcon category={c} size={12} color={active ? m.color : "var(--text-faint)"} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {isManualEdit && state.type === "view" && (
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                deleteManualEvent(state.block.id);
                onClose();
              }}
            >
              <Trash2 size={15} />
            </Button>
          )}
          <Button variant="primary" size="md" className="flex-1" onClick={handleSave}>
            {isCreate ? "Add Event" : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
