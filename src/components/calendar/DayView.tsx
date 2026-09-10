"use client";

import { useNow } from "@/hooks/useNow";
import { ScheduleBlock } from "@/lib/types";
import { HourGutter } from "./HourGutter";
import { GridLines } from "./GridLines";
import { NowLine } from "./NowLine";
import { EventBlock } from "./EventBlock";
import { gridHeightPx } from "./gridUtils";
import { layoutBlocksWithLanes } from "./layoutLanes";
import { todayKey } from "@/lib/time";

export function DayView({
  date,
  blocks,
  rangeStart,
  rangeEnd,
  onSelect,
}: {
  date: string;
  blocks: ScheduleBlock[];
  rangeStart: number;
  rangeEnd: number;
  onSelect: (b: ScheduleBlock) => void;
}) {
  const now = useNow();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isToday = date === todayKey();
  const laned = layoutBlocksWithLanes(blocks);

  return (
    <div className="flex">
      <HourGutter startMin={rangeStart} endMin={rangeEnd} />
      <div
        className="glass relative flex-1 rounded-xl"
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
          />
        ))}
      </div>
    </div>
  );
}
