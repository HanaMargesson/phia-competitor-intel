/**
 * Pattern Mining â Step 2.5 of the Phia Growth Agent.
 *
 * Takes raw ads (from Meta Ad Library API once ads_read approves, or from Phia's
 * own Ads Insights API once the System User token lands) and grades them against
 * the 2026 hook taxonomy documented in COMPETITOR-PATTERNS.md.
 *
 * Outputs the data structure the /signal page renders.
 *
 * Until tokens land, this runs against the mock fixture in mock-graded-ads.ts so
 * the page renders end-to-end on Vercel and we can sanity-check the taxonomy.
 */

import type { AdLibraryAd } from "./meta-ad-library";

/* ============================================================================
 * Hook taxonomy â 6 archetypes from COMPETITOR-PATTERNS.md Â§2
 * ============================================================================ */

export type HookArchetype =
  | "pattern-interrupt"
  | "question"
  | "pain-point"
  | "transformation"
  | "social-proof"
  | "curiosity"
  | "unclassified";

export const HOOK_ARCHETYPES: Record<
  HookArchetype,
  { label: string; fit: number; description: string }
> = {
  "pattern-interrupt": {
    label: "Pattern Interrupt",
    fit: 10,
    description:
      "Opens with motion, expression, or graphic that breaks the scroll. Works without sound â native to Phia's editorial voice.",
  },
  question: {
    label: "Question",
    fit: 7,
    description:
      "Opens with a question that triggers self-identification and curiosity. Works if phrased intelligently â avoid infomercial tone.",
  },
  "pain-point": {
    label: "Pain Point",
    fit: 9,
    description:
      "Opens with a specific recognizable problem. Sharper specificity â higher resonance. No competitor naming needed.",
  },
  transformation: {
    label: "Transformation",
    fit: 8,
    description:
      "Before/after or outcome preview. Best in UGC mode with a creator on camera.",
  },
  "social-proof": {
    label: "Social Proof",
    fit: 6,
    description:
      "Opens with a number, testimonial fragment, or 'everyone is using' frame. Works at Phia scale (1M users) â avoid generic stars.",
  },
  curiosity: {
    label: "Curiosity",
    fit: 9,
    description:
      "Hints at outcome without revealing â fashion-magazine withhold technique. Native to editorial voice.",
  },
  unclassified: {
    label: "Unclassified",
    fit: 0,
    description: "Hook didn't match any known archetype â needs human review.",
  },
};

/* ============================================================================
 * Classifier â keyword + structure heuristics
 *
 * Intentionally simple (string matching) so it runs fast at the edge. When real
 * ad data lands we can layer a Haiku classifier on top of this baseline.
 * ============================================================================ */

const QUESTION_TRIGGERS = [
  "have you ever",
  "what if",
  "ever wondered",
  "did you know",
  "why do",
  "why are",
];
const PAIN_TRIGGERS = [
  "tired of",
  "sick of",
  "you closed",
  "you'll think about",
  "you'll pay",
  "still paying",
  "full price",
  "wasting",
  "missing out",
];
const TRANSFORMATION_TRIGGERS = [
  "used to",
  "now i",
  "before / after",
  "before/after",
  "watch what happens",
  "i applied",
  "i added",
  "the result",
];
const SOCIAL_PROOF_TRIGGERS = [
  "one million",
  "million people",
  "everyone is",
  "5 stars",
  "rated",
  "thousands of",
  "join the",
  "people are",
];
const CURIOSITY_TRIGGERS = [
  "the reason",
  "the question",
  "the button most",
  "there's a",
  "the secret",
  "what most",
  "nobody tells you",
  "you don't know",
];
const PATTERN_INTERRUPT_CUES = [
  "[visual]",
  "[cut to]",
  "[snap to]",
  "no narration",
  "silent",
  "text overlay",
];

export function classifyHook(adText: string): HookArchetype {
  const t = adText.toLowerCase();

  // Order matters â most specific patterns first.
  if (PATTERN_INTERRUPT_CUES.some((c) => t.includes(c))) return "pattern-interrupt";
  if (CURIOSITY_TRIGGERS.some((c) => t.includes(c))) return "curiosity";
  if (PAIN_TRIGGERS.some((c) => t.includes(c))) return "pain-point";
  if (TRANSFORMATION_TRIGGERS.some((c) => t.includes(c))) return "transformation";
  if (SOCIAL_PROOF_TRIGGERS.some((c) => t.includes(c))) return "social-proof";
  if (QUESTION_TRIGGERS.some((c) => t.includes(c)) || t.includes("?")) return "question";

  return "unclassified";
}

/* ============================================================================
 * Longevity scoring â active duration as proxy for "this ad works"
 *
 * Top-performing ecommerce accounts kill underperforming creative within 48
 * hours. So an ad still running past 30 days is almost certainly winning. Past
 * 60 days it's a "hero" worth deconstructing.
 * ============================================================================ */

export type LongevityTier = "hero" | "winner" | "tested" | "fresh";

export function scoreLongevity(activeDays: number): LongevityTier {
  if (activeDays >= 60) return "hero";
  if (activeDays >= 30) return "winner";
  if (activeDays >= 7) return "tested";
  return "fresh";
}

export const LONGEVITY_LABEL: Record<LongevityTier, string> = {
  hero: "Hero Â· 60+ days active",
  winner: "Winner Â· 30+ days active",
  tested: "Tested Â· 7+ days active",
  fresh: "Fresh Â· <7 days",
};

export function activeDaysFromMeta(ad: AdLibraryAd): number {
  if (!ad.ad_delivery_start_time) return 0;
  const start = new Date(ad.ad_delivery_start_time).getTime();
  const end = ad.ad_delivery_stop_time
    ? new Date(ad.ad_delivery_stop_time).getTime()
    : Date.now();
  return Math.max(0, Math.floor((end - start) / 86_400_000));
}

/* ============================================================================
 * Format inference â static / short-video / UGC / carousel
 *
 * Meta Ad Library doesn't expose media_type reliably for non-political ads,
 * so we use the same heuristics as inferFormats() but at the single-ad level.
 * ============================================================================ */

export type AdFormat = "static" | "short-video" | "ugc-video" | "carousel" | "unknown";

const FORMAT_LABEL: Record<AdFormat, string> = {
  static: "Static",
  "short-video": "Short Video",
  "ugc-video": "UGC Video",
  carousel: "Carousel",
  unknown: "Unknown",
};

export function inferAdFormat(ad: AdLibraryAd): AdFormat {
  const bodies = ad.ad_creative_bodies ?? [];
  if (bodies.length > 1) return "carousel";

  const body = bodies.join(" ");
  const platforms = ad.publisher_platforms ?? [];

  if (platforms.includes("instagram") && /reel|video|watch/i.test(body)) {
    return "short-video";
  }
  if (body.length > 240) return "short-video";
  if (body.length === 0) return "static";

  // UGC heuristic: first-person pronouns ("I", "my", "me") in opening copy.
  const opening = body.slice(0, 80).toLowerCase();
  if (/\b(i|my|me|i'm|i've|i'll)\b/.test(opening)) return "ugc-video";

  return "static";
}

/* ============================================================================
 * Copy formula extraction â opening verb / structure / CTA verb
 * ============================================================================ */

export interface CopyFormula {
  openingWord: string | null;
  ctaVerb: string | null;
  wordCount: number;
  hasNumber: boolean;
  endsWithQuestion: boolean;
}

const CTA_VERBS = [
  "shop",
  "save",
  "try",
  "get",
  "join",
  "discover",
  "find",
  "see",
  "learn",
  "claim",
  "unlock",
  "download",
  "install",
  "tap",
  "swipe",
];

export function extractFormula(adText: string): CopyFormula {
  const trimmed = adText.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? null;

  const lastSentence =
    trimmed.split(/[.!?]/).filter((s) => s.trim()).pop() ?? "";
  const ctaWords = lastSentence.toLowerCase().split(/\s+/).filter(Boolean);
  const ctaVerb =
    ctaWords
      .map((w) => w.replace(/[^a-z]/g, ""))
      .find((w) => CTA_VERBS.includes(w)) ?? null;

  return {
    openingWord: firstWord,
    ctaVerb,
    wordCount: words.length,
    hasNumber: /\d/.test(trimmed),
    endsWithQuestion: trimmed.endsWith("?"),
  };
}

/* ============================================================================
 * Composite score: longevity Ã hook fit Ã format weight
 * ============================================================================ */

const FORMAT_WEIGHT: Record<AdFormat, number> = {
  static: 1.4, // static drives 60â70% of ecom conversions
  "ugc-video": 1.3,
  "short-video": 1.0,
  carousel: 1.1,
  unknown: 0.8,
};

const LONGEVITY_WEIGHT: Record<LongevityTier, number> = {
  hero: 3.0,
  winner: 2.0,
  tested: 1.0,
  fresh: 0.5,
};

export interface GradedAd {
  adId: string;
  brand: string;
  /** First non-empty creative body, trimmed. Used as the displayed hook. */
  hookText: string;
  hook: HookArchetype;
  longevity: LongevityTier;
  activeDays: number;
  format: AdFormat;
  formatLabel: string;
  formula: CopyFormula;
  snapshotUrl?: string;
  /** Composite score: longevity Ã hook fit Ã format weight. Used to rank. */
  score: number;
}

export function gradeAd(ad: AdLibraryAd, brandFallback?: string): GradedAd {
  const bodies = ad.ad_creative_bodies ?? [];
  const hookText = bodies.find((b) => b.trim().length > 0)?.trim() ?? "";
  const hook = classifyHook(hookText);
  const activeDays = activeDaysFromMeta(ad);
  const longevity = scoreLongevity(activeDays);
  const format = inferAdFormat(ad);
  const formula = extractFormula(hookText);
  const score =
    LONGEVITY_WEIGHT[longevity] *
    (HOOK_ARCHETYPES[hook].fit / 10) *
    FORMAT_WEIGHT[format];

  return {
    adId: ad.id,
    brand: ad.page_name ?? brandFallback ?? "Unknown",
    hookText,
    hook,
    longevity,
    activeDays,
    format,
    formatLabel: FORMAT_LABEL[format],
    formula,
    snapshotUrl: ad.ad_snapshot_url,
    score: Math.round(score * 100) / 100,
  };
}

/* ============================================================================
 * Cluster + rank
 * ============================================================================ */

export interface HookCluster {
  hook: HookArchetype;
  label: string;
  description: string;
  fit: number;
  count: number;
  share: number; // 0..1
  topAds: GradedAd[]; // sorted by score desc
}

export function clusterByHook(ads: GradedAd[]): HookCluster[] {
  const buckets = new Map<HookArchetype, GradedAd[]>();
  for (const a of ads) {
    if (!buckets.has(a.hook)) buckets.set(a.hook, []);
    buckets.get(a.hook)!.push(a);
  }
  const total = ads.length || 1;
  const clusters: HookCluster[] = [];
  for (const [hook, list] of buckets) {
    const sorted = [...list].sort((a, b) => b.score - a.score);
    clusters.push({
      hook,
      label: HOOK_ARCHETYPES[hook].label,
      description: HOOK_ARCHETYPES[hook].description,
      fit: HOOK_ARCHETYPES[hook].fit,
      count: list.length,
      share: list.length / total,
      topAds: sorted.slice(0, 5),
    });
  }
  return clusters.sort((a, b) => b.count - a.count);
}

export function topAdsByScore(ads: GradedAd[], n = 10): GradedAd[] {
  return [...ads].sort((a, b) => b.score - a.score).slice(0, n);
}

export interface FormatBreakdown {
  format: AdFormat;
  label: string;
  count: number;
  share: number;
}

export function formatMix(ads: GradedAd[]): FormatBreakdown[] {
  const m = new Map<AdFormat, number>();
  for (const a of ads) m.set(a.format, (m.get(a.format) ?? 0) + 1);
  const total = ads.length || 1;
  return Array.from(m.entries())
    .map(([format, count]) => ({
      format,
      label: FORMAT_LABEL[format],
      count,
      share: count / total,
    }))
    .sort((a, b) => b.count - a.count);
}

export interface LongevityBreakdown {
  tier: LongevityTier;
  label: string;
  count: number;
  share: number;
}

export function longevityMix(ads: GradedAd[]): LongevityBreakdown[] {
  const m = new Map<LongevityTier, number>();
  for (const a of ads) m.set(a.longevity, (m.get(a.longevity) ?? 0) + 1);
  const total = ads.length || 1;
  const order: LongevityTier[] = ["hero", "winner", "tested", "fresh"];
  return order
    .map((tier) => ({
      tier,
      label: LONGEVITY_LABEL[tier],
      count: m.get(tier) ?? 0,
      share: (m.get(tier) ?? 0) / total,
    }))
    .filter((b) => b.count > 0);
}
