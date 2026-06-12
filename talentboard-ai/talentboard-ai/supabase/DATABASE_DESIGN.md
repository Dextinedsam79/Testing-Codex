# TalentBoard AI - Database Design

## Entity-Relationship Diagram

```
                                    +---------------------+
                                    |    auth.users        |
                                    |  (Supabase managed)  |
                                    +----------+----------+
                                               |
                                               | 1
                                               |
                                               | 1
                                    +----------v----------+
                              +---->|      profiles        |
                              |     +----------+----------+
                              |                |
                              |                | 1
                              |                |
          +-------------------+--------+-------+--------+-------------------+
          |                   |        |                |                   |
          | *                 | *      | *              | *                 | *
+---------v-------+  +-------v-----+  |  +-------------v---+  +-----------v---------+
|  applications   |  |  projects   |  |  | cv_versions     |  | user_skills         |
+---------+-------+  +-------+-----+  |  +-----------------+  +---------------------+
          |                   |        |                                |
          | 1                 | 1      |                                | *
          |                   |        |                                |
          | *                 | *      |                          +-----v-----+
+---------v-------+  +-------v---------+                         |   skills   |
|   interviews    |  | project_images  |                         +-----------+
+-----------------+  +-----------------+
          |
          |
          |   * (user_id)              * (user_id)             * (user_id)
          |     +------------------+     +------------------+    +-------------------+
          +---->| ai_generations   |     | notifications    |    | activity_log      |
                +------------------+     +------------------+    +-------------------+

          * (user_id)                    * (user_id)
          +------------------+           +-------------------+
          | contacts         |           | portfolio_settings|
          +------------------+           +-------------------+


=== FUTURE: Recruiter Feature Tables ===

                                    +---------------------+
                                    |  recruiter_profiles  |-----+
                                    +----------+----------+     |
                                               |                |
                              +----------------+------+         |
                              |                       |         |
                              | *                     | *       | *
                    +---------v-------+     +---------v---+ +---v-----------+
                    | saved_candidates|     | talent_pools | | recruiter_   |
                    +-----------------+     +-------+-----+ | notes        |
                                                    |       +---------------+
                                                    | *
                                            +-------v-----------+
                                            | pool_candidates   |
                                            +-------------------+
```

## Table Relationships

| Parent            | Child              | Cardinality | FK Column      |
|-------------------|--------------------|-------------|----------------|
| auth.users        | profiles           | 1:1         | id             |
| profiles          | applications       | 1:N         | user_id        |
| profiles          | projects           | 1:N         | user_id        |
| profiles          | cv_versions        | 1:N         | user_id        |
| profiles          | user_skills        | 1:N         | user_id        |
| profiles          | ai_generations     | 1:N         | user_id        |
| profiles          | notifications      | 1:N         | user_id        |
| profiles          | activity_log       | 1:N         | user_id        |
| profiles          | contacts           | 1:N         | user_id        |
| profiles          | portfolio_settings | 1:1         | user_id        |
| applications      | interviews         | 1:N         | application_id |
| projects          | project_images     | 1:N         | project_id     |
| skills            | user_skills        | 1:N         | skill_id       |
| cv_versions       | applications       | 1:N (opt)   | cv_version_id  |

## Storage Buckets

| Bucket      | Purpose                          | Public | Max Size | Allowed Types                  |
|-------------|----------------------------------|--------|----------|--------------------------------|
| avatars     | User profile pictures            | Yes    | 2 MB     | image/png, image/jpeg, image/webp |
| resumes     | CV/resume PDF uploads            | No     | 5 MB     | application/pdf                |
| projects    | Project screenshots & images     | Yes    | 5 MB     | image/png, image/jpeg, image/webp, image/gif |

## Migration Plan

### Phase 1 - Core (MVP)
**Migration: `001_core_schema.sql`**
1. Enable extensions (uuid-ossp, pgcrypto)
2. Create ENUM types for all statuses
3. Create `profiles` table (trigger on auth.users insert)
4. Create `skills` (reference table)
5. Create `user_skills` (junction)
6. Create `cv_versions`
7. Create `applications`
8. Create `interviews`
9. Create `projects`
10. Create `project_images`
11. Create `ai_generations`
12. Create `notifications`
13. Create `activity_log`
14. Create `contacts`
15. Create `portfolio_settings`
16. Create all indexes
17. Apply RLS policies
18. Create storage buckets
19. Create triggers (updated_at, new user profile)

### Phase 2 - Recruiter Portal (Future)
**Migration: `002_recruiter_portal.sql`**
1. Create `recruiter_profiles`
2. Create `saved_candidates`
3. Create `talent_pools`
4. Create `pool_candidates`
5. Create `recruiter_notes`
6. Add `is_public` visibility controls to profiles
7. Add recruiter-specific RLS policies

### Phase 3 - Advanced Features (Future)
**Migration: `003_advanced_features.sql`**
1. Add ATS scoring columns to applications
2. Create `job_matches` table
3. Create `career_coach_sessions` (chatbot history)
4. Create `email_automations`
5. Add LinkedIn integration columns

### Rollback Strategy
- Each migration has a corresponding `down` section
- Migrations are idempotent (IF NOT EXISTS)
- Data-destructive changes (column drops) are deferred to separate migrations
- Foreign keys use RESTRICT to prevent accidental cascade deletes on critical data
- Backups via `pg_dump` before each migration in production
