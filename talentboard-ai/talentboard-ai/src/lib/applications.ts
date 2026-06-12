import type { ActivityLog, Application, Interview } from "@/lib/types";

export type ApplicationView = {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  location: string | null;
  jobUrl: string | null;
  status: Application["status"];
  priority: Application["priority"];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  cvVersionId: string | null;
  portfolioSubmitted: boolean;
  dateApplied: string | null;
  followUpDate: string | null;
  notes: string | null;
  source: Application["source"];
  contactName: string | null;
  contactEmail: string | null;
  kanbanOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type InterviewView = {
  id: string;
  applicationId: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  type: Interview["type"];
  round: string | null;
  scheduledAt: string;
  durationMinutes: number;
  location: string | null;
  meetingUrl: string | null;
  interviewerName: string | null;
  interviewerRole: string | null;
  notes: string | null;
  status: Interview["status"];
  outcome: Interview["outcome"];
  createdAt: string;
  updatedAt: string;
};

export type ActivityLogView = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export function toApplicationView(app: Application): ApplicationView {
  return {
    id: app.id,
    userId: app.user_id,
    companyName: app.company_name,
    jobTitle: app.job_title,
    location: app.location,
    jobUrl: app.job_url,
    status: app.status,
    priority: app.priority,
    salaryMin: app.salary_min,
    salaryMax: app.salary_max,
    salaryCurrency: app.salary_currency,
    cvVersionId: app.cv_version_id,
    portfolioSubmitted: app.portfolio_submitted,
    dateApplied: app.date_applied,
    followUpDate: app.follow_up_date,
    notes: app.notes,
    source: app.source,
    contactName: app.contact_name,
    contactEmail: app.contact_email,
    kanbanOrder: app.kanban_order,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
  };
}

export function toInterviewView(interview: Interview): InterviewView {
  return {
    id: interview.id,
    applicationId: interview.application_id,
    userId: interview.user_id,
    companyName: interview.company_name,
    jobTitle: interview.job_title,
    type: interview.type,
    round: interview.round,
    scheduledAt: interview.scheduled_at,
    durationMinutes: interview.duration_minutes,
    location: interview.location,
    meetingUrl: interview.meeting_url,
    interviewerName: interview.interviewer_name,
    interviewerRole: interview.interviewer_role,
    notes: interview.notes,
    status: interview.status,
    outcome: interview.outcome,
    createdAt: interview.created_at,
    updatedAt: interview.updated_at,
  };
}

export function toActivityLogView(entry: ActivityLog): ActivityLogView {
  return {
    id: entry.id,
    action: entry.action,
    entityType: entry.entity_type,
    entityId: entry.entity_id,
    metadata: entry.metadata,
    createdAt: entry.created_at,
  };
}
