"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CAREER_PATHS, EXPERIENCE_LEVELS } from "@/lib/constants";

export default function CareerGoalsPage() {
  const [selectedPath, setSelectedPath] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <Progress value={50} className="mb-8" />
      <p className="text-sm font-medium text-primary mb-2">Step 2 of 4</p>
      <h1 className="font-display text-2xl font-bold text-text">
        Define your career goals
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Help us understand where you are and where you want to go.
      </p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <Select
          label="Career Path"
          placeholder="Select your career path"
          options={CAREER_PATHS.map((p) => ({ value: p, label: p }))}
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
        />
        <Select
          label="Experience Level"
          placeholder="Select your experience level"
          options={[...EXPERIENCE_LEVELS]}
        />
        <Input
          label="Target Role"
          placeholder="e.g. Staff Frontend Engineer"
          hint="The role you're actively pursuing."
        />
        <Input
          label="Target Salary (USD)"
          type="number"
          placeholder="e.g. 180000"
        />

        <div>
          <label className="text-sm font-medium text-text-secondary block mb-3">
            What are your top priorities?
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Higher salary",
              "Remote work",
              "Career growth",
              "Work-life balance",
              "Startup culture",
              "Big tech",
              "Leadership role",
              "New industry",
            ].map((goal) => (
              <button
                key={goal}
                type="button"
                className="rounded-full border border-border px-3.5 py-1.5 text-sm text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-light transition-colors focus:border-primary focus:text-primary focus:bg-primary-light"
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Link href="/welcome">
            <Button variant="ghost">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <Link href="/skills">
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
