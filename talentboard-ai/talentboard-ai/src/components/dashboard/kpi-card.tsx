import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  className?: string;
}

export function KpiCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-dim text-text-muted">
          {icon}
        </div>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-text">{value}</p>
      {change && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-danger",
            changeType === "neutral" && "text-text-muted"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
