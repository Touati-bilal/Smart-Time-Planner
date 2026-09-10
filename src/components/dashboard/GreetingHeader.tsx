"use client";

import { useNow } from "@/hooks/useNow";
import { formatNiceDate } from "@/lib/time";

function greeting(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader({ dateKey }: { dateKey: string }) {
  const now = useNow(60000);
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="text-sm text-[var(--text-dim)]">{greeting(now.getHours())}</p>
        <h2 className="text-lg font-semibold tracking-tight">{formatNiceDate(dateKey)}</h2>
      </div>
      <div className="font-mono-num text-2xl font-semibold text-[var(--accent)]">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
