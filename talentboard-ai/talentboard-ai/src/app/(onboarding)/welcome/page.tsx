"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Upload } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <Progress value={25} className="mb-8" />
      <p className="text-sm font-medium text-primary mb-2">Step 1 of 4</p>
      <h1 className="font-display text-2xl font-bold text-text">
        Welcome! Let&apos;s set up your profile
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Tell us about yourself so we can personalize your experience.
      </p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
            <Upload size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-text">Profile Photo</p>
            <button
              type="button"
              className="mt-1 text-sm font-medium text-primary hover:text-primary-hover"
            >
              Upload photo
            </button>
          </div>
        </div>

        <Input
          label="Full Name"
          placeholder="Alex Johnson"
          defaultValue="Alex Johnson"
          required
        />
        <Input
          label="Professional Title"
          placeholder="e.g. Frontend Engineer, Data Scientist"
          hint="This appears on your public portfolio and profile."
        />
        <Input label="Location" placeholder="e.g. San Francisco, CA" />
        <Input
          label="LinkedIn URL"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <Input
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/yourname"
        />

        <div className="flex items-center justify-between pt-4">
          <Link href="/">
            <Button variant="ghost">Skip for now</Button>
          </Link>
          <Link href="/career-goals">
            <Button size="lg">
              Continue
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
