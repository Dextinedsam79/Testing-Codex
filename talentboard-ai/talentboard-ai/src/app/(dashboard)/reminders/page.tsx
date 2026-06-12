import Link from "next/link";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockApplications, mockInterviews } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const inactiveStatuses = new Set<string>(["rejected", "offer"]);

export default function RemindersPage() {
  const now = new Date();
  const nowTime = now.getTime();
  const followUps = mockApplications.filter(
    (a) => a.followUpDate && !inactiveStatuses.has(a.status)
  );

  const upcomingInterviews = mockInterviews
    .filter((i) => i.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  const overdue = followUps.filter(
    (a) => a.followUpDate && new Date(a.followUpDate) < now
  );

  const upcoming = followUps.filter(
    (a) => a.followUpDate && new Date(a.followUpDate) >= now
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Reminders
          </h1>
          <p className="text-sm text-text-muted">
            Upcoming interviews, follow-ups, and deadlines
          </p>
        </div>
      </div>

      {/* Overdue follow-ups */}
      {overdue.length > 0 && (
        <Card className="border-danger/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-danger" />
              <CardTitle className="text-danger">
                Overdue Follow-Ups ({overdue.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdue.map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between rounded-lg border border-danger/20 bg-danger-light/30 px-4 py-3 hover:bg-danger-light/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {app.companyName} - {app.jobTitle}
                    </p>
                    <p className="text-xs text-text-muted">
                      Due: {formatDate(app.followUpDate!)}
                    </p>
                  </div>
                  <Badge variant="danger">Overdue</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming interviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent-cyan" />
            <CardTitle>
              Upcoming Interviews ({upcomingInterviews.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingInterviews.length > 0 ? (
            <div className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={`/applications/${interview.applicationId}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-border-hover transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {interview.companyName}
                    </p>
                    <p className="text-xs text-text-muted">
                      {interview.round} &middot; {interview.type} &middot;{" "}
                      {interview.location}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {formatDate(interview.scheduledAt, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="cyan">{interview.type}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-4 text-center">
              No upcoming interviews scheduled.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming follow-ups */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <CardTitle>Upcoming Follow-Ups ({upcoming.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {upcoming.length > 0 ? (
            <div className="space-y-2">
              {upcoming.map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-border-hover transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {app.companyName} - {app.jobTitle}
                    </p>
                    <p className="text-xs text-text-muted">
                      Follow up: {formatDate(app.followUpDate!)}
                    </p>
                  </div>
                  <Badge variant="primary">
                    {Math.ceil(
                      (new Date(app.followUpDate!).getTime() -
                        nowTime) /
                        86400000
                    )}d
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-4 text-center">
              No upcoming follow-ups.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
