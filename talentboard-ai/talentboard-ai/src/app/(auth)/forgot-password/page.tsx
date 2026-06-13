"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/supabase/auth";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const { error: resetError } = await resetPassword(email);

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-text mb-2">Check your email</h1>
        <p className="text-sm text-text-muted mb-6">
          We have sent you a password reset link. Please check your email to continue.
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full">
            Return to log in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-white">T</span>
        </div>
        <span className="font-display text-lg font-bold text-text">
          TalentBoard AI
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-text">
        Forgot password
      </h1>
      <p className="mt-1 text-sm text-text-muted mb-8">
        Enter your email address and we will send you a link to reset your password.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger-light/40 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Button
          type="submit"
          size="lg"
          className="w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-muted">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
