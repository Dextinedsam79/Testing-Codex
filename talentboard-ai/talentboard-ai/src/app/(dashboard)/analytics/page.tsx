import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Target, Zap } from "lucide-react";
import { mockAnalyticsData, mockApplications } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const totalApps = mockAnalyticsData.statusDistribution.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Analytics
          </h1>
          <p className="text-sm text-text-muted">
            Track your job search performance and identify trends
          </p>
        </div>
        <Link href="/analytics/insights">
          <Button variant="secondary" size="sm">
            <Zap size={14} />
            AI Career Insights
          </Button>
        </Link>
      </div>

      {/* Application trend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {mockAnalyticsData.applicationsByWeek.map((w) => (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-text">{w.count}</span>
                <div
                  className="w-full rounded-t-lg bg-primary hover:bg-primary-hover transition-colors min-h-[4px]"
                  style={{ height: `${(w.count / 8) * 100}%` }}
                />
                <span className="text-[10px] text-text-faint whitespace-nowrap">
                  {w.week}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.statusDistribution.map((s) => {
                const pct = Math.round((s.count / totalApps) * 100);
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text-secondary">{s.status}</span>
                      <span className="text-sm font-semibold text-text">
                        {s.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-dim">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalyticsData.monthlyTrend.map((m) => (
                <div
                  key={m.month}
                  className="flex items-center gap-4 rounded-lg bg-surface-dim px-4 py-3"
                >
                  <span className="w-8 text-sm font-semibold text-text">
                    {m.month}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex gap-1 h-4">
                        <div
                          className="rounded-sm bg-primary"
                          style={{ width: `${(m.applications / 20) * 100}%` }}
                        />
                        <div
                          className="rounded-sm bg-accent-cyan"
                          style={{ width: `${(m.interviews / 20) * 100}%` }}
                        />
                        <div
                          className="rounded-sm bg-success"
                          style={{ width: `${(m.offers / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs text-text-muted whitespace-nowrap">
                      <span>{m.applications} apps</span>
                      <span>{m.interviews} int</span>
                      <span>{m.offers} off</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-text-faint">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-sm bg-primary" /> Applications
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-sm bg-accent-cyan" /> Interviews
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-sm bg-success" /> Offers
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalyticsData.sourcePerformance.map((s) => (
                <div
                  key={s.source}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{s.source}</p>
                    <p className="text-xs text-text-muted">
                      {s.applied} applied &middot; {s.interviews} interviews
                    </p>
                  </div>
                  <Badge variant={s.rate >= 50 ? "success" : s.rate >= 20 ? "warning" : "default"}>
                    {s.rate}% rate
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills Requested */}
        <Card>
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalyticsData.topSkillsRequested.map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">{s.skill}</span>
                    <span className="text-xs text-text-muted">
                      {s.count} jobs ({s.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-dim">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Time */}
      <Card>
        <CardHeader>
          <CardTitle>Average Response Time by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {mockAnalyticsData.responseTimeBySource.map((r) => (
              <div
                key={r.source}
                className="flex-1 min-w-[140px] rounded-lg border border-border p-4 text-center"
              >
                <p className="font-display text-2xl font-bold text-text">
                  {r.avgDays}d
                </p>
                <p className="text-sm text-text-muted">{r.source}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
