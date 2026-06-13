"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants";
import { signOut } from "@/lib/supabase/auth";
import {
  LayoutDashboard,
  ClipboardList,
  Columns3,
  FolderOpen,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  ClipboardList,
  Columns3,
  FolderOpen,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function Sidebar({ open, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="font-display text-lg font-bold text-text">
              TalentBoard
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-dim lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {DASHBOARD_NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-light text-primary"
                        : "text-text-secondary hover:bg-surface-dim hover:text-text"
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-border p-3 flex flex-col gap-1">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar name={user.user_metadata?.full_name || user.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="truncate text-xs text-text-muted">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-dim hover:text-text"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
