/**
 * /insights page data orchestrator â Phia's OWN ad performance.
 *
 * Pulls Phia's last-90-day Meta insights (when token + ad account env vars are
 * set), runs each ad through the same pattern-mining hook taxonomy used on the
 * /signal page, and combines: real performance metrics (hook rate, hold rate,
 * CPI, CTR) Ã the inferred hook archetype Ã format. Outputs the structure the
 * /insights page renders.
 *
 * When env is missing â mock fixture run through the same pipeline.
 */

import {
  classifyHook,
  extractFormula,
  HOOK_ARCHETYPES,
  type AdFormat,
  type CopyFormula,
  type HookArchetype,
} from "./pattern-mining";
import {
  fetchPhiaInsights,
  hookRate,
  holdRate,
  parseNumber,
  primaryActionType,
  type AdCreative,
  type MetaInsight,
} from "./phia-ads-api";
import { MOCK_PHIA_CREATIVES, MOCK_PHIA_INSIGHTS } from "./mock-phia-insights";

export interface PhiaAd {
  adId: string;
  adName: string;
  campaign?: string;
  hookText: string;
  hook: HookArchetype;
  hookLabel: string;
  format: AdFormat;
  formula: CopyFormula;
  // Live performance metrics
  spend: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number; // percent (0â100)
  cpc: number;
  cpm: number;
  hookRate: number; // 0â1
  holdRate: number; // 0â1
  primaryAction: { type: string; count: number; cpa: number } | null;
  // Composite "winning score" â combines hook rate, hold rate, CPI (lower better)
  score: number;
}

function inferFormatFromInsight(
  ins: MetaInsight,
  creative: AdCreative | undefined,
): AdFormat {
  // Video â look at video play actions
  const hasVideo =
    parseNumber(
      (ins.video_play_actions ?? []).find((a) => a.action_type === "video_view")
        ?.value,
    ) > 0 || !!creative?.video_id;

  if (!hasVideo) return "static";

  // UGC heuristic: first-person pronouns in opening copy
  const body = (creative?.body ?? "").slice(0, 100).toLowerCase();
  if (/\b(i|my|me|i'm|i've|i'll)\b/.test(body)) return "ugc-video";
  return "short-video";
}

function compositeScore(p: {
  hookRate: number;
  holdRate: number;
  cpi: number; // 0 if unknown
  hookFit: number;
}): number {
  // Higher hook rate + hold rate = better; lower CPI = better.
  // Normalize CPI: assume "great" CPI for Phia is ~$1.50; bad is $5+.
  const cpiScore = p.cpi === 0 ? 0.5 : Math.max(0, Math.min(1, (5 - p.cpi) / 3.5));
  // Weights: hook rate 40%, hold rate 25%, CPI 25%, hook fit 10%.
  const raw =
    p.hookRate * 0.4 +
    p.holdRate * 0.25 +
    cpiScore * 0.25 +
    (p.hookFit / 10) * 0.1;
  return Math.round(raw * 100) / 100;
}

function gradeInsight(ins: MetaInsight, creative?: AdCreative): PhiaAd {
  const hookText = creative?.body?.trim() || ins.ad_name?.trim() || "";
  const hook = classifyHook(hookText);
  const format = inferFormatFromInsight(ins, creative);
  const formula = extractFormula(hookText);
  const hr = hookRate(ins);
  const hold = holdRate(ins);
  const primary = primaryActionType(ins);
  const cpi = primary?.cpa ?? 0;
  const score = compositeScore({
    hookRate: hr,
    holdRate: hold,
    cpi,
    hookFit: HOOK_ARCHETYPES[hook].fit,
  });

  return {
    adId: ins.ad_id,
    adName: ins.ad_name ?? "(unnamed)",
    campaign: ins.campaign_name,
    hookText,
    hook,
    hookLabel: HOOK_ARCHETYPES[hook].label,
    format,
    formula,
    spend: parseNumber(ins.spend),
    impressions: parseNumber(ins.impressions),
    reach: parseNumber(ins.reach),
    frequency: parseNumber(ins.frequency),
    clicks: parseNumber(ins.clicks),
    ctr: parseNumber(ins.ctr),
    cpc: parseNumber(ins.cpc),
    cpm: parseNumber(ins.cpm),
    hookRate: hr,
    holdRate: hold,
    primaryAction: primary,
    score,
  };
}

/* ============================================================================
 * Aggregate views: hook-performance summary, format-performance summary
 * ============================================================================ */

export interface HookPerformance {
  hook: HookArchetype;
  label: string;
  fit: number;
  adCount: number;
  totalSpend: number;
  avgHookRate: number;
  avgHoldRate: number;
  avgCPI: number;
  topAd: PhiaAd | null;
}

export function hookPerformance(ads: PhiaAd[]): HookPerformance[] {
  const buckets = new Map<HookArchetype, PhiaAd[]>();
  for (const a of ads) {
    if (!buckets.has(a.hook)) buckets.set(a.hook, []);
    buckets.get(a.hook)!.push(a);
  }
  const rows: HookPerformance[] = [];
  for (const [hook, list] of buckets) {
    const adCount = list.length;
    const totalSpend = list.reduce((s, a) => s + a.spend, 0);
    const avgHookRate =
      list.reduce((s, a) => s + a.hookRate, 0) / Math.max(1, adCount);
    const avgHoldRate =
      list.reduce((s, a) => s + a.holdRate, 0) / Math.max(1, adCount);
    const cpiSamples = list
      .map((a) => a.primaryAction?.cpa ?? 0)
      .filter((v) => v > 0);
    const avgCPI =
      cpiSamples.length === 0
        ? 0
        : cpiSamples.reduce((s, v) => s + v, 0) / cpiSamples.length;
    const topAd = [...list].sort((a, b) => b.score - a.score)[0] ?? null;
    rows.push({
      hook,
      label: HOOK_ARCHETYPES[hook].label,
      fit: HOOK_ARCHETYPES[hook].fit,
      adCount,
      totalSpend,
      avgHookRate,
      avgHoldRate,
      avgCPI,
      topAd,
    });
  }
  return rows.sort((a, b) => b.avgHookRate - a.avgHookRate);
}

export interface FormatPerformance {
  format: AdFormat;
  adCount: number;
  totalSpend: number;
  avgHookRate: number;
  avgCPI: number;
}

export function formatPerformance(ads: PhiaAd[]): FormatPerformance[] {
  const buckets = new Map<AdFormat, PhiaAd[]>();
  for (const a of ads) {
    if (!buckets.has(a.format)) buckets.set(a.format, []);
    buckets.get(a.format)!.push(a);
  }
  const rows: FormatPerformance[] = [];
  for (const [format, list] of buckets) {
    const adCount = list.length;
    const totalSpend = list.reduce((s, a) => s + a.spend, 0);
    const avgHookRate =
      list.reduce((s, a) => s + a.hookRate, 0) / Math.max(1, adCount);
    const cpiSamples = list
      .map((a) => a.primaryAction?.cpa ?? 0)
      .filter((v) => v > 0);
    const avgCPI =
      cpiSamples.length === 0
        ? 0
        : cpiSamples.reduce((s, v) => s + v, 0) / cpiSamples.length;
    rows.push({ format, adCount, totalSpend, avgHookRate, avgCPI });
  }
  return rows.sort((a, b) => b.avgHookRate - a.avgHookRate);
}

/* ============================================================================
 * Page-level data shape
 * ============================================================================ */

export interface InsightsData {
  generatedAt: string;
  source: "live" | "mock";
  sourceNote: string;
  adsAnalyzed: number;
  totalSpend: number;
  totalInstalls: number;
  blendedCPI: number;
  topAds: PhiaAd[]; // sorted by score desc
  hookPerformance: HookPerformance[];
  formatPerformance: FormatPerformance[];
  /** Winning formula extracted from top 3 ads. */
  winningFormula: {
    dominantHook: HookArchetype;
    dominantHookLabel: string;
    dominantFormat: AdFormat;
    avgHookRate: number;
    avgCPI: number;
    sampleHooks: string[];
  } | null;
}

function deriveWinningFormula(
  topAds: PhiaAd[],
): InsightsData["winningFormula"] {
  if (topAds.length === 0) return null;
  const top3 = topAds.slice(0, 3);

  // Pick the most common hook archetype among the top 3.
  const hookCounts = new Map<HookArchetype, number>();
  for (const a of top3) hookCounts.set(a.hook, (hookCounts.get(a.hook) ?? 0) + 1);
  const dominantHook = Array.from(hookCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  // Most common format
  const formatCounts = new Map<AdFormat, number>();
  for (const a of top3)
    formatCounts.set(a.format, (formatCounts.get(a.format) ?? 0) + 1);
  const dominantFormat = Array.from(formatCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  const avgHookRate =
    top3.reduce((s, a) => s + a.hookRate, 0) / Math.max(1, top3.length);
  const cpiSamples = top3
    .map((a) => a.primaryAction?.cpa ?? 0)
    .filter((v) => v > 0);
  const avgCPI =
    cpiSamples.length === 0
      ? 0
      : cpiSamples.reduce((s, v) => s + v, 0) / cpiSamples.length;

  return {
    dominantHook,
    dominantHookLabel: HOOK_ARCHETYPES[dominantHook].label,
    dominantFormat,
    avgHookRate,
    avgCPI,
    sampleHooks: top3.map((a) => a.hookText),
  };
}

export async function buildInsightsData(): Promise<InsightsData> {
  const generatedAt = new Date().toISOString();
  const haveLiveEnv =
    !!process.env.META_INSIGHTS_TOKEN && !!process.env.META_AD_ACCOUNT_ID;

  let insights: MetaInsight[];
  let creatives: Map<string, AdCreative>;
  let source: "live" | "mock";
  let sourceNote: string;

  if (!haveLiveEnv) {
    insights = MOCK_PHIA_INSIGHTS;
    creatives = MOCK_PHIA_CREATIVES;
    source = "mock";
    sourceNote =
      "Mock fixture â set META_INSIGHTS_TOKEN + META_AD_ACCOUNT_ID in Vercel env to flip live.";
  } else {
    const res = await fetchPhiaInsights("last_90d", 200);
    if (!res.ok || res.count === 0) {
      insights = MOCK_PHIA_INSIGHTS;
      creatives = MOCK_PHIA_CREATIVES;
      source = "mock";
      sourceNote =
        res.error ?? "Live fetch returned no ads â showing mock fixture.";
    } else {
      insights = res.insights;
      creatives = res.creatives;
      source = "live";
      sourceNote = `Live Â· ${res.count} ads from Phia Ads Â· last 90 days`;
    }
  }

  const graded = insights.map((ins) => gradeInsight(ins, creatives.get(ins.ad_id)));
  const topAds = [...graded].sort((a, b) => b.score - a.score);

  const totalSpend = graded.reduce((s, a) => s + a.spend, 0);
  const totalInstalls = graded.reduce(
    (s, a) => s + (a.primaryAction?.count ?? 0),
    0,
  );
  const blendedCPI = totalInstalls === 0 ? 0 : totalSpend / totalInstalls;

  return {
    generatedAt,
    source,
    sourceNote,
    adsAnalyzed: graded.length,
    totalSpend,
    totalInstalls,
    blendedCPI,
    topAds,
    hookPerformance: hookPerformance(graded),
    formatPerformance: formatPerformance(graded),
    winningFormula: deriveWinningFormula(topAds),
  };
}
