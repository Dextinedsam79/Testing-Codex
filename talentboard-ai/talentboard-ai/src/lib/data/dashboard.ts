import { redirect } from "next/navigation";
import {
  toActivityLogView,
  toApplicationView,
  toInterviewView,
  type ActivityLogView,
  type ApplicationView,
  type InterviewView,
} from "@/lib/applications";
import { createClient } from "@/lib/supabase/server";
import type { ActivityLog, Application, Interview, Notification } from "@/lib/types";

type DashboardProfile = {
  full_name: string | null;
};

export type DashboardWeek = {
  week: string;
  count: number;
};

export type DashboardData = {
  profile: DashboardProfile | null;
  applications: ApplicationView[];
  applicationsByWeek: DashboardWeek[];
  upcomingInterviews: InterviewView[];
  scheduledInterviewCount: number;
  unreadNotifications: Notification[];
  activityLog: ActivityLogView[];
};

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, userId: user.id };
}

export async function getDashboardData(): Promise<DashboardData> {
  const { supabase, userId } = await getAuthenticatedUserId();

  const [
    profileResult,
    applicationsResult,
    interviewsResult,
    notificationsResult,
    activityResult,
  ] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("interviews")
      .select("*")
      .eq("user_id", userId)
      .order("scheduled_at", { ascending: true }),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("activity_log")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  if (profileResult.error) {
    throw new Error(`Unable to load profile: ${profileResult.error.message}`);
  }
  if (applicationsResult.error) {
    throw new Error(
      `Unable to load dashboard applications: ${applicationsResult.error.message}`
    );
  }
  if (interviewsResult.error) {
    throw new Error(
      `Unable to load dashboard interviews: ${interviewsResult.error.message}`
    );
  }
  if (notificationsResult.error) {
    throw new Error(
      `Unable to load dashboard notifications: ${notificationsResult.error.message}`
    );
  }
  if (activityResult.error) {
    throw new Error(`Unable to load dashboard activity: ${activityResult.error.message}`);
  }

  const applications = ((applicationsResult.data ?? []) as Application[]).map(
    toApplicationView
  );
  const interviews = ((interviewsResult.data ?? []) as Interview[]).map(
    toInterviewView
  );

  return {
    profile: profileResult.data as DashboardProfile | null,
    applications,
    applicationsByWeek: buildApplicationsByWeek(applications),
    upcomingInterviews: interviews.filter((i) => i.status === "scheduled").slice(0, 3),
    scheduledInterviewCount: interviews.filter((i) => i.status === "scheduled").length,
    unreadNotifications: (notificationsResult.data ?? []) as Notification[],
    activityLog: ((activityResult.data ?? []) as ActivityLog[]).map(toActivityLogView),
  };
}

function buildApplicationsByWeek(applications: ApplicationView[]): DashboardWeek[] {
  const dates = applications
    .map((app) => new Date(app.dateApplied ?? app.createdAt))
    .filter((date) => !Number.isNaN(date.getTime()));

  const endDate = dates.length
    ? new Date(Math.max(...dates.map((date) => date.getTime())))
    : new Date();
  const endWeek = startOfWeek(endDate);
  const weeks = Array.from({ length: 8 }, (_, index) => {
    const weekStart = new Date(endWeek);
    weekStart.setDate(endWeek.getDate() - (7 - index) * 7);
    return weekStart;
  });

  return weeks.map((weekStart) => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(weekStart.getDate() + 7);
    const count = applications.filter((app) => {
      const date = new Date(app.dateApplied ?? app.createdAt);
      return date >= weekStart && date < nextWeek;
    }).length;

    return {
      week: weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count,
    };
  });
}

function startOfWeek(date: Date): Date {
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return weekStart;
}
