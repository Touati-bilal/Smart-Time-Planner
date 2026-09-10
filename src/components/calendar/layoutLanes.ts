import { ScheduleBlock } from "@/lib/types";

export interface LanedBlock {
  block: ScheduleBlock;
  lane: number;
  lanes: number;
}

/** Assigns side-by-side lanes to overlapping blocks so none visually collide. */
export function layoutBlocksWithLanes(blocks: ScheduleBlock[]): LanedBlock[] {
  const sorted = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);
  const clusters: ScheduleBlock[][] = [];

  for (const block of sorted) {
    const cluster = clusters[clusters.length - 1];
    if (cluster && cluster.some((b) => b.startMinutes < block.endMinutes && block.startMinutes < b.endMinutes)) {
      cluster.push(block);
    } else if (cluster && block.startMinutes < Math.max(...cluster.map((b) => b.endMinutes))) {
      cluster.push(block);
    } else {
      clusters.push([block]);
    }
  }

  const result: LanedBlock[] = [];
  for (const cluster of clusters) {
    const laneEnds: number[] = [];
    const assigned: { block: ScheduleBlock; lane: number }[] = [];
    for (const block of cluster) {
      let lane = laneEnds.findIndex((end) => end <= block.startMinutes);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(block.endMinutes);
      } else {
        laneEnds[lane] = block.endMinutes;
      }
      assigned.push({ block, lane });
    }
    const lanes = laneEnds.length;
    for (const a of assigned) result.push({ block: a.block, lane: a.lane, lanes });
  }
  return result;
}
