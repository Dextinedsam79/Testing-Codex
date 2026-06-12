// ============================================================
// Application Status Configuration
// ============================================================

export const APPLICATION_STATUSES = [
  { value: 'saved', label: 'Saved', color: '#94A3B8', bgColor: '#F1F5F9' },
  { value: 'applied', label: 'Applied', color: '#4F46E5', bgColor: '#EEF2FF' },
  { value: 'screening', label: 'Screening', color: '#F59E0B', bgColor: '#FFFBEB' },
  { value: 'interview', label: 'Interview', color: '#06B6D4', bgColor: '#ECFEFF' },
  { value: 'offer', label: 'Offer', color: '#10B981', bgColor: '#ECFDF5' },
  { value: 'rejected', label: 'Rejected', color: '#EF4444', bgColor: '#FEF2F2' },
  { value: 'follow_up', label: 'Follow-Up', color: '#8B5CF6', bgColor: '#F5F3FF' },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]['value'];

// ============================================================
// Priority Configuration
// ============================================================

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#94A3B8', icon: '○' },
  { value: 'medium', label: 'Medium', color: '#F59E0B', icon: '◐' },
  { value: 'high', label: 'High', color: '#EF4444', icon: '●' },
] as const;

export type Priority = (typeof PRIORITIES)[number]['value'];

// ============================================================
// Project Categories
// ============================================================

export const PROJECT_CATEGORIES = [
  { value: 'web', label: 'Web App', icon: '🌐' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'data', label: 'Data Science', icon: '📊' },
  { value: 'ai', label: 'AI/ML', icon: '🤖' },
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'devops', label: 'DevOps', icon: '⚙️' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]['value'];

// ============================================================
// Experience Levels
// ============================================================

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Staff' },
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]['value'];

// ============================================================
// Career Paths
// ============================================================

export const CAREER_PATHS = [
  'Software Engineering',
  'Product Management',
  'Data Science',
  'UX/UI Design',
  'DevOps / SRE',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Architecture',
  'Full-Stack Development',
  'Mobile Development',
  'Data Analytics',
  'Project Management',
  'QA Engineering',
  'Technical Writing',
  'Other',
] as const;

// ============================================================
// Application Sources
// ============================================================

export const APPLICATION_SOURCES = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'company', label: 'Company Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'angellist', label: 'AngelList' },
  { value: 'other', label: 'Other' },
] as const;

// ============================================================
// Interview Types
// ============================================================

export const INTERVIEW_TYPES = [
  { value: 'phone', label: 'Phone Screen' },
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'panel', label: 'Panel' },
  { value: 'culture', label: 'Culture Fit' },
  { value: 'final', label: 'Final Round' },
  { value: 'other', label: 'Other' },
] as const;

// ============================================================
// AI Tool Types
// ============================================================

export const AI_TOOL_TYPES = [
  {
    value: 'resume_optimizer',
    label: 'Resume Optimizer',
    description: 'Optimize your resume for specific job descriptions with ATS-friendly suggestions.',
    icon: 'FileText',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    value: 'interview_prep',
    label: 'Interview Generator',
    description: 'Generate tailored interview questions with model answers and STAR responses.',
    icon: 'MessageSquare',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    value: 'portfolio_summary',
    label: 'Portfolio Summary',
    description: 'Generate a professional bio and recruiter pitch from your profile and projects.',
    icon: 'Sparkles',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    value: 'follow_up',
    label: 'Follow-Up Generator',
    description: 'Craft personalized follow-up emails, thank-you notes, and networking messages.',
    icon: 'Mail',
    gradient: 'from-emerald-500 to-teal-600',
  },
] as const;

// ============================================================
// Notification Types
// ============================================================

export const NOTIFICATION_TYPES = [
  { value: 'interview_reminder', label: 'Interview Reminder', icon: 'Calendar' },
  { value: 'follow_up', label: 'Follow-Up Due', icon: 'Clock' },
  { value: 'deadline', label: 'Deadline', icon: 'AlertTriangle' },
  { value: 'system', label: 'System', icon: 'Bell' },
  { value: 'ai_insight', label: 'AI Insight', icon: 'Sparkles' },
] as const;

// ============================================================
// Skill Categories
// ============================================================

export const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'tool', label: 'Tools' },
  { value: 'language', label: 'Languages' },
  { value: 'framework', label: 'Frameworks' },
] as const;

// ============================================================
// Navigation Items
// ============================================================

export const DASHBOARD_NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/applications', label: 'Applications', icon: 'ClipboardList' },
  { href: '/kanban', label: 'Kanban Board', icon: 'Columns3' },
  { href: '/portfolio', label: 'Portfolio', icon: 'FolderOpen' },
  { href: '/ai', label: 'AI Hub', icon: 'Sparkles' },
  { href: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/notifications', label: 'Notifications', icon: 'Bell' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;

export const MARKETING_NAV_ITEMS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#ai-tools', label: 'AI Tools' },
  { href: '#pricing', label: 'Pricing' },
] as const;
