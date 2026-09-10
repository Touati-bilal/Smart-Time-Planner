import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({
  className,
  strong,
  ...props
}: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-[var(--radius-lg)] p-4",
        className
      )}
      {...props}
    />
  );
}
