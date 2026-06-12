import type { ElementType } from "react";
import { formatRelativeTime } from "@/lib/utils";
import {
  ClipboardList,
  ArrowRightLeft,
  Sparkles,
  FolderPlus,
  Upload,
} from "lucide-react";
import type { ActivityLogView } from "@/lib/applications";

const actionIcons: Record<string, ElementType> = {
  application_created: ClipboardList,
  status_changed: ArrowRightLeft,
  ai_used: Sparkles,
  project_added: FolderPlus,
  cv_uploaded: Upload,
};

const actionLabels: Record<string, (meta: Record<string, unknown>) => string> = {
  application_created: (m) =>
    `Applied to ${text(m.company)} for ${text(m.role)}`,
  status_changed: (m) =>
    `${text(m.company)} moved to ${text(m.new_status).replace("_", " ")}`,
  ai_used: (m) =>
    `Used ${text(m.type).replace("_", " ")} for ${text(m.company)}`,
  project_added: (m) => `Added project "${text(m.title)}"`,
  cv_uploaded: (m) => `Uploaded resume "${text(m.name)}"`,
};

export function ActivityFeed({ entries }: { entries: ActivityLogView[] }) {
  return (
    <div className="flex flex-col gap-1">
      {entries.map((entry) => {
        const Icon = actionIcons[entry.action] || ClipboardList;
        const label = actionLabels[entry.action]?.(entry.metadata) ?? entry.action;
        return (
          <div
            key={entry.id}
            className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-dim transition-colors"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-dim text-text-muted">
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text truncate">{label}</p>
              <p className="text-xs text-text-faint">
                {formatRelativeTime(entry.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
      {entries.length === 0 && (
        <p className="px-3 py-6 text-center text-sm text-text-muted">
          No activity yet.
        </p>
      )}
    </div>
  );
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
