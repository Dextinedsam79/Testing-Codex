import { notFound } from "next/navigation";
import { getApplicationWithInterviews } from "@/lib/data/applications";
import { ApplicationDetailClient } from "./application-detail-client";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getApplicationWithInterviews(id);
  if (!data) notFound();

  return (
    <ApplicationDetailClient
      application={data.application}
      interviews={data.interviews}
    />
  );
}
