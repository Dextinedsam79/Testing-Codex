import { getAuthenticatedAiContext } from "@/lib/data/ai-context";
import { PortfolioSummaryClient } from "./portfolio-summary-client";

export default async function PortfolioSummaryPage() {
  const context = await getAuthenticatedAiContext();

  return <PortfolioSummaryClient context={context} />;
}
