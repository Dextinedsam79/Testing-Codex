"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { EXPERIENCE_LEVELS, CAREER_PATHS } from "@/lib/constants";
import { signInWithProvider, signUp } from "@/lib/supabase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const redirectTo = getRedirectPath();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const careerPath = String(formData.get("career_path") ?? "");
    const experienceLevel = String(formData.get("experience_level") ?? "");

    const { data, error: signUpError } = await signUp(
      email,
      password,
      {
        full_name: fullName,
        career_path: careerPath || undefined,
        experience_level: experienceLevel || undefined,
      },
      redirectTo
    );

    setIsSubmitting(false);

    if (signUpError) {
      setError(formatSignUpError(signUpError.message));
      return;
    }

    if (data.session) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    setMessage("Check your email to confirm your account, then sign in.");
  }

  async function handleGoogleSignIn() {
    setError(null);
    setMessage(null);
    setIsGoogleSubmitting(true);
    const { error: providerError } = await signInWithProvider("google", redirectTo);

    if (providerError) {
      setIsGoogleSubmitting(false);
      setError(providerError.message);
    }
  }

  return (
    <>
      {/* Mobile logo */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-white">T</span>
        </div>
        <span className="font-display text-lg font-bold text-text">
          TalentBoard AI
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-text">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Start organizing your career in under 2 minutes.
      </p>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleSubmitting || isSubmitting}
        className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-card text-sm font-medium text-text transition-colors hover:bg-surface-dim disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {isGoogleSubmitting ? "Redirecting..." : "Continue with Google"}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs text-text-muted uppercase tracking-wider lg:bg-white">
            or sign up with email
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger-light/40 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-lg border border-success/20 bg-success-light/40 px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="full_name"
          type="text"
          placeholder="Alex Johnson"
          autoComplete="name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-text-muted hover:text-text"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Select
          label="Career Path"
          name="career_path"
          placeholder="Select your career path"
          options={CAREER_PATHS.map((p) => ({ value: p, label: p }))}
        />

        <Select
          label="Experience Level"
          name="experience_level"
          placeholder="Select your experience level"
          options={[...EXPERIENCE_LEVELS]}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          disabled={isSubmitting || isGoogleSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-xs text-text-muted text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

function getRedirectPath() {
  if (typeof window === "undefined") return "/dashboard";
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect?.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/dashboard";
}

function formatSignUpError(message: string) {
  if (message.toLowerCase().includes("database error saving new user")) {
    return "Sign-up is blocked by the Supabase profile trigger. Apply the latest database migration, then try again.";
  }

  return message;
}
