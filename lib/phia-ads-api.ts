/**
 * Meta Marketing API client â Phia's own ad insights.
 *
 * Uses the System User token (generated in Business Manager â System Users)
 * to pull historical ad performance from the Phia Ads account.
 *
 * Endpoint: https://graph.facebook.com/v20.0/act_<AD_ACCOUNT_ID>/insights
 *
 * Required env:
 *   - META_INSIGHTS_TOKEN     (System User token, ads_read scope)
 *   - META_AD_ACCOUNT_ID      ("act_1234567890")
 *
 * Without those env vars, every call returns null and the caller falls back to
 * the mock fixture in mock-phia-insights.ts.
 */

const META_INSIGHTS_BASE = "https://graph.facebook.com/v20.0";

/** Per-ad insight fields the page renders. Order maps to display order. */
const INSIGHT_FIELDS = [
  "ad_id",
  "ad_name",
  "campaign_name",
  "adset_name",
  "spend",
  "impressions",
  "reach",
  "frequency",
  "clicks",
  "ctr",
  "cpc",
  "cpm",
  "actions", // installs / purchases / etc (we extract the primary action below)
  "cost_per_action_type",
  "video_p25_watched_actions",
  "video_p50_watched_actions",
  "video_p75_watched_actions",
  "video_p100_watched_actions",
  "video_play_actions",
  "date_start",
  "date_stop",
].join(",");

const CREATIVE_FIELDS = [
  "id",
  "name",
  "body",
  "title",
  "image_url",
  "thumbnail_url",
  "video_id",
  "object_story_spec",
].join(",");

export interface MetaInsightAction {
  action_type: string;
  value: string; // string from API; we parseFloat client-side
}

export interface MetaInsight {
  ad_id: string;
  ad_name?: string;
  campaign_name?: string;
  adset_name?: string;
  spend?: string;
  impressions?: string;
  reach?: string;
  frequency?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  actions?: MetaInsightAction[];
  cost_per_action_type?: MetaInsightAction[];
  video_p25_watched_actions?: MetaInsightAction[];
  video_p50_watched_actions?: MetaInsightAction[];
  video_p75_watched_actions?: MetaInsightAction[];
  video_p100_watched_actions?: MetaInsightAction[];
  video_play_actions?: MetaInsightAction[];
  date_start?: string;
  date_stop?: string;
}

export interface AdCreative {
  id: string;
  name?: string;
  body?: string;
  title?: string;
  image_url?: string;
  thumbnail_url?: string;
  video_id?: string;
}

export interface PhiaInsightsFetchResult {
  ok: boolean;
  count: number;
  insights: MetaInsight[];
  creatives: Map<string, AdCreative>;
  error?: string;
}

const FB_API_BASE = "https://graph.facebook.com/v20.0";

/**
 * Pull last-N-days insights for the Phia ad account, paginated.
 * date_preset values: last_7d, last_28d, last_90d, last_year, maximum.
 */
export async function fetchPhiaInsights(
  datePreset: "last_30d" | "last_90d" | "last_year" | "maximum" = "last_90d",
  cap = 200,
): Promise<PhiaInsightsFetchResult> {
  const token = process.env.META_INSIGHTS_TOKEN;
  const accountId = process.env.META_AD_ACCOUNT_ID;

  if (!token || !accountId) {
    return {
      ok: false,
      count: 0,
      insights: [],
      creatives: new Map(),
      error: "META_INSIGHTS_TOKEN or META_AD_ACCOUNT_ID not set",
    };
  }

  const normalizedAccount = accountId.startsWith("act_")
    ? accountId
    : `act_${accountId}`;

  const all: MetaInsight[] = [];
  let url: string | null =
    `${META_INSIGHTS_BASE}/${normalizedAccount}/insights?` +
    new URLSearchParams({
      access_token: token,
      level: "ad",
      date_preset: datePreset,
      fields: INSIGHT_FIELDS,
      limit: "100",
    }).toString();

  try {
    while (url && all.length < cap) {
      const res: Response = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        return {
          ok: false,
          count: all.length,
          insights: all,
          creatives: new Map(),
          error: `Meta Insights API ${res.status}: ${await res.text()}`,
        };
      }
      const json: { data?: MetaInsight[]; paging?: { next?: string } } =
        await res.json();
      if (Array.isArray(json.data)) all.push(...json.data);
      url = json.paging?.next ?? null;
    }

    // Fetch creative details for each ad in parallel (capped at 50 concurrent
    // to stay under Meta's rate limit). Creative endpoint is per-ad.
    const creatives = new Map<string, AdCreative>();
    const creativeFetches = all.slice(0, 50).map(async (ins) => {
      try {
        const cRes = await fetch(
          `${FB_API_BASE}/${ins.ad_id}?fields=creative{${CREATIVE_FIELDS}}&access_token=${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        if (!cRes.ok) return;
        const cJson: { creative?: AdCreative } = await cRes.json();
        if (cJson.creative) creatives.set(ins.ad_id, cJson.creative);
      } catch {
        // Silent â creative fetch failure shouldn't break the whole page.
      }
    });
    await Promise.all(creativeFetches);

    return { ok: true, count: all.length, insights: all, creatives };
  } catch (err) {
    return {
      ok: false,
      count: all.length,
      insights: all,
      creatives: new Map(),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/* ============================================================================
 * Derived metrics from raw Meta insights
 * ============================================================================ */

export function parseNumber(s?: string): number {
  if (!s) return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function findAction(
  actions: MetaInsightAction[] | undefined,
  type: string,
): number {
  if (!actions) return 0;
  return parseNumber(actions.find((a) => a.action_type === type)?.value);
}

/**
 * Hook rate proxy: 3-second video views Ã· impressions. When video_p25 isn't
 * available (image ad), falls back to CTR as a weaker proxy.
 */
export function hookRate(ins: MetaInsight): number {
  const impressions = parseNumber(ins.impressions);
  if (impressions === 0) return 0;
  const p25 = findAction(ins.video_p25_watched_actions, "video_view");
  if (p25 > 0) return p25 / impressions;
  return parseNumber(ins.ctr) / 100;
}

/** Hold rate: % of viewers who reached 75% of video. */
export function holdRate(ins: MetaInsight): number {
  const p25 = findAction(ins.video_p25_watched_actions, "video_view");
  if (p25 === 0) return 0;
  const p75 = findAction(ins.video_p75_watched_actions, "video_view");
  return p75 / p25;
}

/**
 * Primary action count â picks the first of {purchase, app_install, lead,
 * complete_registration} present in the actions array.
 */
const PRIMARY_ACTION_PRIORITY = [
  "purchase",
  "mobile_app_install",
  "app_install",
  "lead",
  "complete_registration",
  "link_click",
];

export function primaryActionType(
  ins: MetaInsight,
): { type: string; count: number; cpa: number } | null {
  for (const t of PRIMARY_ACTION_PRIORITY) {
    const count = findAction(ins.actions, t);
    if (count > 0) {
      const cpa = findAction(ins.cost_per_action_type, t);
      return { type: t, count, cpa };
    }
  }
  return null;
}
