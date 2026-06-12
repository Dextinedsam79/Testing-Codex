"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AiUserContext } from "@/lib/data/ai-context";

type PortfolioSummaryResult = {
  professionalBio: string;
  portfolioSummary: string;
  recruiterPitch: string;
};

export function PortfolioSummaryClient({ context }: { context: AiUserContext }) {
  const [result, setResult] = useState<PortfolioSummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profile = context.profile;
  const publishedProjects = context.projects.filter(
    (project) => project.status === "published"
  );

  async function generateSummary() {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "portfolio_summary" }),
    });

    const data = (await response.json()) as {
      output?: PortfolioSummaryResult;
      error?: string;
    };
    setIsLoading(false);

    if (!response.ok || !data.output) {
      setError(data.error ?? "Unable to generate portfolio summary.");
      return;
    }

    setResult(data.output);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/ai"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to AI Hub
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Portfolio Summary Generator
          </h1>
          <p className="text-sm text-text-muted">
            Generate a professional bio and recruiter pitch from your profile
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Name
              </p>
              <p className="font-medium text-text">
                {profile?.fullName || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Title
              </p>
              <p className="font-medium text-text">
                {profile?.professionalTitle || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Target Role
              </p>
              <p className="font-medium text-text">
                {profile?.targetRole || "Not set"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Skills ({context.skills.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {context.skills.slice(0, 12).map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md bg-surface-dim px-2 py-0.5 text-xs text-text-secondary"
                >
                  {skill.name}
                </span>
              ))}
              {context.skills.length > 12 && (
                <span className="rounded-md bg-surface-dim px-2 py-0.5 text-xs text-text-faint">
                  +{context.skills.length - 12} more
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
              Projects ({publishedProjects.length} published)
            </p>
            <p className="text-sm text-text-secondary">
              {publishedProjects.length > 0
                ? publishedProjects.map((project) => project.title).join(", ")
                : "No published projects yet."}
            </p>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={generateSummary}
            disabled={isLoading}
          >
            <Sparkles size={16} />
            {isLoading ? "Generating..." : result ? "Regenerate Summary" : "Generate Summary"}
          </Button>
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <SummaryCard
            title="Professional Bio"
            content={result.professionalBio}
            hint="Use this on your portfolio page, LinkedIn about section, or personal website."
            onRegenerate={generateSummary}
          />
          <SummaryCard
            title="Portfolio Summary"
            content={result.portfolioSummary}
            hint="A comprehensive overview of your work for portfolio headers or cover letters."
            onRegenerate={generateSummary}
          />
          <SummaryCard
            title="Recruiter Pitch"
            content={result.recruiterPitch}
            hint="Send this to recruiters or use as your elevator pitch in networking messages."
            onRegenerate={generateSummary}
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  content,
  hint,
  onRegenerate,
}: {
  title: string;
  content: string;
  hint: string;
  onRegenerate: () => void;
}) {
  function copyContent() {
    void navigator.clipboard.writeText(content);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onRegenerate}>
              <RefreshCw size={14} />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" onClick={copyContent}>
              <Copy size={14} />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-surface-dim border border-border p-4">
          <p className="text-sm text-text-secondary leading-relaxed">{content}</p>
        </div>
        <p className="mt-2 text-xs text-text-faint">{hint}</p>
      </CardContent>
    </Card>
  );
}
