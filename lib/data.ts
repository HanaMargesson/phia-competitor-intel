import { COMPETITORS } from "./competitors";
import {
  fetchAdsForCompetitor,
  topHooks,
  inferFormats,
} from "./meta-ad-library";
import { mockLive } from "./mock-data";
import type { CompetitorLive, DashboardData } from "./types";

/**
 * Build the full dashboard payload — either from the Meta Ad Library
 * (when META_AD_LIBRARY_TOKEN is set) or from the mock data set.
 *
 * Server-side only; called from API routes and (via revalidation) from the page.
 */
export async function buildDashboardData(): Promise<DashboardData> {
  const fetchedAt = new Date().toISOString();
  const token = process.env.META_AD_LIBRARY_TOKEN;

  if (!token) {
    return {
      generatedAt: fetchedAt,
      anyLive: false,
      sourceNote: "Mock data — set META_AD_LIBRARY_TOKEN in Vercel env to go live.",
      competitors: COMPETITORS.map((c) => mockLive(c, fetchedAt)),
    };
  }

  const live: CompetitorLive[] = await Promise.all(
    COMPETITORS.map(async (c): Promise<CompetitorLive> => {
      // Brands explicitly marked dark / no page IDs → use editorial.
      if (c.editorial?.darkStatus || c.pageIds.length === 0) {
        return mockLive(c, fetchedAt);
      }

      const res = await fetchAdsForCompetitor(c.pageIds, c.country);
      if (!res.ok || res.ads.length === 0) {
        return { ...mockLive(c, fetchedAt), source: "cached" };
      }

      const liveHooks = topHooks(res.ads, 5);
      const liveFormats = inferFormats(res.ads);
      const ed = c.editorial;

      return {
        slug: c.slug,
        name: c.name,
        subname: c.subname,
        layer: c.layer,
        source: "live",
        fetchedAt,
        activeAdCount: res.count,
        hooks: liveHooks.length > 0 ? liveHooks : ed?.hooks ?? [],
        formats: liveFormats.length > 0 ? liveFormats : ed?.formats ?? [],
        pattern: ed?.pattern ?? "",
        darkStatus: ed?.darkStatus,
        volOverride: ed?.volOverride,
        volTone: ed?.volTone,
      };
    }),
  );

  return {
    generatedAt: fetchedAt,
    anyLive: live.some((c) => c.source === "live"),
    sourceNote: live.some((c) => c.source === "live")
      ? "Live · Meta Ad Library"
      : "Cached / editorial fallback",
    competitors: live,
  };
}
