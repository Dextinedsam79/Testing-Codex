# DATABASE_SCHEMA.md

# TalentBoard AI Database Schema

## Overview

TalentBoard AI uses Supabase PostgreSQL as its primary database.

The database is responsible for:

- User Management
- Application Tracking
- Portfolio Management
- Resume Management
- Interview Tracking
- AI Outputs Storage
- Career Analytics

Authentication is handled by Supabase Auth while application data is stored in the public schema.

---

# Entity Relationship Overview

```text
auth.users
    │
    ▼
profiles
    │
    ├── applications
    │
    ├── interviews
    │
    ├── projects
    │
    ├── cv_versions
    │
    └── portfolio_settings
```

---

# Tables

## profiles

Stores user profile information.

### Columns

| Column | Type | Description |
|----------|----------|----------|
| id | UUID | Primary Key / Auth User ID |
| full_name | TEXT | User full name |
| email | TEXT | User email |
| username | TEXT | Public username |
| professional_title | TEXT | Career title |
| bio | TEXT | User biography |
| experience_level | ENUM | Career level |
| career_path | TEXT | Career field |
| target_role | TEXT | Desired role |
| location | TEXT | User location |
| linkedin_url | TEXT | LinkedIn profile |
| github_url | TEXT | GitHub profile |
| website_url | TEXT | Personal website |
| avatar_url | TEXT | Avatar image |
| resume_url | TEXT | Resume file |
| onboarding_complete | BOOLEAN | Onboarding status |
| is_public | BOOLEAN | Public profile visibility |
| created_at | TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | Last update |

---

### Constraints

```sql
PRIMARY KEY (id)

UNIQUE (email)

UNIQUE (username)

FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE
```

---

## applications

Tracks job applications.

### Purpose

Manage application lifecycle from submission to final outcome.

### Columns

| Column | Description |
|----------|----------|
| id | Application ID |
| user_id | Owner |
| company_name | Company |
| role_title | Position |
| location | Job Location |
| job_url | Original Job Link |
| status | Current Stage |
| notes | Additional Notes |
| application_date | Date Applied |
| created_at | Created |
| updated_at | Updated |

### Status Values

```text
Applied
Screening
Interview
Offer
Rejected
```

---

## interviews

Stores interview-related records.

### Columns

| Column | Description |
|----------|----------|
| id | Interview ID |
| user_id | Owner |
| application_id | Related Application |
| interview_type | Technical / Behavioral |
| scheduled_at | Scheduled Date |
| notes | Notes |
| feedback | Feedback |
| created_at | Created |
| updated_at | Updated |

---

## projects

Portfolio project records.

### Purpose

Allows users to showcase work publicly.

### Columns

| Column | Description |
|----------|----------|
| id | Project ID |
| user_id | Owner |
| title | Project Title |
| description | Project Description |
| technologies | Tech Stack |
| project_url | Live Link |
| github_url | Repository |
| image_url | Thumbnail |
| featured | Featured Project |
| created_at | Created |
| updated_at | Updated |

---

## cv_versions

Stores resume versions.

### Purpose

Maintain multiple resume versions for different job applications.

### Columns

| Column | Description |
|----------|----------|
| id | Resume Version ID |
| user_id | Owner |
| title | Version Name |
| file_url | Resume File |
| version_number | Version Number |
| created_at | Created |
| updated_at | Updated |

---

## portfolio_settings

Stores portfolio customization settings.

### Purpose

Controls public portfolio appearance.

### Columns

| Column | Description |
|----------|----------|
| id | Settings ID |
| user_id | Owner |
| theme | Theme Selection |
| headline | Portfolio Headline |
| summary | Profile Summary |
| social_links | Social Media Links |
| is_public | Public Visibility |
| created_at | Created |
| updated_at | Updated |

---

# Triggers

## on_auth_user_created

### Purpose

Automatically create a profile when a new user registers.

### Trigger

```sql
on_auth_user_created
```

### Function

```sql
handle_new_user()
```

### Workflow

```text
User Signs Up
        │
        ▼
auth.users
        │
        ▼
handle_new_user()
        │
        ▼
public.profiles
```

---

## Updated At Triggers

Automatically update timestamps.

### Triggers

```text
trg_profiles_updated_at
trg_applications_updated_at
trg_interviews_updated_at
trg_projects_updated_at
trg_cv_versions_updated_at
trg_portfolio_settings_updated_at
```

### Function

```sql
update_updated_at()
```

---

## Application Status Audit Trigger

### Trigger

```text
trg_log_app_status_change
```

### Function

```sql
log_application_status_change()
```

### Purpose

Track changes to application status history.

Example:

```text
Applied
→ Screening
→ Interview
→ Offer
```

---

# Functions

## handle_new_user()

Automatically creates profile records after registration.

### Logic

```text
New Auth User
        │
        ▼
Create Profile
        │
        ▼
Populate:
- id
- full_name
- email
```

---

## update_updated_at()

Updates updated_at timestamps automatically.

---

## log_application_status_change()

Creates audit entries whenever application status changes.

---

# Row Level Security (RLS)

## Security Model

Users may only access their own records.

### Example Policy

```sql
auth.uid() = user_id
```

Applied across:

- applications
- interviews
- projects
- cv_versions
- portfolio_settings

---

# Storage

Supabase Storage is used for:

### User Uploads

- Resume Files
- Portfolio Images
- User Avatars

---

# Database Design Principles

### Security First

Every record belongs to a specific authenticated user.

### Scalability

Schema supports future expansion:

- Recruiter Portal
- Career Coaching
- Job Matching

### Auditability

Application history is tracked through status logs.

### Performance

Indexes should exist on:

```sql
user_id

email

username

status

created_at
```

---

# Future Database Enhancements

## Planned Tables

### ai_requests

Track AI usage.

### career_insights

Store generated recommendations.

### recruiter_accounts

Recruiter management.

### job_matches

AI-generated job recommendations.

### notifications

User notification center.

---

# Database Provider

Supabase PostgreSQL

Version: Managed PostgreSQL (Supabase)

Environment: Production