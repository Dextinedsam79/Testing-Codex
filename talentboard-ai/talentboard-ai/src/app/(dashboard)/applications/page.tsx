import { ApplicationsClient } from "./applications-client";
import { getApplications } from "@/lib/data/applications";

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return <ApplicationsClient applications={applications} />;
}
