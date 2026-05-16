import type { CompetitorStatic, CompetitorLive } from "./types";

/**
 * Hand-curated "mock counts" used when the Meta Ad Library API is not
 * configured (no token) — keeps the dashboard meaningful in dev and on
 * first deploy. The counts are based on the May 2026 research pass.
 */
const MOCK_COUNTS: Record<string, number> = {
  daydream: 82,
  "alexa-shopping": 14,
  "perplexity-shopping": 0,
  "chatgpt-shopping": 120,
  klarna: 343,
  "google-shopping": 521,
  honey: 0,
  rakuten: 112,
  "capitalone-shopping": 71,
  "karma-cently-slickdeals": 8,
  "edge-coupons": 24,
  "shop-app": 184,
  depop: 311,
  poshmark: 642,
  thredup: 553,
  vestiaire: 57,
  mercari: 0,
  grailed: 0,
};

export function mockLive(c: CompetitorStatic, fetchedAt: string): CompetitorLive {
  const ed = c.editorial;
  const count = MOCK_COUNTS[c.slug] ?? null;
  return {
    slug: c.slug,
    name: c.name,
    subname: c.subname,
    layer: c.layer,
    source: "mock",
    fetchedAt,
    activeAdCount: ed?.darkStatus ? null : count,
    hooks: ed?.hooks ?? [],
    formats: ed?.formats ?? [],
    pattern: ed?.pattern ?? "",
    darkStatus: ed?.darkStatus,
    volOverride: ed?.volOverride,
    volTone: ed?.volTone,
  };
}
