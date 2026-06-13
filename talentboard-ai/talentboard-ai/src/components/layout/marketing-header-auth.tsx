"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase/auth";

export function MarketingHeaderAuth({ user }: { user: User | null }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  if (!user) {
    return (
      <>
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Get Started Free</Button>
        </Link>
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          Dashboard
        </Button>
      </Link>
      <div className="flex items-center gap-2 border-l border-border pl-4">
        <Link href="/settings" className="flex items-center gap-2">
          <Avatar name={user.user_metadata?.full_name || user.email} size="sm" />
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-lg p-2 text-text-muted hover:bg-surface-dim hover:text-text"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
