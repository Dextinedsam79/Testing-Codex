import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function CompletePage() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <Progress value={100} className="mb-8" />

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
        <CheckCircle2 size={32} className="text-success" />
      </div>

      <h1 className="font-display text-2xl font-bold text-text">
        You&apos;re all set!
      </h1>
      <p className="mt-2 text-text-muted max-w-sm mx-auto">
        Your profile is ready. Start tracking applications, building your
        portfolio, and using AI tools to accelerate your job search.
      </p>

      <div className="mt-8 grid gap-3 text-left">
        {[
          {
            title: "Track your first application",
            description: "Add a job you've applied to or one you're interested in.",
            href: "/applications",
          },
          {
            title: "Add a portfolio project",
            description: "Showcase your best work to recruiters and hiring managers.",
            href: "/portfolio/new",
          },
          {
            title: "Try the AI Resume Optimizer",
            description: "Paste a job description and get instant suggestions.",
            href: "/ai/resume-optimizer",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary hover:bg-primary-light/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
              <Sparkles size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text">{item.title}</p>
              <p className="text-xs text-text-muted">{item.description}</p>
            </div>
            <ArrowRight size={16} className="text-text-muted shrink-0" />
          </Link>
        ))}
      </div>

      <Link href="/dashboard" className="mt-8 block">
        <Button size="lg" className="w-full">
          Go to Dashboard
          <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  );
}
