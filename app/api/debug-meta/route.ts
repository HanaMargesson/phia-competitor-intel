import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint — calls Meta Ad Library API directly with a known
 * test query and returns the raw response so we can see what's failing.
 *
 * GET /api/debug-meta?q=klarna
 */
export async function GET(req: Request) {
  const token = process.env.META_AD_LIBRARY_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "META_AD_LIBRARY_TOKEN not set" });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "klarna";

  const apiUrl =
    "https://graph.facebook.com/v20.0/ads_archive?" +
    new URLSearchParams({
      access_token: token,
      ad_reached_countries: JSON.stringify(["US"]),
      search_terms: q,
      ad_active_status: "ACTIVE",
      ad_type: "ALL",
      fields: "id,page_id,page_name,ad_creative_bodies,ad_delivery_start_time",
      limit: "5",
    }).toString();

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    const status = res.status;
    const ok = res.ok;
    const body = await res.text();

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(body);
    } catch {
      // body wasn't JSON
    }

    return NextResponse.json({
      ok,
      status,
      query: q,
      tokenPrefix: token.slice(0, 10) + "...",
      tokenLength: token.length,
      raw: parsed ?? body.slice(0, 800),
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
