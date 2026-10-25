import { robotsTxt } from "@/lib/md/site-files";
import { textResponse } from "@/lib/md/http";

// Generated in code (not app/robots.ts) so it can carry comments for AI agents.
export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return textResponse(robotsTxt());
}
