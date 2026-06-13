# SYSTEM_ARCHITECTURE.md

# TalentBoard AI System Architecture

## Overview

TalentBoard AI is an AI-powered career operating system designed to help job seekers manage applications, optimize resumes, prepare for interviews, showcase portfolios, and receive personalized career insights.

The platform follows a modern cloud-native architecture built with:

- Next.js
- TypeScript
- Supabase
- PostgreSQL
- AI APIs (Gemini/OpenAI)
- Vercel

---

# High-Level Architecture

```text
┌──────────────────────────┐
│        End User          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Next.js Frontend    │
│   React + TypeScript     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Application Layer   │
│  Server Actions / APIs   │
└────────────┬─────────────┘
             │
 ┌───────────┼────────────┐
 ▼           ▼            ▼

Supabase    AI Layer     Storage
Auth        Gemini       Supabase Storage
Database    OpenAI
```

---

# Architectural Goals

The platform was designed with the following principles:

## Simplicity

Rapid development with minimal infrastructure complexity.

## Scalability

Support future growth without major redesign.

## Security

Protect user information using authentication and row-level security.

## AI-First Design

Integrate AI into the user's career workflow.

## Modular Development

Each product feature operates independently.

---

# System Components

## Frontend Layer

### Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Responsibilities

- User Interface
- Client-side State
- Form Handling
- Dashboard Rendering
- User Interaction

### Major Pages

```text
Landing Page
Authentication
Dashboard
Applications
AI Hub
Portfolio
Settings
```

---

# Backend Layer

## Technology

Supabase

### Responsibilities

- Authentication
- Database Operations
- Storage
- Security Policies

---

# Authentication Architecture

## Service

Supabase Authentication

### Authentication Flow

```text
User
 │
 ▼
Sign Up
 │
 ▼
Supabase Auth
 │
 ▼
auth.users
 │
 ▼
Trigger
(handle_new_user)
 │
 ▼
profiles
```

### Supported Operations

- Sign Up
- Sign In
- Sign Out
- Session Validation
- Password Recovery

---

# Database Architecture

## Database

PostgreSQL (Supabase)

### Core Tables

```text
profiles
applications
interviews
projects
cv_versions
portfolio_settings
```

### Relationships

```text
auth.users
      │
      ▼
profiles
      │
      ├── applications
      ├── interviews
      ├── projects
      ├── cv_versions
      └── portfolio_settings
```

---

# Application Tracking Module

## Purpose

Track the user's job search pipeline.

### Workflow

```text
Application Created
        │
        ▼
Applied
        │
        ▼
Screening
        │
        ▼
Interview
        │
        ▼
Offer
        │
        ▼
Rejected
```

### Features

- CRUD Operations
- Kanban Board
- Status Tracking
- Dashboard Metrics

---

# AI Layer Architecture

## Purpose

Provide intelligent career assistance.

### Services

- Gemini AI
- OpenAI

---

# AI Resume Optimizer

### Inputs

```text
Resume
Job Description
```

### Outputs

```text
Match Score
Keyword Analysis
Optimization Suggestions
ATS Recommendations
```

### Flow

```text
User Input
      │
      ▼
Prompt Builder
      │
      ▼
AI Model
      │
      ▼
Generated Recommendations
```

---

# AI Interview Generator

### Inputs

```text
Role
Job Description
```

### Outputs

```text
Behavioral Questions
Technical Questions
Suggested Answers
Preparation Tips
```

### Flow

```text
User Input
      │
      ▼
Prompt Engine
      │
      ▼
AI Model
      │
      ▼
Interview Package
```

---

# Portfolio Management Module

## Purpose

Allow users to showcase projects professionally.

### Features

```text
Project Management
Skill Display
Public Portfolio
External Links
Project Gallery
```

### Data Source

```text
projects
portfolio_settings
```

---

# Dashboard Architecture

## Purpose

Provide a unified overview of user activity.

### Metrics

```text
Applications Sent
Interviews Scheduled
Offers Received
Response Rate
```

### Data Sources

```text
applications
interviews
profiles
```

---

# Storage Architecture

## Service

Supabase Storage

### Assets

```text
User Avatars
Resume Files
Portfolio Images
```

### Benefits

- Secure Uploads
- Scalable Storage
- Public/Private Access Control

---

# Security Architecture

## Authentication

Supabase Auth

---

## Authorization

Row Level Security (RLS)

### Example Policy

```sql
auth.uid() = user_id
```

Users can only access their own records.

---

## Data Protection

Protected:

```text
Personal Information
Resumes
Applications
Interview Notes
Portfolio Content
```

---

# Deployment Architecture

## Frontend Hosting

Vercel

### Responsibilities

- Static Assets
- Server Components
- Server Actions
- Edge Delivery

---

## Backend Hosting

Supabase Cloud

### Responsibilities

- PostgreSQL
- Authentication
- Storage
- Security

---

# Request Lifecycle

## Example: Create Application

```text
User
 │
 ▼
Application Form
 │
 ▼
Server Action
 │
 ▼
Supabase Client
 │
 ▼
applications Table
 │
 ▼
Success Response
 │
 ▼
Dashboard Refresh
```

---

# AI Request Lifecycle

## Example: Resume Optimization

```text
User Uploads Resume
          │
          ▼
Resume Optimizer
          │
          ▼
Prompt Builder
          │
          ▼
Gemini/OpenAI
          │
          ▼
AI Response
          │
          ▼
Rendered Insights
```

---

# Scalability Considerations

Future-ready architecture supports:

### Phase 2

```text
AI Career Coach
Job Recommendations
Resume Versioning
```

### Phase 3

```text
Recruiter Portal
Recruiter Dashboard
Job Posting System
```

### Phase 4

```text
Mobile Application
Browser Extension
AI Career Agent
```

---

# Monitoring & Maintenance

## Application Monitoring

- Vercel Analytics
- Browser Error Tracking

## Database Monitoring

- Supabase Dashboard
- Query Performance
- Authentication Logs

## AI Monitoring

- Token Usage
- Response Times
- Error Tracking

---

# Technology Summary

| Layer | Technology |
|---------|------------|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Authentication | Supabase Auth |
| Database | PostgreSQL |
| Storage | Supabase Storage |
| AI Services | Gemini / OpenAI |
| Deployment | Vercel |

---

# Author

Samuel George-Ubah

10Alytics AI Web Development Bootcamp

Capstone Project

TalentBoard AI