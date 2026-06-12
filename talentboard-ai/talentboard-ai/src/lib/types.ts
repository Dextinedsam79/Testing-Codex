// ============================================================
// TypeScript Types for TalentBoard AI Database Entities
// ============================================================

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  username: string | null;
  professional_title: string | null;
  bio: string | null;
  experience_level: "entry" | "mid" | "senior" | "lead";
  career_path: string | null;
  target_role: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  onboarding_complete: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  location: string | null;
  job_url: string | null;
  status: "saved" | "applied" | "screening" | "interview" | "offer" | "rejected" | "follow_up";
  priority: "low" | "medium" | "high";
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  cv_version_id: string | null;
  portfolio_submitted: boolean;
  date_applied: string | null;
  follow_up_date: string | null;
  notes: string | null;
  source: "linkedin" | "indeed" | "company" | "referral" | "glassdoor" | "angellist" | "other";
  contact_name: string | null;
  contact_email: string | null;
  kanban_order: number;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  type: "phone" | "technical" | "behavioral" | "panel" | "culture" | "final" | "other";
  round: string | null;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  meeting_url: string | null;
  interviewer_name: string | null;
  interviewer_role: string | null;
  notes: string | null;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  outcome: "pending" | "passed" | "failed" | "no_decision";
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  category: "web" | "mobile" | "data" | "ai" | "design" | "devops" | "other";
  description: string | null;
  business_problem: string | null;
  solution: string | null;
  technologies: string[];
  skills_used: string[];
  github_url: string | null;
  demo_url: string | null;
  dashboard_url: string | null;
  documentation_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface CvVersion {
  id: string;
  user_id: string;
  name: string;
  file_url: string;
  file_size: string | null;
  is_default: boolean;
  target_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiGeneration {
  id: string;
  user_id: string;
  type: "resume_optimizer" | "interview_prep" | "portfolio_summary" | "follow_up";
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  model_used: string | null;
  tokens_used: number | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "interview_reminder" | "follow_up" | "deadline" | "system" | "ai_insight";
  is_read: boolean;
  action_url: string | null;
  scheduled_for: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "technical" | "soft" | "tool" | "language" | "framework";
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  created_at: string;
  skill?: Skill;
}

export interface Contact {
  id: string;
  user_id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PortfolioSettings {
  id: string;
  user_id: string;
  show_hero: boolean;
  show_about: boolean;
  show_skills: boolean;
  show_projects: boolean;
  show_resume: boolean;
  show_contact: boolean;
  theme: string;
  custom_css: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Form Input Types (for create/update operations)
// ============================================================

export type ApplicationInput = {
  company_name: string;
  job_title: string;
  location?: string;
  job_url?: string;
  status?: Application["status"];
  priority?: Application["priority"];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  date_applied?: string;
  follow_up_date?: string;
  notes?: string;
  source?: Application["source"];
  contact_name?: string;
  contact_email?: string;
};

export type ProjectInput = {
  title: string;
  slug?: string;
  category?: Project["category"];
  description?: string;
  business_problem?: string;
  solution?: string;
  technologies?: string[];
  skills_used?: string[];
  github_url?: string;
  demo_url?: string;
  dashboard_url?: string;
  documentation_url?: string;
  image_url?: string;
  is_featured?: boolean;
  status?: Project["status"];
};

export type ProfileInput = Partial<
  Pick<
    Profile,
    | "full_name"
    | "username"
    | "professional_title"
    | "bio"
    | "experience_level"
    | "career_path"
    | "target_role"
    | "location"
    | "linkedin_url"
    | "github_url"
    | "website_url"
    | "avatar_url"
    | "resume_url"
    | "onboarding_complete"
    | "is_public"
  >
>;
