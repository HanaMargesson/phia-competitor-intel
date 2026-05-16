import { NextRequest, NextResponse } from "next/server";
import { buildDashboardData } from "@/lib/data";
import { revalidatePath } from "next/cache";

/**
 * Weekly refresh cron — triggered by Vercel every Monday at 13:00 UTC.
 *
 * Verifies the request via:
 *   - Vercel's automatic `x-vercel-cron` header on scheduled invocations, OR
 *   - `?secret=` query param matching CRON_SECRET (for manual hits).
 *
 * On success, re-runs the dashboard build and revalidates the home page.
 */
export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const querySecret = req.nextUrl.searchParams.get("secret");
  const envSecret = process.env.CRON_SECRET;

  if (!isVercelCron && (!envSecret || querySecret !== envSecret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const data = await buildDashboardData();
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    triggeredBy: isVercelCron ? "vercel-cron" : "manual",
    generatedAt: data.generatedAt,
    anyLive: data.anyLive,
    competitorCount: data.competitors.length,
  });
}
