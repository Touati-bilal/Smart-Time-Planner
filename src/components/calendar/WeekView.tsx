"use client";

import { format, parseISO } from "date-fns";
import { useNow } from "@/hooks/useNow";
import { ScheduleBlock } from "@/lib/types";
import { HourGutter } from "./HourGutter";
import { GridLines } from "./GridLines";
import { NowLine } from "./NowLine";
import { EventBlock } from "./EventBlock";
import { gridHeightPx } from "./gridUtils";
import { layoutBlocksWithLanes } from "./layoutLanes";
import { todayKey } from "@/lib/time";
import { cn } from "@/lib/utils";

export function WeekView({
  dates,
  blocksByDate,
  rangeStart,
  rangeEnd,
  onSelect,
  onDayHeaderClick,
}: {
  dates: string[];
  blocksByDate: Record<string, ScheduleBlock[]>;
  rangeStart: number;
  rangeEnd: number;
  onSelect: (b: ScheduleBlock) => void;
  onDayHeaderClick: (date: string) => void;
}) {
  const now = useNow();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = todayKey();

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-full">
        <div className="pt-8">
          <HourGutter startMin={rangeStart} endMin={rangeEnd} />
        </div>
        <div className="flex flex-1 gap-[3px]">
          {dates.map((date) => {
            const d = parseISO(date);
            const isToday = date === today;
            const laned = layoutBlocksWithLanes(blocksByDate[date] ?? []);
            return (
              <div key={date} className="flex-1" style={{ minWidth: 44 }}>
                <button
                  onClick={() => onDayHeaderClick(date)}
                  className="mb-1 flex w-full flex-col items-center rounded-md py-0.5"
                  style={{ background: isToday ? "var(--accent-soft)" : "transparent" }}
                >
                  <span className="text-[9px] uppercase text-[var(--text-faint)]">
                    {format(d, "EEE")}
                  </span>
                  <span
                    className={cn(
                      "font-mono-num text-xs font-semibold",
                      isToday ? "text-[var(--accent)]" : "text-[var(--text-dim)]"
                    )}
                  >
                    {format(d, "d")}
                  </span>
                </button>
                <div
                  className="glass relative rounded-lg"
                  style={{ height: gridHeightPx(rangeStart, rangeEnd) }}
                >
                  <GridLines startMin={rangeStart} endMin={rangeEnd} />
                  {isToday && <NowLine nowMin={nowMin} startMin={rangeStart} endMin={rangeEnd} />}
                  {laned.map(({ block, lane, lanes }) => (
                    <EventBlock
                      key={block.id}
                      block={block}
                      rangeStart={rangeStart}
                      onClick={onSelect}
                      lane={lane}
                      lanes={lanes}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
