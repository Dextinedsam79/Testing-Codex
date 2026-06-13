import Link from "next/link";
import {
  ClipboardList,
  Columns3,
  FolderOpen,
  Sparkles,
  BarChart3,
  Bell,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARKETING_NAV_ITEMS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { MarketingHeaderAuth } from "@/components/layout/marketing-header-auth";

const features = [
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description:
      "Track every job application with status, salary, contacts, and follow-up reminders in one place.",
  },
  {
    icon: Columns3,
    title: "Kanban Board",
    description:
      "Visualize your pipeline with drag-and-drop columns from Saved to Offer. Never lose track again.",
  },
  {
    icon: FolderOpen,
    title: "Portfolio Library",
    description:
      "Showcase your best projects with descriptions, tech stacks, live demos, and GitHub links.",
  },
  {
    icon: Sparkles,
    title: "AI Career Assistant",
    description:
      "Optimize resumes, generate interview questions, craft follow-up emails — all powered by AI.",
  },
  {
    icon: BarChart3,
    title: "Career Analytics",
    description:
      "Understand your job search performance with charts for response rates, trends, and skill gaps.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Automated reminders for interviews, follow-ups, and deadlines so nothing slips through.",
  },
];

const aiTools = [
  {
    icon: FileText,
    title: "Resume Optimizer",
    description:
      "Paste a job description and get ATS-friendly keyword suggestions, improved summaries, and skill recommendations.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: MessageSquare,
    title: "Interview Generator",
    description:
      "Generate tailored technical and behavioral questions with STAR-method model answers.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Sparkles,
    title: "Portfolio Summary",
    description:
      "Auto-generate a professional bio and recruiter pitch from your profile and projects.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Mail,
    title: "Follow-Up Generator",
    description:
      "Craft personalized follow-up emails and thank-you notes that get responses.",
    gradient: "from-emerald-500 to-teal-600",
  },
];

const steps = [
  { step: "01", title: "Create Your Profile", description: "Sign up, set your career goals, and add your skills." },
  { step: "02", title: "Track Applications", description: "Add jobs, manage your pipeline, and set follow-up reminders." },
  { step: "03", title: "Use AI Tools", description: "Optimize resumes, prep for interviews, and generate outreach." },
  { step: "04", title: "Land Your Dream Job", description: "Analyze your progress and convert more applications into offers." },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-card">
      {/* ---- Navbar ---- */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="font-display text-lg font-bold text-text">
              TalentBoard AI
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {MARKETING_NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <MarketingHeaderAuth user={user} />
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-light)_0%,_transparent_60%)] opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-secondary mb-8">
            <Sparkles size={14} className="text-primary" />
            AI-Powered Career Management
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text leading-[1.1]">
            Your Career,
            <br />
            <span className="gradient-text">Organized & Accelerated</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
            Track applications, showcase projects, optimize resumes, prepare for
            interviews, and receive AI-powered career insights — all from one
            intelligent platform.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="xl">
                Start Free — No Credit Card
                <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="xl">
                See How It Works
              </Button>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-muted">
            {["Free forever plan", "No credit card required", "Set up in 2 minutes"].map(
              (text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-success" />
                  {text}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Features
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              A complete career operating system built for modern professionals
              who want to be organized, data-driven, and successful.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 card-hover"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <f.icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-text">{f.title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section id="how-it-works" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">
              From Sign Up to Offer in 4 Steps
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
                  <span className="font-display text-xl font-bold text-primary">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text">{s.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- AI Tools ---- */}
      <section id="ai-tools" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              AI-Powered
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">
              Supercharge Your Job Search with AI
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Our AI tools analyze your profile, match job requirements, and
              generate tailored content to give you a competitive edge.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {aiTools.map((tool) => (
              <div
                key={tool.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 card-hover"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white`}
                >
                  <tool.icon size={22} />
                </div>
                <h3 className="text-base font-semibold text-text">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section id="pricing" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Pricing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">
              Free to Start. Powerful When You Need It.
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            {/* Free */}
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold text-text">Free</h3>
              <p className="mt-1 text-sm text-text-muted">
                Everything you need to get started
              </p>
              <p className="mt-6">
                <span className="font-display text-4xl font-bold text-text">$0</span>
                <span className="text-text-muted">/month</span>
              </p>
              <Link href="/register" className="mt-6 block">
                <Button variant="secondary" className="w-full">
                  Get Started Free
                </Button>
              </Link>
              <ul className="mt-8 space-y-3 text-sm text-text-secondary">
                {[
                  "Up to 25 applications",
                  "3 portfolio projects",
                  "Basic analytics",
                  "5 AI generations / month",
                  "Public portfolio page",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="relative rounded-xl border-2 border-primary bg-card p-8">
              <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                Popular
              </div>
              <h3 className="text-lg font-semibold text-text">Pro</h3>
              <p className="mt-1 text-sm text-text-muted">
                For serious job seekers
              </p>
              <p className="mt-6">
                <span className="font-display text-4xl font-bold text-text">$12</span>
                <span className="text-text-muted">/month</span>
              </p>
              <Link href="/register" className="mt-6 block">
                <Button className="w-full">
                  Start Pro Trial
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <ul className="mt-8 space-y-3 text-sm text-text-secondary">
                {[
                  "Unlimited applications",
                  "Unlimited portfolio projects",
                  "Advanced analytics & insights",
                  "Unlimited AI generations",
                  "Custom portfolio themes",
                  "Priority support",
                  "CSV export",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Ready to Take Control of Your Career?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of professionals who use TalentBoard AI to organize
            their job search and land better opportunities, faster.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button
              size="xl"
              className="bg-white text-primary hover:bg-white/90"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-white">T</span>
              </div>
              <span className="font-display text-sm font-bold text-text">
                TalentBoard AI
              </span>
            </div>
            <p className="text-sm text-text-muted">
              Built with Next.js, Supabase & AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
