"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export function TagListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-2.5 py-1 text-xs"
          >
            {item}
            <button onClick={() => onChange(items.filter((i) => i !== item))}>
              <X size={12} className="text-[var(--text-faint)]" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add..."
          className="flex-1 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--accent)]"
        />
        <button
          onClick={add}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--text-dim)]"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
