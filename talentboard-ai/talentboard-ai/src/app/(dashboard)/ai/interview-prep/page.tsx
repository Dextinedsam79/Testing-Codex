"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type InterviewQuestion = {
  question: string;
  answer: string;
};

type InterviewPrepResult = {
  technical: InterviewQuestion[];
  behavioral: InterviewQuestion[];
  suggested: string[];
};

export default function InterviewPrepPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleGenerate() {
    if (!jobTitle.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setExpanded(null);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "interview_prep",
        jobTitle,
        jobDescription,
      }),
    });

    const data = (await response.json()) as {
      output?: InterviewPrepResult;
      error?: string;
    };
    setIsLoading(false);

    if (!response.ok || !data.output) {
      setError(data.error ?? "Unable to generate interview questions.");
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
          <MessageSquare size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Interview Generator
          </h1>
          <p className="text-sm text-text-muted">
            Generate tailored interview questions with model answers
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Input
            label="Job Title"
            placeholder="e.g. Senior Frontend Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Textarea
            label="Job Description (optional)"
            placeholder="Paste the job description for more tailored questions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={!jobTitle.trim() || isLoading}
          >
            <Sparkles size={16} />
            {isLoading ? "Generating..." : "Generate Questions"}
          </Button>
          {error && <p className="text-sm text-danger">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Tabs defaultValue="technical">
          <TabsList>
            <TabsTrigger value="technical">
              Technical ({result.technical.length})
            </TabsTrigger>
            <TabsTrigger value="behavioral">
              Behavioral ({result.behavioral.length})
            </TabsTrigger>
            <TabsTrigger value="suggested">
              Practice ({result.suggested.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technical">
            <div className="space-y-3">
              {result.technical.map((q, i) => (
                <QuestionCard
                  key={q.question}
                  index={i + 1}
                  question={q.question}
                  answer={q.answer}
                  expanded={expanded === `tech-${i}`}
                  onToggle={() =>
                    setExpanded(expanded === `tech-${i}` ? null : `tech-${i}`)
                  }
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="behavioral">
            <div className="space-y-3">
              {result.behavioral.map((q, i) => (
                <QuestionCard
                  key={q.question}
                  index={i + 1}
                  question={q.question}
                  answer={q.answer}
                  expanded={expanded === `beh-${i}`}
                  onToggle={() =>
                    setExpanded(expanded === `beh-${i}` ? null : `beh-${i}`)
                  }
                  badge="STAR"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggested">
            <div className="space-y-2">
              {result.suggested.map((q, i) => (
                <div
                  key={q}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-dim text-xs font-semibold text-text-muted">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm text-text">{q}</p>
                  <Button variant="ghost" size="sm">
                    Practice
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function QuestionCard({
  index,
  question,
  answer,
  expanded,
  onToggle,
  badge,
}: {
  index: number;
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
  badge?: string;
}) {
  function copyAnswer() {
    void navigator.clipboard.writeText(answer);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <button
          onClick={onToggle}
          className="flex w-full items-start gap-3 text-left"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
            {index}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text">{question}</p>
              {badge && <Badge variant="cyan">{badge}</Badge>}
            </div>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-text-muted shrink-0 mt-1" />
          ) : (
            <ChevronDown size={16} className="text-text-muted shrink-0 mt-1" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 ml-10">
            <div className="rounded-lg bg-success-light/50 border border-success/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-success uppercase tracking-wider">
                  Suggested Answer
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={copyAnswer}
                >
                  <Copy size={12} />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
