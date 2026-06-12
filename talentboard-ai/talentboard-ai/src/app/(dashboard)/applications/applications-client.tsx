"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Plus,
  Search,
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Download,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ApplicationView } from "@/lib/applications";
import { createApplicationAction } from "./actions";
import { ApplicationFormFields } from "./application-form-fields";

const statusBadgeVariant: Record<
  string,
  "default" | "primary" | "success" | "warning" | "danger" | "cyan" | "purple"
> = {
  saved: "default",
  applied: "primary",
  screening: "warning",
  interview: "cyan",
  offer: "success",
  rejected: "danger",
  follow_up: "purple",
};

type ApplicationsClientProps = {
  applications: ApplicationView[];
};

export function ApplicationsClient({ applications }: ApplicationsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortField, setSortField] = useState<"date" | "company" | "salary">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let apps = [...applications];

    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.companyName.toLowerCase().includes(q) ||
          a.jobTitle.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      apps = apps.filter((a) => a.status === statusFilter);
    }

    apps.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") {
        return (
          dir *
          (new Date(a.dateApplied || a.createdAt).getTime() -
            new Date(b.dateApplied || b.createdAt).getTime())
        );
      }
      if (sortField === "company") {
        return dir * a.companyName.localeCompare(b.companyName);
      }
      if (sortField === "salary") {
        return dir * ((a.salaryMax || 0) - (b.salaryMax || 0));
      }
      return 0;
    });

    return apps;
  }, [applications, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSaving(true);

    const result = await createApplicationAction(new FormData(event.currentTarget));
    setIsSaving(false);

    if (!result.ok) {
      setFormError(result.error ?? "Unable to save application.");
      return;
    }

    event.currentTarget.reset();
    setShowAddDialog(false);
    router.refresh();
  }

  function exportCsv() {
    const headers = [
      "Company",
      "Job Title",
      "Status",
      "Priority",
      "Location",
      "Date Applied",
      "Follow-Up Date",
      "Salary Min",
      "Salary Max",
      "Source",
    ];
    const rows = applications.map((app) => [
      app.companyName,
      app.jobTitle,
      app.status,
      app.priority,
      app.location ?? "",
      app.dateApplied ?? "",
      app.followUpDate ?? "",
      app.salaryMin?.toString() ?? "",
      app.salaryMax?.toString() ?? "",
      app.source,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Applications
          </h1>
          <p className="text-sm text-text-muted">
            {applications.length} total applications tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download size={14} />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus size={14} />
            Add Application
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
          />
          <input
            type="search"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-card px-3 pr-8 text-sm text-text-secondary appearance-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          >
            <option value="">All Statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => toggleSort("date")}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-text-secondary hover:border-border-hover"
          >
            <ArrowUpDown size={14} />
            Date
          </button>
          <button
            onClick={() => toggleSort("salary")}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-text-secondary hover:border-border-hover"
          >
            <DollarSign size={14} />
            Salary
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((app) => {
          const statusInfo = APPLICATION_STATUSES.find(
            (s) => s.value === app.status
          );
          return (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-border-hover hover:shadow-card sm:flex-row sm:items-center"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text truncate">
                    {app.companyName}
                  </h3>
                  <Badge variant={statusBadgeVariant[app.status] || "default"}>
                    {statusInfo?.label}
                  </Badge>
                  {app.priority === "high" && (
                    <span className="text-danger text-xs font-semibold">
                      High
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-text-muted truncate">
                  {app.jobTitle}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-faint">
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {app.location}
                    </span>
                  )}
                  {app.dateApplied && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(app.dateApplied)}
                    </span>
                  )}
                  {app.salaryMin && app.salaryMax && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} />
                      {formatCurrency(app.salaryMin)} -{" "}
                      {formatCurrency(app.salaryMax)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.jobUrl && (
                  <span className="rounded-lg p-2 text-text-muted hover:bg-surface-dim">
                    <ExternalLink size={14} />
                  </span>
                )}
                <span className="rounded-lg p-2 text-text-muted hover:bg-surface-dim">
                  <MoreHorizontal size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-text-muted">
            No applications match your filters.
          </p>
        </div>
      )}

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle>Add New Application</DialogTitle>
        <DialogDescription>
          Track a new job application. You can add more details later.
        </DialogDescription>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleCreate}>
          <ApplicationFormFields />

          {formError && <p className="text-sm text-danger">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Application"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
