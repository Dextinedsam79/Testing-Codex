"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Mail,
  FileText,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ApplicationView, InterviewView } from "@/lib/applications";
import { deleteApplicationAction, updateApplicationAction } from "../actions";
import { ApplicationFormFields } from "../application-form-fields";

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

type ApplicationDetailClientProps = {
  application: ApplicationView;
  interviews: InterviewView[];
};

export function ApplicationDetailClient({
  application: app,
  interviews,
}: ApplicationDetailClientProps) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const statusInfo = APPLICATION_STATUSES.find((s) => s.value === app.status);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSaving(true);

    const result = await updateApplicationAction(
      app.id,
      new FormData(event.currentTarget)
    );
    setIsSaving(false);

    if (!result.ok) {
      setFormError(result.error ?? "Unable to update application.");
      return;
    }

    setShowEditDialog(false);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete the ${app.companyName} application? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteApplicationAction(app.id);
    setIsDeleting(false);

    if (!result.ok) {
      setFormError(result.error ?? "Unable to delete application.");
      return;
    }

    router.push("/applications");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Applications
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-text">
              {app.companyName}
            </h1>
            <Badge variant={statusBadgeVariant[app.status] || "default"}>
              {statusInfo?.label}
            </Badge>
          </div>
          <p className="mt-1 text-lg text-text-secondary">{app.jobTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit size={14} />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {formError && <p className="text-sm text-danger">{formError}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Location
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-text">
                    <MapPin size={14} className="text-text-faint" />
                    {app.location || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Date Applied
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-text">
                    <Calendar size={14} className="text-text-faint" />
                    {app.dateApplied
                      ? formatDate(app.dateApplied)
                      : "Not yet applied"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Salary Range
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-text">
                    <DollarSign size={14} className="text-text-faint" />
                    {app.salaryMin && app.salaryMax
                      ? `${formatCurrency(app.salaryMin)} - ${formatCurrency(
                          app.salaryMax
                        )}`
                      : "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Follow-Up Date
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm text-text">
                    <Clock size={14} className="text-text-faint" />
                    {app.followUpDate
                      ? formatDate(app.followUpDate)
                      : "No follow-up set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Source
                  </dt>
                  <dd className="mt-1 text-sm text-text capitalize">
                    {app.source}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Priority
                  </dt>
                  <dd className="mt-1 text-sm text-text capitalize">
                    {app.priority}
                  </dd>
                </div>
                {app.contactName && (
                  <div>
                    <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      Contact
                    </dt>
                    <dd className="mt-1 flex items-center gap-1.5 text-sm text-text">
                      <User size={14} className="text-text-faint" />
                      {app.contactName}
                    </dd>
                  </div>
                )}
                {app.contactEmail && (
                  <div>
                    <dt className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      Contact Email
                    </dt>
                    <dd className="mt-1 flex items-center gap-1.5 text-sm text-text">
                      <Mail size={14} className="text-text-faint" />
                      {app.contactEmail}
                    </dd>
                  </div>
                )}
              </dl>

              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
                >
                  View Job Posting
                  <ExternalLink size={14} />
                </a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {app.notes || "No notes yet."}
              </p>
            </CardContent>
          </Card>

          {interviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interviews ({interviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-text">
                          {interview.round} - {interview.type}
                        </p>
                        <Badge
                          variant={
                            interview.status === "completed"
                              ? "success"
                              : "cyan"
                          }
                        >
                          {interview.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(interview.scheduledAt, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {interview.location}
                        </span>
                        {interview.interviewerName && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {interview.interviewerName} ({interview.interviewerRole})
                          </span>
                        )}
                      </div>
                      {interview.notes && (
                        <p className="mt-2 text-xs text-text-muted">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                {APPLICATION_STATUSES.map((s) => {
                  const isCurrent = s.value === app.status;
                  const statusIndex = APPLICATION_STATUSES.findIndex(
                    (st) => st.value === app.status
                  );
                  const thisIndex = APPLICATION_STATUSES.findIndex(
                    (st) => st.value === s.value
                  );
                  const isPast = thisIndex < statusIndex;
                  return (
                    <div
                      key={s.value}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        isCurrent
                          ? "bg-primary-light text-primary font-semibold"
                          : isPast
                            ? "text-text-muted"
                            : "text-text-faint"
                      }`}
                    >
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          isCurrent
                            ? "bg-primary"
                            : isPast
                              ? "bg-text-faint"
                              : "bg-border"
                        }`}
                      />
                      {s.label}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link href="/ai/resume-optimizer">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    <FileText size={14} />
                    Optimize Resume
                  </Button>
                </Link>
                <Link href="/ai/interview-prep">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    <Calendar size={14} />
                    Prep Interview
                  </Button>
                </Link>
                <Link href="/ai/follow-up">
                  <Button variant="secondary" size="sm" className="w-full justify-start">
                    <Mail size={14} />
                    Draft Follow-Up
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle>Edit Application</DialogTitle>
        <DialogDescription>
          Update the job details, status, and follow-up information.
        </DialogDescription>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleUpdate}>
          <ApplicationFormFields application={app} />

          {formError && <p className="text-sm text-danger">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
