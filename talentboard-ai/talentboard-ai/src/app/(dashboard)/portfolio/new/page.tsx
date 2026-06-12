"use client";

import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PROJECT_CATEGORIES } from "@/lib/constants";

export default function AddProjectPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Portfolio
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-text">
          Add New Project
        </h1>
        <p className="text-sm text-text-muted">
          Showcase your work to recruiters and hiring managers.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Basic info */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text">Basic Information</h2>
          <Input label="Project Title" placeholder="e.g. TalentBoard AI" required />
          <Select
            label="Category"
            options={PROJECT_CATEGORIES.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
            placeholder="Select category"
          />
          <Textarea
            label="Description"
            placeholder="A brief description of what this project does..."
            required
          />
        </div>

        {/* Problem & Solution */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text">Problem & Solution</h2>
          <Textarea
            label="Business Problem"
            placeholder="What problem does this project solve?"
          />
          <Textarea
            label="Solution"
            placeholder="How does your project solve this problem?"
          />
        </div>

        {/* Tech & Skills */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text">
            Technologies & Skills
          </h2>
          <Input
            label="Technologies"
            placeholder="e.g. Next.js, TypeScript, Supabase (comma separated)"
            hint="List the technologies used in this project."
          />
          <Input
            label="Skills Used"
            placeholder="e.g. React, UI/UX Design, AI Integration (comma separated)"
          />
        </div>

        {/* Links */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text">Links</h2>
          <Input
            label="GitHub URL"
            type="url"
            placeholder="https://github.com/..."
          />
          <Input
            label="Live Demo URL"
            type="url"
            placeholder="https://..."
          />
          <Input
            label="Documentation URL"
            type="url"
            placeholder="https://docs...."
          />
        </div>

        {/* Images */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-text">Screenshots</h2>
          <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
            <Upload size={24} className="mx-auto text-text-muted" />
            <p className="mt-2 text-sm font-medium text-text">
              Drag & drop images or click to browse
            </p>
            <p className="mt-1 text-xs text-text-muted">
              PNG, JPG, WebP or GIF. Max 5MB each.
            </p>
            <Button variant="secondary" size="sm" className="mt-3">
              Choose Files
            </Button>
          </div>
        </div>

        {/* Visibility */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text">
                Featured Project
              </h2>
              <p className="text-sm text-text-muted">
                Featured projects appear prominently on your public portfolio.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-border after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/portfolio">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button variant="secondary">Save as Draft</Button>
          <Button type="submit">Publish Project</Button>
        </div>
      </form>
    </div>
  );
}
