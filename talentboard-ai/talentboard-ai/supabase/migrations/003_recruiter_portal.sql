-- ============================================================
-- TalentBoard AI - Recruiter Portal (Phase 2 - Future)
-- Migration: 003_recruiter_portal.sql
-- Description: Adds recruiter-facing tables for talent discovery,
--              candidate management, and notes.
-- ============================================================

-- ===================
-- 1. New ENUM types
-- ===================

CREATE TYPE recruiter_tier AS ENUM (
  'free', 'pro', 'enterprise'
);

CREATE TYPE candidate_status AS ENUM (
  'new', 'reviewing', 'shortlisted', 'contacted', 'interviewing', 'archived'
);

-- ===================
-- 2. Tables
-- ===================

-- ----- RECRUITER_PROFILES -----
-- Extends auth.users for recruiter accounts.
-- Recruiters authenticate via the same Supabase Auth but have a separate profile.
CREATE TABLE recruiter_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  company_name    TEXT NOT NULL,
  company_url     TEXT,
  job_title       TEXT,
  avatar_url      TEXT,
  tier            recruiter_tier DEFAULT 'free',
  max_saved       INTEGER DEFAULT 50,       -- limit based on tier
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_recruiter_profiles_updated_at
  BEFORE UPDATE ON recruiter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----- SAVED_CANDIDATES -----
-- Recruiters bookmark public profiles.
CREATE TABLE saved_candidates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id  UUID NOT NULL REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  candidate_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status        candidate_status DEFAULT 'new',
  saved_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(recruiter_id, candidate_id)
);

-- ----- TALENT_POOLS -----
-- Named groups of candidates (e.g. "Frontend Q1 Hiring").
CREATE TABLE talent_pools (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id  UUID NOT NULL REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_talent_pools_updated_at
  BEFORE UPDATE ON talent_pools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----- POOL_CANDIDATES -----
-- Junction between talent pools and candidates.
CREATE TABLE pool_candidates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id       UUID NOT NULL REFERENCES talent_pools(id) ON DELETE CASCADE,
  candidate_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(pool_id, candidate_id)
);

-- ----- RECRUITER_NOTES -----
-- Private notes recruiters attach to candidates.
CREATE TABLE recruiter_notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id  UUID NOT NULL REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  candidate_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER trg_recruiter_notes_updated_at
  BEFORE UPDATE ON recruiter_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ===================
-- 3. Indexes
-- ===================

CREATE INDEX idx_saved_candidates_recruiter ON saved_candidates(recruiter_id);
CREATE INDEX idx_saved_candidates_candidate ON saved_candidates(candidate_id);
CREATE INDEX idx_talent_pools_recruiter ON talent_pools(recruiter_id);
CREATE INDEX idx_pool_candidates_pool ON pool_candidates(pool_id);
CREATE INDEX idx_pool_candidates_candidate ON pool_candidates(candidate_id);
CREATE INDEX idx_recruiter_notes_recruiter ON recruiter_notes(recruiter_id);
CREATE INDEX idx_recruiter_notes_candidate ON recruiter_notes(recruiter_id, candidate_id);


-- ===================
-- 4. RLS Policies
-- ===================

ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notes ENABLE ROW LEVEL SECURITY;

-- Recruiter profiles: own data only
CREATE POLICY recruiter_profiles_select ON recruiter_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY recruiter_profiles_update ON recruiter_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Saved candidates: recruiter owns their saves
CREATE POLICY saved_candidates_all ON saved_candidates
  FOR ALL USING (auth.uid() = recruiter_id)
  WITH CHECK (auth.uid() = recruiter_id);

-- Talent pools: recruiter owns their pools
CREATE POLICY talent_pools_all ON talent_pools
  FOR ALL USING (auth.uid() = recruiter_id)
  WITH CHECK (auth.uid() = recruiter_id);

-- Pool candidates: accessible if recruiter owns the pool
CREATE POLICY pool_candidates_all ON pool_candidates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM talent_pools WHERE id = pool_candidates.pool_id AND recruiter_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM talent_pools WHERE id = pool_candidates.pool_id AND recruiter_id = auth.uid())
  );

-- Recruiter notes: private to the recruiter
CREATE POLICY recruiter_notes_all ON recruiter_notes
  FOR ALL USING (auth.uid() = recruiter_id)
  WITH CHECK (auth.uid() = recruiter_id);


-- ===================
-- ROLLBACK (down)
-- ===================
-- To roll back this migration, run:
--
-- DROP TABLE IF EXISTS recruiter_notes CASCADE;
-- DROP TABLE IF EXISTS pool_candidates CASCADE;
-- DROP TABLE IF EXISTS talent_pools CASCADE;
-- DROP TABLE IF EXISTS saved_candidates CASCADE;
-- DROP TABLE IF EXISTS recruiter_profiles CASCADE;
-- DROP TYPE IF EXISTS recruiter_tier;
-- DROP TYPE IF EXISTS candidate_status;
