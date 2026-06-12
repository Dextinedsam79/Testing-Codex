"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type ResumeOptimizerResult = {
  score: number;
  missingKeywords: string[];
  atsSuggestions: string[];
  improvedSummary: string;
  skillRecommendations: { skill: string; reason: string }[];
};

export default function ResumeOptimizerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResumeOptimizerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "resume_optimizer",
        resumeText,
        jobDescription,
      }),
    });

    const data = (await response.json()) as {
      output?: ResumeOptimizerResult;
      error?: string;
    };
    setIsLoading(false);

    if (!response.ok || !data.output) {
      setError(data.error ?? "Unable to optimize the resume right now.");
      return;
    }

    setResult(data.output);
  }

  function copySummary() {
    if (result?.improvedSummary) {
      void navigator.clipboard.writeText(result.improvedSummary);
    }
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Resume Optimizer
          </h1>
          <p className="text-sm text-text-muted">
            Optimize your resume for a specific job description
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your resume content here. If left blank, TalentBoard will use your profile, skills, projects, and saved CV metadata."
              className="min-h-[202px]"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the full job description here..."
              className="min-h-[160px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button
              className="mt-4 w-full"
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() || isLoading}
            >
              <Sparkles size={16} />
              {isLoading ? "Analyzing..." : "Analyze & Optimize"}
            </Button>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-primary">
                    {result.score}%
                  </p>
                  <p className="text-sm text-text-muted">Match Score</p>
                </div>
                <div className="flex-1">
                  <Progress value={result.score} />
                  <p className="mt-2 text-sm text-text-secondary">
                    Your resume matches <strong>{result.score}%</strong> of the
                    job requirements. Follow the suggestions below to improve
                    your score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning" />
                <CardTitle>Missing Keywords</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw) => (
                  <Badge key={kw} variant="warning">
                    {kw}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-text-muted">
                These keywords appear in the job description but not clearly in
                your resume. Add only the ones you can truthfully support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                <CardTitle>ATS Optimization Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.atsSuggestions.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 text-success shrink-0"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <CardTitle>AI-Generated Summary</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={copySummary}>
                  <Copy size={14} />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-primary-light/50 border border-primary/10 p-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {result.improvedSummary}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-warning" />
                <CardTitle>Skill Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.skillRecommendations.map((rec) => (
                  <div
                    key={rec.skill}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-text">
                        {rec.skill}
                      </p>
                      <p className="text-xs text-text-muted">{rec.reason}</p>
                    </div>
                    <Badge variant="primary">Recommended</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
