/**
 * /signal page data orchestrator.
 *
 * - When META_AD_LIBRARY_TOKEN is set AND ads_read is approved: pulls live ads
 *   from the Meta Ad Library API across the configured competitor set, grades
 *   each ad through the pattern-mining taxonomy, and returns ranked clusters.
 *
 * - When the token is missing: returns the mock fixture run through the same
 *   pipeline. The /signal page renders identically â only the source-pill
 *   changes.
 */

import { COMPETITORS } from "./competitors";
import { fetchAdsForCompetitor, type AdLibraryAd } from "./meta-ad-library";
import {
  clusterByHook,
  formatMix,
  gradeAd,
  longevityMix,
  topAdsByScore,
  type FormatBreakdown,
  type GradedAd,
  type HookCluster,
  type LongevityBreakdown,
} from "./pattern-mining";
import { MOCK_COMPETITOR_ADS } from "./mock-graded-ads";

export interface SignalData {
  generatedAt: string;
  source: "live" | "mock";
  sourceNote: string;
  totalAds: number;
  brandsCovered: string[];
  clusters: HookCluster[];
  topAds: GradedAd[];
  formatMix: FormatBreakdown[];
  longevityMix: LongevityBreakdown[];
}

export async function buildSignalData(): Promise<SignalData> {
  const token = process.env.META_AD_LIBRARY_TOKEN;
  const generatedAt = new Date().toISOString();

  // No token â mock path.
  if (!token) {
    const graded = MOCK_COMPETITOR_ADS.map((ad) => gradeAd(ad));
    return {
      generatedAt,
      source: "mock",
      sourceNote:
        "Mock fixture â Meta ads_read App Review pending. Once approved, /signal pulls live across all 18 competitors weekly.",
      totalAds: graded.length,
      brandsCovered: Array.from(new Set(graded.map((g) => g.brand))).sort(),
      clusters: clusterByHook(graded),
      topAds: topAdsByScore(graded, 10),
      formatMix: formatMix(graded),
      longevityMix: longevityMix(graded),
    };
  }

  // Live path â pull ads for every competitor with page IDs.
  const competitorsWithPages = COMPETITORS.filter(
    (c) => (c.pageIds?.length ?? 0) > 0,
  );
  const fetches = await Promise.all(
    competitorsWithPages.map(async (c) => {
      const res = await fetchAdsForCompetitor(c.pageIds, c.country);
      return { brand: c.name, ads: res.ok ? res.ads : [] };
    }),
  );

  const allAds: Array<{ brand: string; ad: AdLibraryAd }> = [];
  for (const f of fetches) for (const a of f.ads) allAds.push({ brand: f.brand, ad: a });

  const graded = allAds.map(({ brand, ad }) => gradeAd(ad, brand));

  // If live fetch returned zero ads (token invalid, App Review still pending,
  // rate-limited, etc.), fall back to mock so the page never goes blank.
  if (graded.length === 0) {
    const fallback = MOCK_COMPETITOR_ADS.map((ad) => gradeAd(ad));
    return {
      generatedAt,
      source: "mock",
      sourceNote:
        "Live fetch returned no ads â likely ads_read still in App Review. Showing mock fixture.",
      totalAds: fallback.length,
      brandsCovered: Array.from(new Set(fallback.map((g) => g.brand))).sort(),
      clusters: clusterByHook(fallback),
      topAds: topAdsByScore(fallback, 10),
      formatMix: formatMix(fallback),
      longevityMix: longevityMix(fallback),
    };
  }

  return {
    generatedAt,
    source: "live",
    sourceNote: `Live Â· ${graded.length} ads across ${
      Array.from(new Set(graded.map((g) => g.brand))).length
    } competitors`,
    totalAds: graded.length,
    brandsCovered: Array.from(new Set(graded.map((g) => g.brand))).sort(),
    clusters: clusterByHook(graded),
    topAds: topAdsByScore(graded, 10),
    formatMix: formatMix(graded),
    longevityMix: longevityMix(graded),
  };
}
