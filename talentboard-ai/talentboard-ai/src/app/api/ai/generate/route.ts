import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiContextForUser, type AiUserContext } from "@/lib/data/ai-context";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const resumeOutputSchema = z.object({
  score: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()).min(1).max(12),
  atsSuggestions: z.array(z.string()).min(1).max(8),
  improvedSummary: z.string().min(40),
  skillRecommendations: z
    .array(z.object({ skill: z.string(), reason: z.string() }))
    .min(1)
    .max(8),
});

const interviewOutputSchema = z.object({
  technical: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .min(1)
    .max(8),
  behavioral: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .min(1)
    .max(8),
  suggested: z.array(z.string()).min(1).max(10),
});

const portfolioOutputSchema = z.object({
  professionalBio: z.string().min(80),
  portfolioSummary: z.string().min(80),
  recruiterPitch: z.string().min(80),
});

const followUpOutputSchema = z.object({
  subject: z.string().min(8),
  body: z.string().min(80),
});

const requestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("resume_optimizer"),
    resumeText: z.string().optional(),
    jobDescription: z.string().min(20),
  }),
  z.object({
    type: z.literal("interview_prep"),
    jobTitle: z.string().min(2),
    jobDescription: z.string().optional(),
  }),
  z.object({
    type: z.literal("portfolio_summary"),
  }),
  z.object({
    type: z.literal("follow_up"),
    emailType: z.enum(["follow_up", "thank_you", "networking"]),
    recipientName: z.string().optional(),
    company: z.string().min(1),
    role: z.string().min(1),
    context: z.string().optional(),
  }),
]);

type AiRequest = z.infer<typeof requestSchema>;

type ProviderResult = {
  content: string;
  model: string;
  tokensUsed: number | null;
};

const outputSchemas = {
  resume_optimizer: resumeOutputSchema,
  interview_prep: interviewOutputSchema,
  portfolio_summary: portfolioOutputSchema,
  follow_up: followUpOutputSchema,
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to use AI tools." },
      { status: 401 }
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "The request is missing required AI input." },
      { status: 400 }
    );
  }

  try {
    const context = await getAiContextForUser(supabase, user.id);
    const prompt = buildPrompt(parsed.data, context);
    const result = await generateCompletion(prompt.system, prompt.user);
    const json = parseJsonObject(result.content);
    const output = outputSchemas[parsed.data.type].parse(json);

    const { error: persistError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      type: parsed.data.type,
      input_data: {
        ...parsed.data,
        contextSummary: summarizeContext(context),
      },
      output_data: output,
      model_used: result.model,
      tokens_used: result.tokensUsed,
    });

    if (persistError) {
      console.warn("AI generation persistence failed:", persistError.message);
    }

    return NextResponse.json({
      output,
      model: result.model,
      persisted: !persistError,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The AI provider could not generate a response.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildPrompt(input: AiRequest, context: AiUserContext) {
  const system = [
    "You are TalentBoard AI, a precise career operating system assistant.",
    "Return only valid JSON with no markdown fences, commentary, or extra keys.",
    "Be specific, commercially realistic, ATS-aware, and concise.",
  ].join(" ");

  if (input.type === "resume_optimizer") {
    return {
      system,
      user: [
        "Optimize the user's resume against this job description.",
        "JSON shape:",
        '{"score":78,"missingKeywords":["keyword"],"atsSuggestions":["tip"],"improvedSummary":"summary","skillRecommendations":[{"skill":"skill","reason":"reason"}]}',
        `User context: ${JSON.stringify(summarizeContext(context))}`,
        `Resume content: ${input.resumeText?.trim() || "No pasted resume text. Use profile, skills, projects, and CV metadata as the resume context."}`,
        `Job description: ${input.jobDescription}`,
      ].join("\n\n"),
    };
  }

  if (input.type === "interview_prep") {
    return {
      system,
      user: [
        "Generate tailored interview preparation for this target role.",
        "Create 5 technical questions, 4 behavioral questions with STAR-style model answers, and 6 concise practice prompts.",
        "JSON shape:",
        '{"technical":[{"question":"question","answer":"answer"}],"behavioral":[{"question":"question","answer":"answer"}],"suggested":["prompt"]}',
        `User context: ${JSON.stringify(summarizeContext(context))}`,
        `Job title: ${input.jobTitle}`,
        `Job description: ${input.jobDescription?.trim() || "Not provided."}`,
      ].join("\n\n"),
    };
  }

  if (input.type === "follow_up") {
    return {
      system,
      user: [
        "Write a polished, concise career email. Make it natural, specific, and confident without sounding exaggerated.",
        "JSON shape:",
        '{"subject":"subject","body":"email body"}',
        `User context: ${JSON.stringify(summarizeContext(context))}`,
        `Email type: ${input.emailType}`,
        `Recipient name: ${input.recipientName?.trim() || "Not provided"}`,
        `Company: ${input.company}`,
        `Role: ${input.role}`,
        `Extra context: ${input.context?.trim() || "Not provided."}`,
      ].join("\n\n"),
    };
  }

  return {
    system,
    user: [
      "Generate polished portfolio copy from the user's profile, skills, and projects.",
      "JSON shape:",
      '{"professionalBio":"bio","portfolioSummary":"summary","recruiterPitch":"pitch"}',
      `User context: ${JSON.stringify(summarizeContext(context))}`,
    ].join("\n\n"),
  };
}

async function generateCompletion(system: string, user: string): Promise<ProviderResult> {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === "gemini" || (!provider && process.env.GEMINI_API_KEY)) {
    return generateWithGemini(system, user);
  }

  return generateWithOpenAICompatible(system, user);
}

async function generateWithOpenAICompatible(
  system: string,
  user: string
): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY or OPENROUTER_API_KEY.");
  }

  const isOpenRouterKey = apiKey.startsWith("sk-or-");
  const baseUrl =
    process.env.OPENAI_BASE_URL ||
    (isOpenRouterKey ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1");
  const model =
    process.env.OPENAI_MODEL || (isOpenRouterKey ? "openai/gpt-4o-mini" : "gpt-4o-mini");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "TalentBoard AI",
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      max_tokens: 1800,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI provider error: ${text.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { total_tokens?: number };
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned an empty response.");
  }

  return {
    content,
    model,
    tokensUsed: data.usage?.total_tokens ?? null,
  };
}

async function generateWithGemini(system: string, user: string): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.25,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini provider error: ${text.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { totalTokenCount?: number };
  };
  const content = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("");

  if (!content) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    content,
    model,
    tokensUsed: data.usageMetadata?.totalTokenCount ?? null,
  };
}

function parseJsonObject(content: string): unknown {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI response was not valid JSON.");
    }
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function summarizeContext(context: AiUserContext) {
  return {
    profile: context.profile,
    skills: context.skills.map((skill) => ({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    })),
    projects: context.projects.map((project) => ({
      title: project.title,
      category: project.category,
      status: project.status,
      description: project.description,
      technologies: project.technologies,
      skillsUsed: project.skillsUsed,
    })),
    cvVersions: context.cvVersions.map((cv) => ({
      name: cv.name,
      isDefault: cv.isDefault,
      targetRole: cv.targetRole,
    })),
  };
}
