"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, X, Upload } from "lucide-react";
import { SKILL_CATEGORIES } from "@/lib/constants";

const suggestedSkills: Record<string, string[]> = {
  framework: ["React", "Next.js", "Vue.js", "Angular", "Svelte", "Express.js", "Django", "Flask", "Spring Boot", "Rails"],
  language: ["TypeScript", "JavaScript", "Python", "Java", "Go", "Rust", "C#", "SQL", "Swift", "Kotlin"],
  tool: ["Git", "Docker", "PostgreSQL", "MongoDB", "Redis", "Figma", "AWS", "GCP", "Supabase", "Firebase"],
  technical: ["REST APIs", "GraphQL", "System Design", "CI/CD", "Testing", "Data Structures", "Algorithms"],
  soft: ["Leadership", "Communication", "Problem Solving", "Teamwork", "Mentoring", "Project Management"],
};

export default function SkillsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js",
  ]);
  const [activeCategory, setActiveCategory] = useState("framework");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <Progress value={75} className="mb-8" />
      <p className="text-sm font-medium text-primary mb-2">Step 3 of 4</p>
      <h1 className="font-display text-2xl font-bold text-text">
        Add your skills
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Select the skills you want to showcase. You can always edit these later.
      </p>

      <div className="mt-6">
        {/* Selected skills */}
        {selectedSkills.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-text-secondary mb-2">
              Selected ({selectedSkills.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary"
                >
                  {skill}
                  <button
                    onClick={() => toggleSkill(skill)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/10"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface-dim"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skill suggestions */}
        <div className="flex flex-wrap gap-2">
          {(suggestedSkills[activeCategory] || []).map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border text-text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resume upload */}
      <div className="mt-8 rounded-xl border-2 border-dashed border-border p-6 text-center">
        <Upload size={24} className="mx-auto text-text-muted" />
        <p className="mt-2 text-sm font-medium text-text">
          Upload your resume (optional)
        </p>
        <p className="mt-1 text-xs text-text-muted">
          PDF format, up to 5MB. We&apos;ll extract skills automatically.
        </p>
        <Button variant="secondary" size="sm" className="mt-3">
          Choose File
        </Button>
      </div>

      <div className="flex items-center justify-between pt-6">
        <Link href="/career-goals">
          <Button variant="ghost">
            <ArrowLeft size={16} />
            Back
          </Button>
        </Link>
        <Link href="/complete">
          <Button size="lg">
            Continue
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
