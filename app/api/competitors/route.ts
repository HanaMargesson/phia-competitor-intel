import { NextResponse } from "next/server";
import { buildDashboardData } from "@/lib/data";

// Always run fresh — caching is handled by the page's ISR revalidate window.
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await buildDashboardData();
  return NextResponse.json(data);
}
