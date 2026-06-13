"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { mockNotifications } from "@/lib/mock-data";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  onMenuClick: () => void;
  user: User;
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-text-muted hover:bg-surface-dim hover:text-text lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 sm:block max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
        />
        <input
          type="search"
          placeholder="Search applications, projects..."
          className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-4 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative rounded-lg p-2 text-text-muted hover:bg-surface-dim hover:text-text"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <Link href="/settings" className="flex items-center gap-2">
          <Avatar name={user.user_metadata?.full_name || user.email} size="sm" />
        </Link>
      </div>
    </header>
  );
}
