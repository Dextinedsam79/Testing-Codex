import Link from "next/link";
import {
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Mail,
  MapPin,
  Download,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  mockUser,
  mockProjects,
  mockSkills,
} from "@/lib/mock-data";
import { PROJECT_CATEGORIES, SKILL_CATEGORIES } from "@/lib/constants";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = mockUser; // In production, fetch by username
  const publishedProjects = mockProjects.filter(
    (p) => p.status === "published"
  );
  const featuredProjects = publishedProjects.filter((p) => p.isFeatured);
  const otherProjects = publishedProjects.filter((p) => !p.isFeatured);

  const skillsByCategory = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: mockSkills.filter((s) => s.category === cat.value),
  })).filter((c) => c.skills.length > 0);

  return (
    <div className="min-h-screen bg-card">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="font-display text-sm font-bold text-text">
            {user.fullName}
          </span>
          <nav className="hidden items-center gap-6 sm:flex">
            {["About", "Skills", "Projects", "Contact"].map((s) => (
              <a
                key={s}
                href={`#${s.toLowerCase()}`}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                {s}
              </a>
            ))}
          </nav>
          <a href={`mailto:${user.email}`}>
            <Button size="sm">
              <Mail size={14} />
              Hire Me
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-light)_0%,_transparent_50%)] opacity-50" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-8">
            {/* Avatar */}
            <div className="mb-6 flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary text-white text-3xl font-bold ring-4 ring-card sm:mb-0">
              AJ
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text">
                {user.fullName}
              </h1>
              <p className="mt-1 text-lg text-primary font-medium">
                {user.professionalTitle}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-sm text-text-muted sm:justify-start">
                <MapPin size={14} />
                {user.location}
              </p>
              <p className="mt-4 max-w-xl text-text-secondary leading-relaxed">
                {user.bio}
              </p>

              {/* Social links */}
              <div className="mt-5 flex items-center justify-center gap-3 sm:justify-start">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:border-border-hover hover:text-text transition-colors"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                )}
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:border-border-hover hover:text-text transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {user.websiteUrl && (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:border-border-hover hover:text-text transition-colors"
                    aria-label="Website"
                  >
                    <Globe size={16} />
                  </a>
                )}
                <Button variant="secondary" size="sm">
                  <Download size={14} />
                  Resume
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl font-bold text-text mb-8">
            Skills
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillsByCategory.map((cat) => (
              <div key={cat.value}>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        skill.proficiency === "expert"
                          ? "bg-primary-light text-primary"
                          : skill.proficiency === "advanced"
                          ? "bg-surface-dim text-text-secondary"
                          : "bg-surface-dim text-text-muted"
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl font-bold text-text mb-8">
            Projects
          </h2>

          {/* Featured */}
          {featuredProjects.length > 0 && (
            <div className="grid gap-6 mb-8">
              {featuredProjects.map((project) => {
                const category = PROJECT_CATEGORIES.find(
                  (c) => c.value === project.category
                );
                return (
                  <div
                    key={project.id}
                    className="grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"
                  >
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-light to-surface-dim flex items-center justify-center text-text-faint">
                      {category?.icon} Screenshot
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {category?.label} &middot; Featured
                      </span>
                      <h3 className="mt-2 font-display text-xl font-bold text-text">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.technologies.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-surface-dim px-2 py-0.5 text-xs font-medium text-text-secondary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-3">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm">
                              Live Demo
                              <ExternalLink size={14} />
                            </Button>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="secondary" size="sm">
                              <Github size={14} />
                              Source
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other projects */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => {
              const category = PROJECT_CATEGORIES.find(
                (c) => c.value === project.category
              );
              return (
                <div
                  key={project.id}
                  className="flex flex-col rounded-xl border border-border bg-card overflow-hidden card-hover"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary-light to-surface-dim flex items-center justify-center text-3xl opacity-50">
                    {category?.icon}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {category?.label}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-text">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted line-clamp-2 flex-1">
                      {project.description}
                    </p>
                    <div className="mt-3 flex gap-3 text-xs">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-text-muted hover:text-text"
                        >
                          <Github size={12} />
                          Source
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-text-muted hover:text-text"
                        >
                          <ExternalLink size={12} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-border bg-surface py-16"
      >
        <div className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-2xl font-bold text-text text-center mb-2">
            Get in Touch
          </h2>
          <p className="text-center text-sm text-text-muted mb-8">
            Interested in working together? Send me a message.
          </p>
          <form
            className="space-y-4 rounded-2xl border border-border bg-card p-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input label="Your Name" placeholder="Jane Doe" required />
            <Input
              label="Email"
              type="email"
              placeholder="jane@company.com"
              required
            />
            <Textarea
              label="Message"
              placeholder="Tell me about the opportunity..."
              required
            />
            <Button type="submit" className="w-full" size="lg">
              <Send size={16} />
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-text-muted">
        Built with{" "}
        <span className="font-semibold text-primary">TalentBoard AI</span>
      </footer>
    </div>
  );
}
