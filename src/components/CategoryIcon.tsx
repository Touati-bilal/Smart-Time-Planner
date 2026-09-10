import {
  Moon,
  GraduationCap,
  Bus,
  Briefcase,
  BookOpen,
  ClipboardList,
  Dumbbell,
  Languages,
  CheckSquare,
  Coffee,
  CalendarClock,
  Pause,
  LucideIcon,
} from "lucide-react";
import { BlockCategory } from "@/lib/types";

export const CATEGORY_ICONS: Record<BlockCategory, LucideIcon> = {
  sleep: Moon,
  formation: GraduationCap,
  transport: Bus,
  work: Briefcase,
  study: BookOpen,
  preparation: ClipboardList,
  sport: Dumbbell,
  french: Languages,
  todo: CheckSquare,
  free: Coffee,
  break: Pause,
  custom: CalendarClock,
};

export function CategoryIcon({
  category,
  size = 16,
  color,
}: {
  category: BlockCategory;
  size?: number;
  color?: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon size={size} color={color} strokeWidth={2} />;
}
