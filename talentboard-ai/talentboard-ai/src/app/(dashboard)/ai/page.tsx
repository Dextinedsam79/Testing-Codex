import Link from "next/link";
import { redirect } from "next/navigation";
import type { ElementType } from "react";
import {
  FileText,
  MessageSquare,
  Sparkles,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AI_TOOL_TYPES, APPLICATION_SOURCES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { getAiContextForUser } from "@/lib/data/ai-context";

const iconMap: Record<string, ElementType> = {
  FileText,
  MessageSquare,
  Sparkles,
  Mail,
};

const toolRoutes: Record<string, string> = {
  resume_optimizer: "/ai/resume-optimizer",
  interview_prep: "/ai/interview-prep",
  portfolio_summary: "/ai/portfolio-summary",
  follow_up: "/ai/follow-up",
};

type ApplicationSignal = {
  status: string;
  source: string | null;
};

type GenerationRow = {
  id: string;
  type: string;
  input_data: Record<string, unknown>;
  created_at: string;
};

export default async function AIHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [context, applicationsResult, generationsResult] = await Promise.all([
    getAiContextForUser(supabase, user.id),
    supabase.from("applications").select("status,source").eq("user_id", user.id),
    supabase
      .from("ai_generations")
      .select("id,type,input_data,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (applicationsResult.error) {
    throw new Error(`Unable to load AI insight: ${applicationsResult.error.message}`);
  }
  if (generationsResult.error) {
    throw new Error(
      `Unable to load recent AI generations: ${generationsResult.error.message}`
    );
  }

  const applications = (applicationsResult.data ?? []) as ApplicationSignal[];
  const generations = (generationsResult.data ?? []) as GenerationRow[];
  const insight = buildInsight(applications, context.skills.map((skill) => skill.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">
          AI Career Assistant
        </h1>
        <p className="text-sm text-text-muted">
          Supercharge your job search with AI-powered tools
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {AI_TOOL_TYPES.map((tool) => {
          const Icon = iconMap[tool.icon] || Sparkles;
          return (
            <Link key={tool.value} href={toolRoutes[tool.value]}>
              <Card className="h-full card-hover cursor-pointer">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-text">
                    {tool.label}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted leading-relaxed">
                    {tool.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Get started
                    <ArrowRight size={14} />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text">
                AI Career Insight
              </h3>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                {insight}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Recent AI Generations
        </h2>
        <div className="space-y-2">
          {generations.length > 0 ? (
            generations.map((generation) => (
              <div
                key={generation.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <Sparkles size={16} className="text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    {generationLabel(generation.type)}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(generation.created_at)}
                  </p>
                </div>
                <Badge variant="primary">Saved</Badge>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-border bg-card px-4 py-6 text-center">
              <p className="text-sm text-text-muted">
                Your generated resume, interview, and portfolio outputs will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildInsight(applications: ApplicationSignal[], skillNames: string[]) {
  if (applications.length === 0) {
    return "Add a few applications to unlock personalized channel and conversion insights. Your AI tools are already connected to your live profile, skills, and portfolio data.";
  }

  const sourceStats = new Map<string, { applied: number; responses: number }>();
  for (const app of applications) {
    const source = app.source ?? "other";
    const current = sourceStats.get(source) ?? { applied: 0, responses: 0 };
    current.applied += 1;
    if (app.status === "interview" || app.status === "offer") {
      current.responses += 1;
    }
    sourceStats.set(source, current);
  }

  const strongest = [...sourceStats.entries()]
    .map(([source, stats]) => ({
      source,
      rate: Math.round((stats.responses / stats.applied) * 100),
      applied: stats.applied,
    }))
    .sort((a, b) => b.rate - a.rate || b.applied - a.applied)[0];
  const sourceLabel =
    APPLICATION_SOURCES.find((source) => source.value === strongest.source)?.label ??
    "Other";
  const topSkills = skillNames.slice(0, 2).join(" and ");

  return `Based on ${applications.length} tracked applications, your strongest conversion channel is ${sourceLabel} at ${strongest.rate}%. ${
    topSkills
      ? `Lean into ${topSkills} across your resume, portfolio, and interview stories.`
      : "Add skills to your profile so TalentBoard can tailor recommendations more sharply."
  }`;
}

function generationLabel(type: string) {
  return AI_TOOL_TYPES.find((tool) => tool.value === type)?.label ?? type;
}
