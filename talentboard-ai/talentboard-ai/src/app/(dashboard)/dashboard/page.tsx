import Link from "next/link";
import {
  ClipboardList,
  Calendar,
  Trophy,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { getDashboardData } from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const applications = data.applications;
  const totalApps = applications.length;
  const interviews = applications.filter(
    (a) => a.status === "interview"
  ).length;
  const offers = applications.filter((a) => a.status === "offer").length;
  const followUps = applications.filter((a) => isFollowUpDue(a)).length;
  const responseRate =
    totalApps > 0 ? Math.round(((interviews + offers) / totalApps) * 100) : 0;
  const applicationsThisWeek = applications.filter((app) => {
    const date = new Date(app.dateApplied ?? app.createdAt);
    return date >= startOfWeek(new Date());
  }).length;
  const maxWeeklyCount = Math.max(
    1,
    ...data.applicationsByWeek.map((week) => week.count)
  );
  const firstName = data.profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Welcome back, {firstName}. Here&apos;s your job search overview.
          </p>
        </div>
        <Link href="/applications">
          <Button size="sm">
            <ClipboardList size={16} />
            New Application
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total Applications"
          value={totalApps}
          change={`+${applicationsThisWeek} this week`}
          changeType="positive"
          icon={<ClipboardList size={18} />}
        />
        <KpiCard
          title="Interviews"
          value={interviews}
          change={`${data.scheduledInterviewCount} scheduled`}
          changeType="positive"
          icon={<Calendar size={18} />}
        />
        <KpiCard
          title="Offers"
          value={offers}
          change={offers === 1 ? "1 pending response" : `${offers} pending responses`}
          changeType="positive"
          icon={<Trophy size={18} />}
        />
        <KpiCard
          title="Follow-Ups Due"
          value={followUps}
          change="Action needed"
          changeType="negative"
          icon={<Clock size={18} />}
        />
        <KpiCard
          title="Response Rate"
          value={`${responseRate}%`}
          change={`${interviews + offers} responses`}
          changeType="positive"
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application trend — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Applications Over Time</CardTitle>
              <Link
                href="/analytics"
                className="text-xs font-medium text-primary hover:text-primary-hover"
              >
                View analytics
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {data.applicationsByWeek.map((w) => (
                <div key={w.week} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors min-h-[4px]"
                    style={{
                      height: `${(w.count / maxWeeklyCount) * 100}%`,
                    }}
                  />
                  <span className="text-[10px] text-text-faint whitespace-nowrap">
                    {w.week}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {APPLICATION_STATUSES.map((s) => {
                const count = applications.filter(
                  (a) => a.status === s.value
                ).length;
                if (count === 0) return null;
                const pct =
                  totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                return (
                  <div key={s.value} className="flex items-center gap-3">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="flex-1 text-sm text-text-secondary">
                      {s.label}
                    </span>
                    <span className="text-sm font-semibold text-text">
                      {count}
                    </span>
                    <span className="text-xs text-text-faint w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Interviews</CardTitle>
              <Badge variant="cyan">
                {data.scheduledInterviewCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <UpcomingInterviews interviews={data.upcomingInterviews} />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed entries={data.activityLog} />
          </CardContent>
        </Card>

        {/* Notifications / AI Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Link
                href="/notifications"
                className="text-xs font-medium text-primary hover:text-primary-hover"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {data.unreadNotifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.action_url ?? "/notifications"}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-dim transition-colors"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      {n.type === "ai_insight" ? (
                        <Sparkles size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-text-muted line-clamp-1">
                        {n.message}
                      </p>
                    </div>
                  </Link>
                ))}
              {data.unreadNotifications.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-text-muted">
                  No unread notifications.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function startOfWeek(date: Date): Date {
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return weekStart;
}

function isFollowUpDue(application: { status: string; followUpDate: string | null }) {
  if (application.status === "follow_up") return true;
  if (!application.followUpDate) return false;

  const dueDate = new Date(application.followUpDate);
  dueDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    dueDate <= today &&
    application.status !== "offer" &&
    application.status !== "rejected"
  );
}
