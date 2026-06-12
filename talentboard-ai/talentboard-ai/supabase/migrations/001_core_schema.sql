-- ============================================================
-- TalentBoard AI - Core Database Schema
-- Migration: 001_core_schema.sql
-- Description: Creates all MVP tables, indexes, RLS, triggers,
--              and storage buckets.
-- ============================================================

-- ===================
-- 1. Extensions
-- ===================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================
-- 2. Custom ENUM Types
-- ===================

CREATE TYPE experience_level AS ENUM (
  'entry', 'mid', 'senior', 'lead'
);

CREATE TYPE application_status AS ENUM (
  'saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'follow_up'
);

CREATE TYPE application_priority AS ENUM (
  'low', 'medium', 'high'
);

CREATE TYPE application_source AS ENUM (
  'linkedin', 'indeed', 'company', 'referral', 'glassdoor', 'angellist', 'other'
);

CREATE TYPE interview_type AS ENUM (
  'phone', 'technical', 'behavioral', 'panel', 'culture', 'final', 'other'
);

CREATE TYPE interview_status AS ENUM (
  'scheduled', 'completed', 'cancelled', 'rescheduled'
);

CREATE TYPE interview_outcome AS ENUM (
  'pending', 'passed', 'failed', 'no_decision'
);

CREATE TYPE project_category AS ENUM (
  'web', 'mobile', 'data', 'ai', 'design', 'devops', 'other'
);

CREATE TYPE project_status AS ENUM (
  'draft', 'published', 'archived'
);

CREATE TYPE ai_tool_type AS ENUM (
  'resume_optimizer', 'interview_prep', 'portfolio_summary', 'follow_up'
);

CREATE TYPE notification_type AS ENUM (
  'interview_reminder', 'follow_up', 'deadline', 'system', 'ai_insight'
);

CREATE TYPE skill_category AS ENUM (
  'technical', 'soft', 'tool', 'language', 'framework'
);

CREATE TYPE skill_proficiency AS ENUM (
  'beginner', 'intermediate', 'advanced', 'expert'
);

CREATE TYPE activity_action AS ENUM (
  'application_created', 'status_changed', 'ai_used',
  'project_added', 'cv_uploaded', 'profile_updated',
  'interview_scheduled', 'offer_received'
);

-- ===================
-- 3. Tables
-- ===================

-- ----- PROFILES -----
-- Extends Supabase auth.users with application-specific fields.
-- The id column mirrors auth.users.id (not auto-generated).
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  username      TEXT UNIQUE,
  professional_title TEXT,
  bio           TEXT,
  experience_level experience_level DEFAULT 'entry',
  career_path   TEXT,
  target_role   TEXT,
  location      TEXT,
  linkedin_url  TEXT,
  github_url    TEXT,
  website_url   TEXT,
  avatar_url    TEXT,
  resume_url    TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  is_public     BOOLEAN DEFAULT FALSE,           -- public portfolio visibility
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE profiles IS 'User profile extending Supabase auth. One row per authenticated user.';

-- ----- SKILLS (reference table) -----
-- Global catalog of skills. Users link to these via user_skills.
CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  category    skill_category NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE skills IS 'Global skill catalog shared across all users.';

-- ----- USER_SKILLS (junction) -----
CREATE TABLE user_skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id    UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency skill_proficiency DEFAULT 'intermediate',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, skill_id)
);

COMMENT ON TABLE user_skills IS 'Maps users to skills with proficiency levels.';

-- ----- CV_VERSIONS -----
CREATE TABLE cv_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_size   TEXT,
  is_default  BOOLEAN DEFAULT FALSE,
  target_role TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE cv_versions IS 'Resume/CV versions uploaded by users.';

-- ----- APPLICATIONS -----
CREATE TABLE applications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name      TEXT NOT NULL,
  job_title         TEXT NOT NULL,
  location          TEXT,
  job_url           TEXT,
  status            application_status DEFAULT 'saved' NOT NULL,
  priority          application_priority DEFAULT 'medium' NOT NULL,
  salary_min        INTEGER,
  salary_max        INTEGER,
  salary_currency   TEXT DEFAULT 'USD',
  cv_version_id     UUID REFERENCES cv_versions(id) ON DELETE SET NULL,
  portfolio_submitted BOOLEAN DEFAULT FALSE,
  date_applied      DATE,
  follow_up_date    DATE,
  notes             TEXT,
  source            application_source DEFAULT 'other',
  contact_name      TEXT,
  contact_email     TEXT,
  kanban_order       INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE applications IS 'Job applications tracked by the user.';

-- ----- INTERVIEWS -----
CREATE TABLE interviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id    UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name      TEXT NOT NULL,
  job_title         TEXT NOT NULL,
  type              interview_type DEFAULT 'other' NOT NULL,
  round             TEXT,
  scheduled_at      TIMESTAMPTZ NOT NULL,
  duration_minutes  INTEGER DEFAULT 60,
  location          TEXT,
  meeting_url       TEXT,
  interviewer_name  TEXT,
  interviewer_role  TEXT,
  notes             TEXT,
  status            interview_status DEFAULT 'scheduled' NOT NULL,
  outcome           interview_outcome DEFAULT 'pending' NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE interviews IS 'Interviews linked to job applications.';

-- ----- PROJECTS -----
CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL,
  category          project_category DEFAULT 'other' NOT NULL,
  description       TEXT,
  business_problem  TEXT,
  solution          TEXT,
  technologies      TEXT[] DEFAULT '{}',
  skills_used       TEXT[] DEFAULT '{}',
  github_url        TEXT,
  demo_url          TEXT,
  dashboard_url     TEXT,
  documentation_url TEXT,
  image_url         TEXT,
  is_featured       BOOLEAN DEFAULT FALSE,
  display_order     INTEGER DEFAULT 0,
  status            project_status DEFAULT 'draft' NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, slug)
);

COMMENT ON TABLE projects IS 'Portfolio projects showcased by users.';

-- ----- PROJECT_IMAGES -----
CREATE TABLE project_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  alt_text    TEXT,
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE project_images IS 'Additional screenshots/images for portfolio projects.';

-- ----- AI_GENERATIONS -----
CREATE TABLE ai_generations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        ai_tool_type NOT NULL,
  input_data  JSONB NOT NULL DEFAULT '{}',
  output_data JSONB NOT NULL DEFAULT '{}',
  model_used  TEXT,
  tokens_used INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE ai_generations IS 'Records of AI tool usage (resume optimizer, interview prep, etc).';

-- ----- NOTIFICATIONS -----
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  message       TEXT NOT NULL,
  type          notification_type DEFAULT 'system' NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  action_url    TEXT,
  scheduled_for TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE notifications IS 'In-app notifications and reminders for users.';

-- ----- ACTIVITY_LOG -----
CREATE TABLE activity_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action      activity_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE activity_log IS 'Audit trail of user actions for analytics and activity feed.';

-- ----- CONTACTS (public portfolio inbound) -----
CREATE TABLE contacts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name   TEXT NOT NULL,
  sender_email  TEXT NOT NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE contacts IS 'Messages received through the public portfolio contact form.';

-- ----- PORTFOLIO_SETTINGS -----
CREATE TABLE portfolio_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  show_hero     BOOLEAN DEFAULT TRUE,
  show_about    BOOLEAN DEFAULT TRUE,
  show_skills   BOOLEAN DEFAULT TRUE,
  show_projects BOOLEAN DEFAULT TRUE,
  show_resume   BOOLEAN DEFAULT TRUE,
  show_contact  BOOLEAN DEFAULT TRUE,
  theme         TEXT DEFAULT 'default',
  custom_css    TEXT,
  meta_title    TEXT,
  meta_description TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE portfolio_settings IS 'Per-user settings for the public portfolio page.';


-- ===================
-- 4. Indexes
-- ===================

-- Profiles
CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;
CREATE INDEX idx_profiles_is_public ON profiles(is_public) WHERE is_public = TRUE;

-- Applications
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(user_id, status);
CREATE INDEX idx_applications_date_applied ON applications(user_id, date_applied DESC);
CREATE INDEX idx_applications_follow_up ON applications(follow_up_date)
  WHERE follow_up_date IS NOT NULL;
CREATE INDEX idx_applications_company ON applications(user_id, company_name);

-- Interviews
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_application_id ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled ON interviews(user_id, scheduled_at DESC);
CREATE INDEX idx_interviews_upcoming ON interviews(scheduled_at)
  WHERE status = 'scheduled';

-- Projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_featured ON projects(user_id, is_featured)
  WHERE is_featured = TRUE;
CREATE INDEX idx_projects_status ON projects(user_id, status);

-- CV Versions
CREATE INDEX idx_cv_versions_user_id ON cv_versions(user_id);

-- User Skills
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

-- AI Generations
CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_type ON ai_generations(user_id, type);
CREATE INDEX idx_ai_generations_created ON ai_generations(user_id, created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read)
  WHERE is_read = FALSE;
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for)
  WHERE scheduled_for IS NOT NULL;

-- Activity Log
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- Contacts
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_unread ON contacts(user_id, is_read) WHERE is_read = FALSE;


-- ===================
-- 5. Triggers
-- ===================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_cv_versions_updated_at
  BEFORE UPDATE ON cv_versions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_portfolio_settings_updated_at
  BEFORE UPDATE ON portfolio_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- Log activity when application status changes
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO activity_log (user_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.user_id,
      'status_changed',
      'application',
      NEW.id,
      jsonb_build_object(
        'company', NEW.company_name,
        'old_status', OLD.status::TEXT,
        'new_status', NEW.status::TEXT
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_log_app_status_change
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION log_application_status_change();


-- ===================
-- 6. Row Level Security
-- ===================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
-- skills is a public reference table; RLS not needed

-- ----- PROFILES -----
-- Users can read their own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Public profiles readable by anyone (for portfolio pages)
CREATE POLICY profiles_select_public ON profiles
  FOR SELECT USING (is_public = TRUE);

-- Users can update their own profile
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profile insert handled by trigger (SECURITY DEFINER), but allow direct insert too
CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ----- APPLICATIONS -----
CREATE POLICY applications_select ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY applications_insert ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY applications_update ON applications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY applications_delete ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- ----- INTERVIEWS -----
CREATE POLICY interviews_select ON interviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY interviews_insert ON interviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY interviews_update ON interviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY interviews_delete ON interviews
  FOR DELETE USING (auth.uid() = user_id);

-- ----- PROJECTS -----
-- Owner can do everything
CREATE POLICY projects_select_own ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Published projects visible on public portfolios
CREATE POLICY projects_select_public ON projects
  FOR SELECT USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = projects.user_id AND is_public = TRUE
    )
  );

CREATE POLICY projects_insert ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_update ON projects
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_delete ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- ----- PROJECT_IMAGES -----
CREATE POLICY project_images_select ON project_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_images.project_id
            AND (user_id = auth.uid() OR (status = 'published' AND EXISTS (
              SELECT 1 FROM profiles WHERE id = projects.user_id AND is_public = TRUE
            ))))
  );

CREATE POLICY project_images_insert ON project_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_images.project_id AND user_id = auth.uid())
  );

CREATE POLICY project_images_delete ON project_images
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_images.project_id AND user_id = auth.uid())
  );

-- ----- CV_VERSIONS -----
CREATE POLICY cv_versions_select ON cv_versions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY cv_versions_insert ON cv_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY cv_versions_update ON cv_versions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY cv_versions_delete ON cv_versions
  FOR DELETE USING (auth.uid() = user_id);

-- ----- USER_SKILLS -----
CREATE POLICY user_skills_select_own ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

-- Public portfolio: show skills if profile is public
CREATE POLICY user_skills_select_public ON user_skills
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = user_skills.user_id AND is_public = TRUE)
  );

CREATE POLICY user_skills_insert ON user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_skills_update ON user_skills
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_skills_delete ON user_skills
  FOR DELETE USING (auth.uid() = user_id);

-- ----- SKILLS (reference table - readable by all authenticated users) -----
-- No RLS enabled; accessible to all authenticated users via default Supabase config.

-- ----- AI_GENERATIONS -----
CREATE POLICY ai_generations_select ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY ai_generations_insert ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI generations are immutable: no update/delete policies

-- ----- NOTIFICATIONS -----
CREATE POLICY notifications_select ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY notifications_insert ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY notifications_update ON notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY notifications_delete ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ----- ACTIVITY_LOG -----
CREATE POLICY activity_log_select ON activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Inserts handled by triggers (SECURITY DEFINER) and direct app inserts
CREATE POLICY activity_log_insert ON activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity log is append-only: no update/delete policies

-- ----- CONTACTS -----
-- Portfolio owner can read messages sent to them
CREATE POLICY contacts_select ON contacts
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can insert (public contact form, no auth required)
CREATE POLICY contacts_insert_public ON contacts
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY contacts_update ON contacts
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY contacts_delete ON contacts
  FOR DELETE USING (auth.uid() = user_id);

-- ----- PORTFOLIO_SETTINGS -----
CREATE POLICY portfolio_settings_select ON portfolio_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY portfolio_settings_insert ON portfolio_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY portfolio_settings_update ON portfolio_settings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ===================
-- 7. Storage Buckets
-- ===================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', TRUE, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('resumes', 'resumes', FALSE, 5242880, ARRAY['application/pdf']),
  ('projects', 'projects', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

-- Storage RLS: avatars
CREATE POLICY storage_avatars_select ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY storage_avatars_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_avatars_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_avatars_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Storage RLS: resumes (private - only owner)
CREATE POLICY storage_resumes_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_resumes_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_resumes_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_resumes_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Storage RLS: projects (public read, owner write)
CREATE POLICY storage_projects_select ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY storage_projects_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'projects'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_projects_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'projects'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY storage_projects_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'projects'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );
