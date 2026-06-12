"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, MapPin, Calendar, DollarSign } from "lucide-react";
import { mockApplications } from "@/lib/mock-data";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";

const statusColors: Record<string, string> = {
  saved: "#94A3B8",
  applied: "#4F46E5",
  screening: "#F59E0B",
  interview: "#06B6D4",
  offer: "#10B981",
  rejected: "#EF4444",
  follow_up: "#8B5CF6",
};

export default function KanbanPage() {
  const [apps] = useState(mockApplications);

  const columns = APPLICATION_STATUSES.map((status) => ({
    ...status,
    items: apps.filter((a) => a.status === status.value),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Kanban Board
          </h1>
          <p className="text-sm text-text-muted">
            Drag and drop to update application status
          </p>
        </div>
        <Link href="/applications">
          <Button size="sm">
            <Plus size={14} />
            Add Application
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {columns.map((column) => (
          <div
            key={column.value}
            className="flex w-72 shrink-0 flex-col rounded-xl bg-surface-dim"
          >
            {/* Column header */}
            <div className="flex items-center gap-2 px-4 py-3">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColors[column.value] }}
              />
              <span className="text-sm font-semibold text-text">
                {column.label}
              </span>
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-card text-xs font-medium text-text-muted">
                {column.items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 px-2 pb-2 min-h-[100px]">
              {column.items.map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="group cursor-grab rounded-lg border border-border bg-card p-3 shadow-xs transition-all hover:border-border-hover hover:shadow-card active:cursor-grabbing"
                  draggable
                >
                  <div className="flex items-start gap-2">
                    <GripVertical
                      size={14}
                      className="mt-0.5 text-text-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">
                        {app.companyName}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {app.jobTitle}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-text-faint">
                        {app.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} />
                            {app.location.split("(")[0].trim()}
                          </span>
                        )}
                        {app.dateApplied && (
                          <span className="flex items-center gap-0.5">
                            <Calendar size={10} />
                            {formatDate(app.dateApplied, { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>

                      {app.salaryMin && app.salaryMax && (
                        <p className="mt-1.5 text-[11px] font-medium text-text-secondary">
                          {formatCurrency(app.salaryMin)} - {formatCurrency(app.salaryMax)}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        {app.priority === "high" && (
                          <span className="rounded-full bg-danger-light px-1.5 py-0.5 text-[10px] font-semibold text-danger">
                            High
                          </span>
                        )}
                        {app.portfolioSubmitted && (
                          <span className="rounded-full bg-success-light px-1.5 py-0.5 text-[10px] font-semibold text-success">
                            Portfolio
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {column.items.length === 0 && (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-xs text-text-faint">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
