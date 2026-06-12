-- ============================================================
-- TalentBoard AI - Seed Data
-- Migration: 002_seed_data.sql
-- Description: Populates tables with realistic demo data
--              matching the mock-data.ts fixtures.
--
-- NOTE: This seed uses a fixed demo user UUID. In production
--       the profile row is created automatically via the
--       on_auth_user_created trigger. This file is for local
--       development and Supabase Studio preview only.
-- ============================================================

-- ===================
-- Demo User ID
-- ===================
-- We use a deterministic UUID so all FK references are stable.
DO $$
DECLARE
  demo_uid UUID := '11111111-1111-1111-1111-111111111111';
BEGIN

-- ===================
-- Profile
-- ===================
INSERT INTO profiles (
  id, full_name, email, username, professional_title, bio,
  experience_level, career_path, target_role, location,
  linkedin_url, github_url, website_url,
  avatar_url, resume_url, onboarding_complete, is_public
) VALUES (
  demo_uid,
  'Alex Johnson',
  'alex.johnson@gmail.com',
  'alexjohnson',
  'Senior Frontend Engineer',
  'Passionate frontend engineer with 6+ years of experience building scalable web applications. Specializing in React, TypeScript, and design systems. Previously at Stripe and Shopify.',
  'senior',
  'Software Engineering',
  'Staff Frontend Engineer',
  'San Francisco, CA',
  'https://linkedin.com/in/alexjohnson',
  'https://github.com/alexjohnson',
  'https://alexjohnson.dev',
  '/images/avatar.jpg',
  '/resumes/alex-johnson-resume.pdf',
  TRUE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- ===================
-- Skills (global catalog)
-- ===================
INSERT INTO skills (id, name, category) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'React',             'framework'),
  ('a0000000-0000-0000-0000-000000000002', 'TypeScript',        'language'),
  ('a0000000-0000-0000-0000-000000000003', 'Next.js',           'framework'),
  ('a0000000-0000-0000-0000-000000000004', 'Node.js',           'framework'),
  ('a0000000-0000-0000-0000-000000000005', 'Python',            'language'),
  ('a0000000-0000-0000-0000-000000000006', 'PostgreSQL',        'tool'),
  ('a0000000-0000-0000-0000-000000000007', 'Tailwind CSS',      'framework'),
  ('a0000000-0000-0000-0000-000000000008', 'GraphQL',           'technical'),
  ('a0000000-0000-0000-0000-000000000009', 'Docker',            'tool'),
  ('a0000000-0000-0000-0000-000000000010', 'AWS',               'tool'),
  ('a0000000-0000-0000-0000-000000000011', 'Figma',             'tool'),
  ('a0000000-0000-0000-0000-000000000012', 'Git',               'tool'),
  ('a0000000-0000-0000-0000-000000000013', 'CI/CD',             'technical'),
  ('a0000000-0000-0000-0000-000000000014', 'System Design',     'technical'),
  ('a0000000-0000-0000-0000-000000000015', 'Leadership',        'soft'),
  ('a0000000-0000-0000-0000-000000000016', 'Communication',     'soft'),
  ('a0000000-0000-0000-0000-000000000017', 'Problem Solving',   'soft'),
  ('a0000000-0000-0000-0000-000000000018', 'D3.js',             'framework'),
  ('a0000000-0000-0000-0000-000000000019', 'Redux',             'framework'),
  ('a0000000-0000-0000-0000-000000000020', 'REST APIs',         'technical'),
  ('a0000000-0000-0000-0000-000000000021', 'Testing (Jest/RTL)','tool'),
  ('a0000000-0000-0000-0000-000000000022', 'Supabase',          'tool'),
  ('a0000000-0000-0000-0000-000000000023', 'SQL',               'language'),
  ('a0000000-0000-0000-0000-000000000024', 'AI/ML Fundamentals','technical')
ON CONFLICT (name) DO NOTHING;

-- ===================
-- User Skills
-- ===================
INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES
  (demo_uid, 'a0000000-0000-0000-0000-000000000001', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000002', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000003', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000004', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000005', 'intermediate'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000006', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000007', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000008', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000009', 'intermediate'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000010', 'intermediate'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000011', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000012', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000013', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000014', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000015', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000016', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000017', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000018', 'intermediate'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000019', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000020', 'expert'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000021', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000022', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000023', 'advanced'),
  (demo_uid, 'a0000000-0000-0000-0000-000000000024', 'intermediate')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- ===================
-- CV Versions
-- ===================
INSERT INTO cv_versions (id, user_id, name, file_url, file_size, is_default, target_role) VALUES
  ('c0000000-0000-0000-0000-000000000001', demo_uid, 'General SWE Resume',   '/resumes/alex-johnson-swe.pdf',        '245 KB', TRUE,  'Software Engineer'),
  ('c0000000-0000-0000-0000-000000000002', demo_uid, 'Frontend Specialist',  '/resumes/alex-johnson-frontend.pdf',    '238 KB', FALSE, 'Frontend Engineer'),
  ('c0000000-0000-0000-0000-000000000003', demo_uid, 'Design Engineering',   '/resumes/alex-johnson-design-eng.pdf',  '252 KB', FALSE, 'Design Technologist')
ON CONFLICT (id) DO NOTHING;

-- ===================
-- Applications
-- ===================
INSERT INTO applications (
  id, user_id, company_name, job_title, location, job_url,
  status, priority, salary_min, salary_max, salary_currency,
  cv_version_id, portfolio_submitted, date_applied, follow_up_date,
  notes, source, contact_name, contact_email, kanban_order
) VALUES
  ('b0000000-0000-0000-0000-000000000001', demo_uid, 'Stripe',    'Senior Frontend Engineer',  'San Francisco, CA (Hybrid)', 'https://stripe.com/jobs/frontend',    'interview',  'high',   180000, 220000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-10-15', '2024-10-28', 'Had a great initial call with the hiring manager. Technical round scheduled for next week.', 'referral',   'Sarah Chen',   'sarah.c@stripe.com',   1),
  ('b0000000-0000-0000-0000-000000000002', demo_uid, 'Vercel',    'Product Designer',          'Remote (US)',                'https://vercel.com/careers/designer',  'screening',  'high',   160000, 200000, 'USD', 'c0000000-0000-0000-0000-000000000002', TRUE,  '2024-10-18', '2024-10-30', 'Portfolio review stage. Submitted case study on design system project.',                      'linkedin',   'Mike Torres',  'mike@vercel.com',      1),
  ('b0000000-0000-0000-0000-000000000003', demo_uid, 'Linear',    'UI Engineer',               'Remote (Global)',            'https://linear.app/careers',           'applied',    'medium', 150000, 190000, 'USD', 'c0000000-0000-0000-0000-000000000001', FALSE, '2024-10-24', '2024-11-04', 'Applied through their website. Strong match with their tech stack.',                         'company',    '',             '',                     2),
  ('b0000000-0000-0000-0000-000000000004', demo_uid, 'OpenAI',    'Design Technologist',       'San Francisco, CA',          'https://openai.com/careers',           'screening',  'high',   200000, 280000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-10-22', '2024-11-01', 'Exciting role combining design and engineering. AI experience is a plus.',                    'linkedin',   'David Park',   'david.p@openai.com',   2),
  ('b0000000-0000-0000-0000-000000000005', demo_uid, 'Notion',    'Senior Software Engineer',  'San Francisco, CA (Hybrid)', 'https://notion.so/careers',            'offer',      'high',   190000, 230000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-09-28', NULL,         'Received offer! $210K base + equity. Need to respond by Nov 5.',                             'referral',   'Emily Zhang',  'emily.z@notion.so',    1),
  ('b0000000-0000-0000-0000-000000000006', demo_uid, 'Figma',     'Frontend Engineer',         'San Francisco, CA',          'https://figma.com/careers',            'rejected',   'medium', 170000, 210000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-09-15', NULL,         'Rejected after final round. Feedback: strong technical skills but looking for more WebGL experience.', 'company', 'Lisa Wang', 'lisa@figma.com', 1),
  ('b0000000-0000-0000-0000-000000000007', demo_uid, 'Ramp',      'Staff Engineer, Platform',  'New York, NY (Hybrid)',      'https://ramp.com/careers',             'applied',    'medium', 200000, 260000, 'USD', 'c0000000-0000-0000-0000-000000000001', FALSE, '2024-10-26', '2024-11-06', 'Interesting fintech role. Strong match with platform engineering experience.',                'linkedin',   '',             '',                     3),
  ('b0000000-0000-0000-0000-000000000008', demo_uid, 'Shopify',   'Senior Frontend Developer', 'Remote (Americas)',          'https://shopify.com/careers',          'interview',  'medium', 165000, 200000, 'USD', 'c0000000-0000-0000-0000-000000000002', TRUE,  '2024-10-10', '2024-10-29', 'Past final round interview. Awaiting panel decision.',                                       'indeed',     'James Miller', 'james.m@shopify.com',  2),
  ('b0000000-0000-0000-0000-000000000009', demo_uid, 'Supabase',  'Frontend Engineer',         'Remote (Global)',            'https://supabase.com/careers',         'saved',      'low',    140000, 180000, 'USD', NULL,                                   FALSE, NULL,         NULL,         'Great company culture. Open-source focused. Will apply next week.',                          'company',    '',             '',                     1),
  ('b0000000-0000-0000-0000-000000000010', demo_uid, 'Datadog',   'Senior UI Engineer',        'New York, NY',               'https://datadoghq.com/careers',        'follow_up',  'medium', 175000, 215000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-10-05', '2024-10-28', 'No response after initial application. Need to follow up with recruiter.',                   'glassdoor',  '',             '',                     1),
  ('b0000000-0000-0000-0000-000000000011', demo_uid, 'Anthropic', 'Product Engineer',          'San Francisco, CA',          'https://anthropic.com/careers',        'applied',    'high',   210000, 300000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-10-25', '2024-11-05', 'Dream role in AI safety. Applied with tailored resume emphasizing AI/ML projects.',           'company',    '',             '',                     4),
  ('b0000000-0000-0000-0000-000000000012', demo_uid, 'Airbnb',    'Staff Frontend Engineer',   'San Francisco, CA (Hybrid)', 'https://airbnb.com/careers',           'interview',  'high',   220000, 280000, 'USD', 'c0000000-0000-0000-0000-000000000001', TRUE,  '2024-10-08', '2024-10-30', 'System design round completed. Behavioral round next Tuesday.',                              'referral',   'Nina Patel',   'nina.p@airbnb.com',    3)
ON CONFLICT (id) DO NOTHING;

-- ===================
-- Interviews
-- ===================
INSERT INTO interviews (
  id, application_id, user_id, company_name, job_title, type, round,
  scheduled_at, location, meeting_url, interviewer_name, interviewer_role,
  notes, status, outcome
) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', demo_uid, 'Stripe',  'Senior Frontend Engineer',  'technical',  'Round 2', '2024-10-29T14:00:00Z', 'Remote',        'https://zoom.us/j/123456789',       'Sarah Chen',   'Engineering Manager', 'Focus on React performance, state management patterns, and system design.',                                       'scheduled', 'pending'),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', demo_uid, 'Vercel',  'Product Designer',          'culture',    'Round 1', '2024-10-30T10:30:00Z', 'Remote',        'https://meet.google.com/abc-defg',  'Mike Torres',  'Head of Design',      'Prepare case study walkthrough. Focus on design process and collaboration.',                                       'scheduled', 'pending'),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000012', demo_uid, 'Airbnb',  'Staff Frontend Engineer',   'behavioral', 'Round 3', '2024-11-01T11:00:00Z', 'On-site (SF)',  '',                                  'Nina Patel',   'VP Engineering',      'Behavioral round. Prepare STAR examples for leadership, conflict resolution, and technical mentoring.',              'scheduled', 'pending'),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000008', demo_uid, 'Shopify', 'Senior Frontend Developer', 'panel',      'Final',   '2024-10-25T15:00:00Z', 'Remote',        'https://zoom.us/j/987654321',       'James Miller', 'Staff Engineer',      'Final panel. Team fit discussion.',                                                                                  'completed', 'pending')
ON CONFLICT (id) DO NOTHING;

-- ===================
-- Projects
-- ===================
INSERT INTO projects (
  id, user_id, title, slug, category, description, business_problem, solution,
  technologies, skills_used, github_url, demo_url, documentation_url,
  image_url, is_featured, display_order, status
) VALUES
  ('e0000000-0000-0000-0000-000000000001', demo_uid, 'TalentBoard AI',      'talentboard-ai',  'web',    'An intelligent career management platform that helps job seekers organize applications, optimize resumes, and prepare for interviews using AI.',                    'Job seekers struggle with managing applications across multiple platforms, leading to missed opportunities and disorganized job searches.',    'Built a centralized career OS with AI-powered resume optimization, interview preparation, and analytics dashboard.',             ARRAY['Next.js','TypeScript','Tailwind CSS','Supabase','OpenAI API'], ARRAY['React','PostgreSQL','AI Integration','UI/UX Design'],          'https://github.com/alexjohnson/talentboard-ai', 'https://talentboard.ai',          'https://docs.talentboard.ai',  '/images/projects/talentboard.png', TRUE,  1, 'published'),
  ('e0000000-0000-0000-0000-000000000002', demo_uid, 'FinFlow Dashboard',   'finflow-dashboard','data',   'A real-time financial analytics dashboard built for fintech startups to monitor transactions, revenue, and customer metrics.',                                        'Fintech startups lack affordable, real-time analytics tools that provide actionable insights from transaction data.',              'Created a streaming analytics dashboard with D3.js visualizations, real-time WebSocket updates, and customizable KPI tracking.',  ARRAY['React','D3.js','Node.js','PostgreSQL','WebSocket'],            ARRAY['Data Visualization','Backend Development','Real-time Systems'],'https://github.com/alexjohnson/finflow',         'https://finflow-demo.vercel.app', '',                             '/images/projects/finflow.png',     TRUE,  2, 'published'),
  ('e0000000-0000-0000-0000-000000000003', demo_uid, 'ShopSmart AI',        'shopsmart-ai',    'ai',     'An AI-powered e-commerce recommendation engine that personalizes product suggestions based on browsing behavior and purchase history.',                                'E-commerce platforms lose 70% of potential sales due to poor product recommendations and lack of personalization.',                'Built a collaborative filtering engine with transformer-based embeddings that increased conversion rates by 34%.',                ARRAY['Python','TensorFlow','FastAPI','Redis','React'],               ARRAY['Machine Learning','API Development','Python','React'],         'https://github.com/alexjohnson/shopsmart',       'https://shopsmart-demo.vercel.app','',                            '/images/projects/shopsmart.png',   TRUE,  3, 'published'),
  ('e0000000-0000-0000-0000-000000000004', demo_uid, 'DevBoard',            'devboard',        'web',    'A developer productivity dashboard that aggregates GitHub activity, CI/CD pipelines, and team metrics in one view.',                                                    'Engineering managers spend hours checking multiple tools (GitHub, Jira, CI systems) for team status updates.',                      'Unified dashboard pulling data from GitHub API, Jenkins, and Jira with customizable widgets and alert thresholds.',               ARRAY['Next.js','GraphQL','Prisma','Chart.js'],                       ARRAY['Full-Stack Development','API Integration','Data Visualization'], 'https://github.com/alexjohnson/devboard',      '',                                '',                             '/images/projects/devboard.png',    FALSE, 4, 'published'),
  ('e0000000-0000-0000-0000-000000000005', demo_uid, 'HealthPulse Mobile',  'healthpulse',     'mobile', 'A cross-platform health tracking app that monitors fitness goals, sleep patterns, and nutrition with AI-powered recommendations.',                                      'Existing health apps are fragmented -- users need separate apps for fitness, sleep, and nutrition tracking.',                       'Built a unified health companion with React Native, integrating Apple HealthKit and Google Fit APIs.',                             ARRAY['React Native','TypeScript','Firebase','TensorFlow Lite'],      ARRAY['Mobile Development','React Native','Health APIs'],             'https://github.com/alexjohnson/healthpulse',     '',                                '',                             '/images/projects/healthpulse.png',  FALSE, 5, 'published'),
  ('e0000000-0000-0000-0000-000000000006', demo_uid, 'CloudConfig',         'cloudconfig',     'devops', 'Infrastructure-as-code platform for managing multi-cloud deployments with visual topology mapping.',                                                                    'DevOps teams struggle to visualize and manage infrastructure across AWS, GCP, and Azure.',                                         'Built a visual IaC editor with Terraform integration, cost estimation, and drift detection.',                                     ARRAY['Go','React','Terraform','AWS SDK','Docker'],                   ARRAY['DevOps','Cloud Architecture','Go','React'],                    'https://github.com/alexjohnson/cloudconfig',     '',                                '',                             '/images/projects/cloudconfig.png',  FALSE, 6, 'draft')
ON CONFLICT (id) DO NOTHING;

-- ===================
-- Project Images
-- ===================
INSERT INTO project_images (project_id, image_url, alt_text, display_order) VALUES
  ('e0000000-0000-0000-0000-000000000001', '/images/projects/talentboard-dash.png',  'TalentBoard dashboard view',  1),
  ('e0000000-0000-0000-0000-000000000001', '/images/projects/talentboard-kanban.png', 'TalentBoard kanban board',    2);

-- ===================
-- Notifications
-- ===================
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url, scheduled_for, created_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', demo_uid, 'Interview Tomorrow',      'Your technical interview with Stripe is scheduled for tomorrow at 2:00 PM.',                       'interview_reminder', FALSE, '/applications/b0000000-0000-0000-0000-000000000001', '2024-10-28T09:00:00Z', '2024-10-28T09:00:00Z'),
  ('f0000000-0000-0000-0000-000000000002', demo_uid, 'Follow-Up Due',           'It''s been 7 days since you applied to Datadog. Consider sending a follow-up.',                    'follow_up',          FALSE, '/applications/b0000000-0000-0000-0000-000000000010', '2024-10-28T08:00:00Z', '2024-10-28T08:00:00Z'),
  ('f0000000-0000-0000-0000-000000000003', demo_uid, 'AI Insight: Resume Match', 'Your resume matches 92% of Frontend roles in Fintech. Consider adding Web3 keywords.',             'ai_insight',         FALSE, '/ai/resume-optimizer',                                NULL,                   '2024-10-27T14:00:00Z'),
  ('f0000000-0000-0000-0000-000000000004', demo_uid, 'Offer Deadline',           'Your offer from Notion expires on November 5th. 8 days remaining.',                                'deadline',           FALSE, '/applications/b0000000-0000-0000-0000-000000000005', '2024-10-27T10:00:00Z', '2024-10-27T10:00:00Z'),
  ('f0000000-0000-0000-0000-000000000005', demo_uid, 'New Application Tracked',  'You applied to Anthropic for Product Engineer. Good luck!',                                        'system',             TRUE,  '/applications/b0000000-0000-0000-0000-000000000011', NULL,                   '2024-10-25T16:00:00Z'),
  ('f0000000-0000-0000-0000-000000000006', demo_uid, 'Interview with Vercel',    'Culture fit interview with Vercel is on October 30 at 10:30 AM via Google Meet.',                  'interview_reminder', TRUE,  '/applications/b0000000-0000-0000-0000-000000000002', '2024-10-29T09:00:00Z', '2024-10-25T09:00:00Z'),
  ('f0000000-0000-0000-0000-000000000007', demo_uid, 'Weekly Report Ready',      'Your weekly career analytics report is ready. You applied to 4 positions this week.',              'system',             TRUE,  '/analytics',                                          NULL,                   '2024-10-21T08:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ===================
-- Activity Log
-- ===================
INSERT INTO activity_log (user_id, action, entity_type, entity_id, metadata, created_at) VALUES
  (demo_uid, 'application_created', 'application', 'b0000000-0000-0000-0000-000000000011', '{"company":"Anthropic","role":"Product Engineer"}',                                        '2024-10-25T16:00:00Z'),
  (demo_uid, 'status_changed',      'application', 'b0000000-0000-0000-0000-000000000005', '{"company":"Notion","old_status":"interview","new_status":"offer"}',                        '2024-10-27T16:00:00Z'),
  (demo_uid, 'ai_used',             'ai',          NULL,                                    '{"type":"resume_optimizer","company":"Stripe"}',                                           '2024-10-26T11:00:00Z'),
  (demo_uid, 'project_added',       'project',     'e0000000-0000-0000-0000-000000000001', '{"title":"TalentBoard AI"}',                                                                '2024-10-25T10:00:00Z'),
  (demo_uid, 'application_created', 'application', 'b0000000-0000-0000-0000-000000000007', '{"company":"Ramp","role":"Staff Engineer"}',                                                '2024-10-26T15:00:00Z'),
  (demo_uid, 'status_changed',      'application', 'b0000000-0000-0000-0000-000000000001', '{"company":"Stripe","old_status":"screening","new_status":"interview"}',                     '2024-10-20T14:30:00Z'),
  (demo_uid, 'ai_used',             'ai',          NULL,                                    '{"type":"interview_prep","company":"Airbnb"}',                                             '2024-10-24T09:00:00Z'),
  (demo_uid, 'cv_uploaded',         'cv',          'c0000000-0000-0000-0000-000000000003', '{"name":"Design Engineering"}',                                                             '2024-10-20T09:00:00Z');

-- ===================
-- Contacts
-- ===================
INSERT INTO contacts (user_id, sender_name, sender_email, message, is_read, created_at) VALUES
  (demo_uid, 'Rachel Kim',     'rachel.kim@techcorp.io', 'Hi Alex, I saw your portfolio and I''m really impressed by the TalentBoard AI project. We''re looking for a senior frontend engineer at TechCorp. Would you be open to chatting?', FALSE, '2024-10-27T15:00:00Z'),
  (demo_uid, 'Marcus Johnson', 'marcus@startup.co',      'Great work on the FinFlow Dashboard! We''re building something similar and would love to discuss a potential collaboration.',                                                        TRUE,  '2024-10-25T11:00:00Z');

-- ===================
-- Portfolio Settings
-- ===================
INSERT INTO portfolio_settings (user_id, show_hero, show_about, show_skills, show_projects, show_resume, show_contact, theme)
VALUES (demo_uid, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'default')
ON CONFLICT (user_id) DO NOTHING;

END $$;
