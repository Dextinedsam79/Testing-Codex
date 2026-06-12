import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAnalyticsData } from "@/lib/mock-data";

const insights = [
  {
    type: "strength",
    icon: TrendingUp,
    title: "Your referral network is your superpower",
    description:
      "Referrals have a 75% interview conversion rate — 3x higher than any other source. You've gotten 6 interviews from just 8 referral applications. Consider asking contacts at your target companies for introductions.",
    metric: "75%",
    metricLabel: "Referral interview rate",
    badgeVariant: "success" as const,
  },
  {
    type: "opportunity",
    icon: Target,
    title: "Your application volume is accelerating",
    description:
      "You applied to 8 roles last week — your most active week yet. Maintaining this momentum while keeping quality high is key. Focus applications on roles where you match 80%+ of requirements.",
    metric: "8",
    metricLabel: "Apps last week",
    badgeVariant: "primary" as const,
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Glassdoor applications have 0% response rate",
    description:
      "None of your 4 Glassdoor applications have received a response. Consider redirecting that effort to company websites (25% rate) or LinkedIn (28% rate) where you see better results.",
    metric: "0%",
    metricLabel: "Glassdoor response",
    badgeVariant: "danger" as const,
  },
  {
    type: "suggestion",
    icon: Lightbulb,
    title: "Add WebSocket and performance optimization to your resume",
    description:
      "These skills appear in 35% of the roles you're targeting but aren't prominently featured on your resume. Your FinFlow Dashboard project uses WebSocket — make sure that's highlighted.",
    metric: "35%",
    metricLabel: "Jobs requesting these",
    badgeVariant: "warning" as const,
  },
  {
    type: "strength",
    icon: TrendingUp,
    title: "You're outperforming the average response rate",
    description:
      "Your overall response rate is 33% compared to the industry average of 18%. Your strong portfolio and targeted applications are paying off. Keep refining your approach by focusing on high-conversion channels.",
    metric: "33%",
    metricLabel: "Your response rate",
    badgeVariant: "success" as const,
  },
];

export default function CareerInsightsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/analytics"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Analytics
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            AI Career Insights
          </h1>
          <p className="text-sm text-text-muted">
            Personalized analysis of your job search patterns and performance
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-dim">
                  <insight.icon size={20} className="text-text-muted" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-text">
                      {insight.title}
                    </h3>
                    <Badge variant={insight.badgeVariant}>
                      {insight.metric} {insight.metricLabel}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
