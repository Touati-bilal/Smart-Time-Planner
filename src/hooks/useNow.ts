"use client";

import { useEffect, useState } from "react";

/** Ticks every `intervalMs` (default 30s) so time-dependent UI stays live. */
export function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
