import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AiProfileContext = {
  fullName: string;
  email: string;
  professionalTitle: string | null;
  bio: string | null;
  experienceLevel: string | null;
  careerPath: string | null;
  targetRole: string | null;
  location: string | null;
};

export type AiSkillContext = {
  id: string;
  name: string;
  category: string;
  proficiency: string;
};

export type AiProjectContext = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  businessProblem: string | null;
  solution: string | null;
  technologies: string[];
  skillsUsed: string[];
  status: string;
  isFeatured: boolean;
};

export type AiCvContext = {
  id: string;
  name: string;
  fileSize: string | null;
  isDefault: boolean;
  targetRole: string | null;
};

export type AiUserContext = {
  profile: AiProfileContext | null;
  skills: AiSkillContext[];
  projects: AiProjectContext[];
  cvVersions: AiCvContext[];
};

type SkillJoinRow = {
  id: string;
  proficiency: string;
  skills: { name: string; category: string } | { name: string; category: string }[] | null;
};

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  business_problem: string | null;
  solution: string | null;
  technologies: string[] | null;
  skills_used: string[] | null;
  status: string;
  is_featured: boolean;
};

type CvRow = {
  id: string;
  name: string;
  file_size: string | null;
  is_default: boolean;
  target_role: string | null;
};

type ProfileRow = {
  full_name: string;
  email: string;
  professional_title: string | null;
  bio: string | null;
  experience_level: string | null;
  career_path: string | null;
  target_role: string | null;
  location: string | null;
};

export async function getAuthenticatedAiContext(): Promise<AiUserContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return getAiContextForUser(supabase, user.id);
}

export async function getAiContextForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<AiUserContext> {
  const [profileResult, skillsResult, projectsResult, cvResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name,email,professional_title,bio,experience_level,career_path,target_role,location"
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("user_skills")
      .select("id,proficiency,skills(name,category)")
      .eq("user_id", userId),
    supabase
      .from("projects")
      .select(
        "id,title,category,description,business_problem,solution,technologies,skills_used,status,is_featured"
      )
      .eq("user_id", userId)
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true }),
    supabase
      .from("cv_versions")
      .select("id,name,file_size,is_default,target_role")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.error) {
    throw new Error(`Unable to load profile context: ${profileResult.error.message}`);
  }
  if (skillsResult.error) {
    throw new Error(`Unable to load skills context: ${skillsResult.error.message}`);
  }
  if (projectsResult.error) {
    throw new Error(`Unable to load projects context: ${projectsResult.error.message}`);
  }
  if (cvResult.error) {
    throw new Error(`Unable to load resume context: ${cvResult.error.message}`);
  }

  const profile = profileResult.data as ProfileRow | null;

  return {
    profile: profile
      ? {
          fullName: profile.full_name,
          email: profile.email,
          professionalTitle: profile.professional_title,
          bio: profile.bio,
          experienceLevel: profile.experience_level,
          careerPath: profile.career_path,
          targetRole: profile.target_role,
          location: profile.location,
        }
      : null,
    skills: ((skillsResult.data ?? []) as unknown as SkillJoinRow[])
      .map((row) => {
        const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills;
        if (!skill) return null;

        return {
          id: row.id,
          name: skill.name,
          category: skill.category,
          proficiency: row.proficiency,
        };
      })
      .filter((skill): skill is AiSkillContext => Boolean(skill)),
    projects: ((projectsResult.data ?? []) as ProjectRow[]).map((project) => ({
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.description,
      businessProblem: project.business_problem,
      solution: project.solution,
      technologies: project.technologies ?? [],
      skillsUsed: project.skills_used ?? [],
      status: project.status,
      isFeatured: project.is_featured,
    })),
    cvVersions: ((cvResult.data ?? []) as CvRow[]).map((cv) => ({
      id: cv.id,
      name: cv.name,
      fileSize: cv.file_size,
      isDefault: cv.is_default,
      targetRole: cv.target_role,
    })),
  };
}
