"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const emailTypes = [
  { value: "follow_up", label: "Follow-Up Email" },
  { value: "thank_you", label: "Thank You Email" },
  { value: "networking", label: "Networking Message" },
];

type FollowUpResult = {
  subject: string;
  body: string;
};

export default function FollowUpPage() {
  const [emailType, setEmailType] = useState("follow_up");
  const [recipientName, setRecipientName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<FollowUpResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateEmail() {
    if (!company.trim() || !role.trim()) return;

    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "follow_up",
        emailType,
        recipientName,
        company,
        role,
        context,
      }),
    });

    const data = (await response.json()) as {
      output?: FollowUpResult;
      error?: string;
    };
    setIsLoading(false);

    if (!response.ok || !data.output) {
      setError(data.error ?? "Unable to generate email.");
      return;
    }

    setResult(data.output);
  }

  function copyAll() {
    if (!result) return;
    void navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
  }

  function openEmailClient() {
    if (!result) return;
    const url = `mailto:?subject=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`;
    window.location.href = url;
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <Mail size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Follow-Up Generator
          </h1>
          <p className="text-sm text-text-muted">
            Craft personalized follow-up emails and networking messages
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Select
            label="Email Type"
            options={emailTypes}
            value={emailType}
            onChange={(e) => {
              setEmailType(e.target.value);
              setResult(null);
            }}
          />
          <Input
            label="Recipient Name"
            placeholder="e.g. Sarah Chen"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <Input
            label="Company"
            placeholder="e.g. Stripe"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <Input
            label="Role"
            placeholder="e.g. Senior Frontend Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <Textarea
            label="Context"
            placeholder="Add interview notes, timing, recruiter details, or what you want emphasized..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={generateEmail}
            disabled={!company.trim() || !role.trim() || isLoading}
          >
            <Sparkles size={16} />
            {isLoading ? "Generating..." : result ? "Regenerate Email" : "Generate Email"}
          </Button>
          {error && <p className="text-sm text-danger">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Email</CardTitle>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                <Copy size={14} />
                Copy All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                  Subject Line
                </p>
                <div className="rounded-lg bg-surface-dim border border-border px-4 py-2.5">
                  <p className="text-sm font-medium text-text">
                    {result.subject}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                  Email Body
                </p>
                <div className="rounded-lg bg-surface-dim border border-border p-4">
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {result.body}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={generateEmail}
                  disabled={isLoading}
                >
                  <Sparkles size={14} />
                  Regenerate
                </Button>
                <Button className="flex-1" onClick={openEmailClient}>
                  <Mail size={14} />
                  Open in Email Client
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
