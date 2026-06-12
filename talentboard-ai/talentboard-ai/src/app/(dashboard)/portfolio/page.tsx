import Link from "next/link";
import { Plus, ExternalLink, Github, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";

const categoryBadge: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "cyan" | "purple"> = {
  web: "primary",
  mobile: "purple",
  data: "cyan",
  ai: "warning",
  design: "success",
  devops: "default",
  other: "default",
};

export default function PortfolioPage() {
  const published = mockProjects.filter((p) => p.status === "published");
  const drafts = mockProjects.filter((p) => p.status === "draft");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Portfolio
          </h1>
          <p className="text-sm text-text-muted">
            {mockProjects.length} projects &middot;{" "}
            {published.length} published
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/p/alexjohnson" target="_blank">
            <Button variant="secondary" size="sm">
              <Eye size={14} />
              View Public Portfolio
            </Button>
          </Link>
          <Link href="/portfolio/new">
            <Button size="sm">
              <Plus size={14} />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured projects */}
      {published.filter((p) => p.isFeatured).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Featured
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {published
              .filter((p) => p.isFeatured)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </div>
      )}

      {/* All projects */}
      <div>
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          All Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {published
            .filter((p) => !p.isFeatured)
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Drafts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof mockProjects)[number];
}) {
  const category = PROJECT_CATEGORIES.find((c) => c.value === project.category);
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-border-hover hover:shadow-card"
    >
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary-light to-surface-dim flex items-center justify-center">
        <span className="text-4xl opacity-50">{category?.icon}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={categoryBadge[project.category] || "default"}>
            {category?.label}
          </Badge>
          {project.status === "draft" && (
            <Badge variant="default">Draft</Badge>
          )}
          {project.isFeatured && (
            <Badge variant="warning">Featured</Badge>
          )}
        </div>

        <h3 className="text-base font-semibold text-text group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-text-muted line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-3 flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-surface-dim px-2 py-0.5 text-[11px] font-medium text-text-secondary"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded-md bg-surface-dim px-2 py-0.5 text-[11px] font-medium text-text-faint">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="mt-3 flex items-center gap-3 pt-3 border-t border-border text-xs text-text-muted">
          {project.githubUrl && (
            <span className="flex items-center gap-1 hover:text-text">
              <Github size={12} />
              GitHub
            </span>
          )}
          {project.demoUrl && (
            <span className="flex items-center gap-1 hover:text-text">
              <ExternalLink size={12} />
              Live Demo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
