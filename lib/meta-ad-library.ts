/**
 * Meta Ad Library API client.
 *
 * Docs: https://www.facebook.com/ads/library/api
 *
 * Endpoint: https://graph.facebook.com/v20.0/ads_archive
 *
 * Required query params:
 *   - access_token
 *   - ad_reached_countries  (e.g., ["US"])
 *   - search_page_ids       (comma-sep)
 *   - ad_active_status      ("ACTIVE")
 *   - ad_type               ("ALL")
 *   - fields                (comma-sep, see below)
 *   - limit                 (max 250)
 *
 * Useful fields:
 *   id, page_id, page_name, ad_creative_bodies, ad_creative_link_captions,
 *   ad_delivery_start_time, ad_delivery_stop_time, publisher_platforms,
 *   ad_snapshot_url, media_type
 *
 * Without a token, every call returns null and the caller falls back to editorial.
 */

import type { FormatTag } from "./types";

const META_API_BASE = "https://graph.facebook.com/v20.0/ads_archive";
const META_FIELDS = [
  "id",
  "page_id",
  "page_name",
  "ad_creative_bodies",
  "ad_delivery_start_time",
  "ad_delivery_stop_time",
  "publisher_platforms",
  "ad_snapshot_url",
].join(",");

export type AdLibraryAd = {
  id: string;
  page_id?: string;
  page_name?: string;
  ad_creative_bodies?: string[];
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  publisher_platforms?: string[];
  ad_snapshot_url?: string;
};

export type AdLibraryFetchResult = {
  ok: boolean;
  count: number;
  ads: AdLibraryAd[];
  error?: string;
};

/**
 * Fetch active ads for a single Page ID in a given country.
 * Walks pagination until either the cap is hit or there are no more pages.
 */
export async function fetchAdsForPage(
  pageId: string,
  country: "US" = "US",
  cap: number = 500,
): Promise<AdLibraryFetchResult> {
  const token = process.env.META_AD_LIBRARY_TOKEN;
  if (!token) {
    return { ok: false, count: 0, ads: [], error: "META_AD_LIBRARY_TOKEN not set" };
  }

  const all: AdLibraryAd[] = [];
  let url: string | null =
    `${META_API_BASE}?` +
    new URLSearchParams({
      access_token: token,
      ad_reached_countries: JSON.stringify([country]),
      search_page_ids: pageId,
      ad_active_status: "ACTIVE",
      ad_type: "ALL",
      fields: META_FIELDS,
      limit: "250",
    }).toString();

  try {
    while (url && all.length < cap) {
      const res: Response = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        return {
          ok: false,
          count: all.length,
          ads: all,
          error: `Meta API ${res.status}: ${await res.text()}`,
        };
      }
      const json: { data?: AdLibraryAd[]; paging?: { next?: string } } = await res.json();
      if (Array.isArray(json.data)) all.push(...json.data);
      url = json.paging?.next ?? null;
    }
    return { ok: true, count: all.length, ads: all };
  } catch (err) {
    return {
      ok: false,
      count: all.length,
      ads: all,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Aggregate results across multiple page IDs (a brand can have several pages).
 */
export async function fetchAdsForCompetitor(
  pageIds: string[],
  country: "US" = "US",
): Promise<AdLibraryFetchResult> {
  if (pageIds.length === 0) {
    return { ok: false, count: 0, ads: [], error: "No page IDs configured" };
  }
  const results = await Promise.all(pageIds.map((p) => fetchAdsForPage(p, country)));
  const ads = results.flatMap((r) => r.ads);
  const firstError = results.find((r) => !r.ok)?.error;
  return {
    ok: results.every((r) => r.ok),
    count: ads.length,
    ads,
    error: firstError,
  };
}

/**
 * Extract top hook strings from ad creative bodies.
 * Strategy: dedupe by first-line, prefer shorter punchy lines, take top N.
 */
export function topHooks(ads: AdLibraryAd[], n: number = 5): string[] {
  const lineCounts = new Map<string, number>();
  for (const ad of ads) {
    for (const body of ad.ad_creative_bodies ?? []) {
      const firstLine = body
        .split(/\n|\.\s|\?\s|!\s/)[0]
        .trim()
        .replace(/\s+/g, " ");
      if (firstLine.length < 8 || firstLine.length > 120) continue;
      lineCounts.set(firstLine, (lineCounts.get(firstLine) ?? 0) + 1);
    }
  }
  return Array.from(lineCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([line]) => `"${line.replace(/^["']|["']$/g, "")}"`);
}

/**
 * Heuristic format breakdown from ad metadata.
 * We don't have direct "video vs. static" from Ad Library, but we can infer
 * from creative-body length and publisher_platforms.
 */
export function inferFormats(ads: AdLibraryAd[]): FormatTag[] {
  if (ads.length === 0) return [];

  let videoLike = 0;
  let staticLike = 0;
  let carouselLike = 0;
  let reelsLike = 0;

  for (const ad of ads) {
    const platforms = ad.publisher_platforms ?? [];
    const body = (ad.ad_creative_bodies ?? []).join(" ");
    if (platforms.includes("instagram") && /reel|video|watch/i.test(body)) reelsLike++;
    else if (body.length > 240) videoLike++;
    else if (body.length === 0) staticLike++;
    else if (/[•·]/.test(body) || (ad.ad_creative_bodies?.length ?? 0) > 1) carouselLike++;
    else staticLike++;
  }

  const total = videoLike + staticLike + carouselLike + reelsLike;
  if (total === 0) return [];

  const tags: FormatTag[] = [];
  const order: [string, number, FormatTag["tone"]][] = [
    ["Short Video", videoLike, "blue"],
    ["Static Image", staticLike, "default"],
    ["Carousel", carouselLike, "default"],
    ["Reels / TikTok", reelsLike, "warn"],
  ];
  for (const [label, count, tone] of order) {
    if (count / total > 0.15) tags.push({ label, tone });
  }
  return tags.slice(0, 4);
}
