import { redirect } from "next/navigation";
import {
  toApplicationView,
  toInterviewView,
  type ApplicationView,
  type InterviewView,
} from "@/lib/applications";
import { createClient } from "@/lib/supabase/server";
import type { Application, Interview } from "@/lib/types";

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

export async function getApplications(): Promise<ApplicationView[]> {
  const { supabase, userId } = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("date_applied", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load applications: ${error.message}`);
  }

  return ((data ?? []) as Application[]).map(toApplicationView);
}

export async function getApplicationWithInterviews(
  id: string
): Promise<{ application: ApplicationView; interviews: InterviewView[] } | null> {
  const { supabase, userId } = await getAuthenticatedUserId();

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (applicationError) {
    throw new Error(`Unable to load application: ${applicationError.message}`);
  }

  if (!application) {
    return null;
  }

  const { data: interviews, error: interviewsError } = await supabase
    .from("interviews")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", userId)
    .order("scheduled_at", { ascending: true });

  if (interviewsError) {
    throw new Error(`Unable to load interviews: ${interviewsError.message}`);
  }

  return {
    application: toApplicationView(application as Application),
    interviews: ((interviews ?? []) as Interview[]).map(toInterviewView),
  };
}
