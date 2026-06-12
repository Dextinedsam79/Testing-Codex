"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Clock,
  AlertTriangle,
  Sparkles,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { NOTIFICATION_TYPES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  Clock,
  AlertTriangle,
  Bell,
  Sparkles,
};

export default function NotificationsPage() {
  const [notifications] = useState(mockNotifications);
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Notifications
          </h1>
          <p className="text-sm text-text-muted">
            {unread.length} unread notification{unread.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <CheckCheck size={14} />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            New
          </h2>
          <div className="space-y-1">
            {unread.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Earlier
          </h2>
          <div className="space-y-1">
            {read.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  notification: n,
}: {
  notification: (typeof mockNotifications)[number];
}) {
  const typeConfig = NOTIFICATION_TYPES.find((t) => t.value === n.type);
  const Icon = iconMap[typeConfig?.icon || "Bell"] || Bell;
  const isAI = n.type === "ai_insight";

  return (
    <Link
      href={n.actionUrl}
      className={`flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-surface-dim ${
        !n.isRead ? "bg-primary-light/30" : ""
      }`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isAI
            ? "bg-gradient-to-br from-primary to-accent-cyan text-white"
            : !n.isRead
            ? "bg-primary-light text-primary"
            : "bg-surface-dim text-text-muted"
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm ${
              !n.isRead ? "font-semibold text-text" : "font-medium text-text-secondary"
            } truncate`}
          >
            {n.title}
          </p>
          {!n.isRead && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-xs text-text-muted line-clamp-1">{n.message}</p>
        <p className="mt-1 text-[11px] text-text-faint">
          {formatRelativeTime(n.createdAt)}
        </p>
      </div>
    </Link>
  );
}
