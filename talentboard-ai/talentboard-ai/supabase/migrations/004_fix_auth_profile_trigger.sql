-- ============================================================
-- TalentBoard AI - Auth Profile Trigger Hardening
-- Migration: 004_fix_auth_profile_trigger.sql
-- Description: Fixes Supabase sign-up failures caused by the
--              auth.users trigger not schema-qualifying public tables
--              and not handling duplicate/stale profile rows defensively.
-- ============================================================

-- Profiles do not need to enforce email uniqueness because auth.users is the
-- source of truth for identity uniqueness. Keeping this constraint can make a
-- stale profile row block future sign-ups with "Database error saving new user".
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_email_key;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_experience TEXT := NEW.raw_user_meta_data->>'experience_level';
  safe_experience public.experience_level := 'entry';
BEGIN
  IF raw_experience IN ('entry', 'mid', 'senior', 'lead') THEN
    safe_experience := raw_experience::public.experience_level;
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    career_path,
    experience_level
  )
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      NULLIF(SPLIT_PART(COALESCE(NEW.email, ''), '@', 1), ''),
      'New User'
    ),
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'career_path'), ''),
    safe_experience
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    career_path = COALESCE(EXCLUDED.career_path, public.profiles.career_path),
    experience_level = EXCLUDED.experience_level,
    updated_at = NOW();

  INSERT INTO public.portfolio_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
