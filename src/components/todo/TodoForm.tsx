"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { Todo, TodoCategory, TodoPriority } from "@/lib/types";
import { Trash2 } from "lucide-react";

const PRIORITIES: TodoPriority[] = ["low", "medium", "high"];
const CATEGORIES: TodoCategory[] = [
  "Cybersecurity",
  "Work",
  "Deutsch",
  "Français",
  "Sport",
  "Personal",
  "Other",
];

const PRIORITY_COLOR: Record<TodoPriority, string> = {
  high: "#fb7185",
  medium: "#ffb454",
  low: "#64748b",
};

export function TodoForm({
  open,
  onClose,
  editingTodo,
}: {
  open: boolean;
  onClose: () => void;
  editingTodo: Todo | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={editingTodo ? "Edit Task" : "New Task"}>
      <TodoFormFields
        key={editingTodo?.id ?? "new"}
        editingTodo={editingTodo}
        onClose={onClose}
      />
    </Modal>
  );
}

function TodoFormFields({
  editingTodo,
  onClose,
}: {
  editingTodo: Todo | null;
  onClose: () => void;
}) {
  const addTodo = usePlannerStore((s) => s.addTodo);
  const updateTodo = usePlannerStore((s) => s.updateTodo);
  const deleteTodo = usePlannerStore((s) => s.deleteTodo);

  const [title, setTitle] = useState(editingTodo?.title ?? "");
  const [description, setDescription] = useState(editingTodo?.description ?? "");
  const [priority, setPriority] = useState<TodoPriority>(editingTodo?.priority ?? "medium");
  const [category, setCategory] = useState<TodoCategory>(editingTodo?.category ?? "Cybersecurity");
  const [deadline, setDeadline] = useState(editingTodo?.deadline ?? "");
  const [estimatedHours, setEstimatedHours] = useState(
    editingTodo?.estimatedMinutes ? String(editingTodo.estimatedMinutes / 60) : "1"
  );
  const [autoSchedule, setAutoSchedule] = useState(editingTodo?.autoSchedule ?? true);

  const handleSave = () => {
    if (!title.trim()) return;
    const estimatedMinutes = estimatedHours ? Math.round(parseFloat(estimatedHours) * 60) : null;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      deadline: deadline || null,
      estimatedMinutes,
      autoSchedule,
      scheduledDate: null,
    };
    if (editingTodo) {
      updateTodo(editingTodo.id, payload);
    } else {
      addTodo(payload);
    }
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to get done?"
          className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Notes (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Priority</label>
        <div className="flex gap-1.5">
          {PRIORITIES.map((p) => {
            const active = priority === p;
            const color = PRIORITY_COLOR[p];
            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className="flex-1 rounded-lg py-2 text-xs font-medium capitalize transition-colors"
                style={{
                  background: active ? `color-mix(in srgb, ${color} 18%, transparent)` : "var(--surface-1)",
                  border: `1px solid ${active ? color : "var(--border)"}`,
                  color: active ? color : "var(--text-dim)",
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Category</label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                style={{
                  background: active ? "var(--accent-soft)" : "var(--surface-1)",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  color: active ? "var(--accent)" : "var(--text-dim)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--text-dim)]">Est. hours</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2.5">
        <div>
          <p className="text-sm font-medium">Auto-schedule</p>
          <p className="text-[11px] text-[var(--text-faint)]">Let the scheduler place this into free time</p>
        </div>
        <Switch checked={autoSchedule} onChange={setAutoSchedule} />
      </div>

      <div className="flex gap-2 pt-1">
        {editingTodo && (
          <Button
            variant="danger"
            onClick={() => {
              deleteTodo(editingTodo.id);
              onClose();
            }}
          >
            <Trash2 size={15} />
          </Button>
        )}
        <Button variant="primary" className="flex-1" onClick={handleSave}>
          {editingTodo ? "Save Changes" : "Add Task"}
        </Button>
      </div>
    </div>
  );
}
