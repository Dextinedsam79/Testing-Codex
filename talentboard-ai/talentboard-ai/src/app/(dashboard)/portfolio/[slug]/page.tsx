import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = mockProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const category = PROJECT_CATEGORIES.find(
    (c) => c.value === project.category
  );

  return (
    <div className="space-y-6">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Portfolio
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge>{category?.label}</Badge>
            <Badge variant={project.status === "published" ? "success" : "default"}>
              {project.status}
            </Badge>
            {project.isFeatured && <Badge variant="warning">Featured</Badge>}
          </div>
          <h1 className="font-display text-2xl font-bold text-text">
            {project.title}
          </h1>
          <p className="mt-1 text-text-secondary">{project.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm">
            <Edit size={14} />
            Edit
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Business problem */}
          {project.businessProblem && (
            <Card>
              <CardHeader>
                <CardTitle>Business Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {project.businessProblem}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Solution */}
          {project.solution && (
            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {project.solution}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Screenshots placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Screenshots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {(project.images.length > 0
                  ? project.images
                  : [project.imageUrl]
                ).map((img, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg bg-gradient-to-br from-primary-light to-surface-dim flex items-center justify-center text-text-faint text-sm"
                  >
                    Screenshot {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:border-border-hover hover:text-text transition-colors"
                  >
                    <Github size={16} />
                    GitHub Repository
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:border-border-hover hover:text-text transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
                {project.documentationUrl && (
                  <a
                    href={project.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:border-border-hover hover:text-text transition-colors"
                  >
                    <FileText size={16} />
                    Documentation
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-surface-dim px-2.5 py-1 text-xs font-medium text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills used */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.skillsUsed.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Created</dt>
                  <dd className="text-text">{formatDate(project.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Updated</dt>
                  <dd className="text-text">{formatDate(project.updatedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Display Order</dt>
                  <dd className="text-text">#{project.displayOrder}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
