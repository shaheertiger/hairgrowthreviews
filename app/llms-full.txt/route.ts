import { llmsFullTxt } from "@/lib/md/site-files";
import { textResponse } from "@/lib/md/http";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return textResponse(llmsFullTxt());
}
