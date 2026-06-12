"use server";

import { revalidatePath } from "next/cache";
import { APPLICATION_SOURCES, APPLICATION_STATUSES, PRIORITIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Application } from "@/lib/types";

type ActionResult = {
  ok: boolean;
  error?: string;
};

const statusValues = APPLICATION_STATUSES.map((status) => status.value);
const priorityValues = PRIORITIES.map((priority) => priority.value);
const sourceValues = APPLICATION_SOURCES.map((source) => source.value);

export async function createApplicationAction(
  formData: FormData
): Promise<ActionResult> {
  const auth = await getAuthenticatedUserId();
  if (!auth.ok) return auth;

  const payload = parseApplicationForm(formData);
  if (!payload.company_name || !payload.job_title) {
    return { ok: false, error: "Company name and job title are required." };
  }

  const { data, error } = await auth.supabase
    .from("applications")
    .insert({
      ...payload,
      user_id: auth.userId,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  await auth.supabase.from("activity_log").insert({
    user_id: auth.userId,
    action: "application_created",
    entity_type: "application",
    entity_id: data.id,
    metadata: {
      company: payload.company_name,
      role: payload.job_title,
    },
  });

  revalidateApplications();
  return { ok: true };
}

export async function updateApplicationAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const auth = await getAuthenticatedUserId();
  if (!auth.ok) return auth;

  const payload = parseApplicationForm(formData);
  if (!payload.company_name || !payload.job_title) {
    return { ok: false, error: "Company name and job title are required." };
  }

  const { error } = await auth.supabase
    .from("applications")
    .update(payload)
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateApplications(id);
  return { ok: true };
}

export async function deleteApplicationAction(id: string): Promise<ActionResult> {
  const auth = await getAuthenticatedUserId();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateApplications(id);
  return { ok: true };
}

async function getAuthenticatedUserId(): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, error: "You must be signed in to manage applications." };
  }

  return { ok: true, supabase, userId: user.id };
}

function parseApplicationForm(formData: FormData) {
  const status = getAllowedValue<Application["status"]>(
    formData,
    "status",
    statusValues,
    "applied"
  );
  const priority = getAllowedValue<Application["priority"]>(
    formData,
    "priority",
    priorityValues,
    "medium"
  );
  const source = getAllowedValue<Application["source"]>(
    formData,
    "source",
    sourceValues,
    "other"
  );

  return {
    company_name: getText(formData, "company_name") ?? "",
    job_title: getText(formData, "job_title") ?? "",
    location: getText(formData, "location"),
    job_url: getText(formData, "job_url"),
    status,
    priority,
    salary_min: getNumber(formData, "salary_min"),
    salary_max: getNumber(formData, "salary_max"),
    salary_currency: getText(formData, "salary_currency") ?? "USD",
    portfolio_submitted: formData.get("portfolio_submitted") === "on",
    date_applied: getText(formData, "date_applied"),
    follow_up_date: getText(formData, "follow_up_date"),
    notes: getText(formData, "notes"),
    source,
    contact_name: getText(formData, "contact_name"),
    contact_email: getText(formData, "contact_email"),
  };
}

function getText(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getNumber(formData: FormData, key: string): number | null {
  const value = getText(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function getAllowedValue<T extends string>(
  formData: FormData,
  key: string,
  allowedValues: readonly string[],
  fallback: T
): T {
  const value = getText(formData, key);
  return value && allowedValues.includes(value) ? (value as T) : fallback;
}

function revalidateApplications(id?: string) {
  revalidatePath("/applications");
  revalidatePath("/dashboard");
  revalidatePath("/kanban");
  if (id) {
    revalidatePath(`/applications/${id}`);
  }
}
