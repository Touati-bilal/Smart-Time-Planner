import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

export function SettingsSection({
  icon: Icon,
  title,
  subtitle,
  color,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-4">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
        >
          <Icon size={16} color={color} />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-[var(--text-faint)]">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </Card>
  );
}

export function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-[11px] text-[var(--text-faint)]">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
