import { HOOK_ARCHETYPES, classifyHook, extractFormula, type AdFormat, type HookArchetype } from "@/lib/pattern-mining";

export const revalidate = 1800;
export const metadata = {
  title: "Phia - Insights",
  description: "Step 1.6 -- Phia's own ad performance graded against the 2026 hook taxonomy.",
};

const FORMAT_LABEL: Record<string, string> = {
  static: "Static",
  "short-video": "Short Video",
  "ugc-video": "UGC Video",
  carousel: "Carousel",
  unknown: "Unknown",
};

interface MetaAction { action_type: string; value: string; }
interface MetaInsight {
  ad_id: string;
  ad_name?: string;
  campaign_name?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  actions?: MetaAction[];
  cost_per_action_type?: MetaAction[];
  video_p25_watched_actions?: MetaAction[];
  video_p75_watched_actions?: MetaAction[];
  video_play_actions?: MetaAction[];
}
interface AdCreative { body?: string; video_id?: string; }

const num = (s?: string) => (s ? parseFloat(s) || 0 : 0);
const findAct = (a: MetaAction[] | undefined, t: string) =>
  num(a?.find((x) => x.action_type === t)?.value);

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().split("T")[0];
};

// -- Mock fixture (Phia historical) ----------
const MOCK: Array<{ ins: MetaInsight; cre: AdCreative }> = [
  {
    ins: {
      ad_id: "120000001",
      ad_name: "Phia - Curiosity - The Question You Ask",
      campaign_name: "Phia Acquisition - Curiosity",
      spend: "8420.50", impressions: "1284000", clicks: "31200", ctr: "2.43",
      actions: [{ action_type: "mobile_app_install", value: "4280" }],
      cost_per_action_type: [{ action_type: "mobile_app_install", value: "1.97" }],
      video_play_actions: [{ action_type: "video_view", value: "412000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "298000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "121000" }],
    },
    cre: { body: "There's a question I ask before I buy anything online. Anywhere." },
  },
  {
    ins: {
      ad_id: "120000002",
      ad_name: "Phia - Pattern-Interrupt - Price Tag",
      campaign_name: "Phia Acquisition - Visual",
      spend: "6890.20", impressions: "942000", clicks: "26100", ctr: "2.77",
      actions: [{ action_type: "mobile_app_install", value: "3640" }],
      cost_per_action_type: [{ action_type: "mobile_app_install", value: "1.89" }],
      video_play_actions: [{ action_type: "video_view", value: "342000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "261000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "110000" }],
    },
    cre: { body: "[visual] tight crop on price tag -- snap cut to lower price -- silent" },
  },
  {
    ins: {
      ad_id: "120000003",
      ad_name: "Phia - Pain-Point - The Closed Tab",
      campaign_name: "Phia Acquisition - Pain",
      spend: "4120.80", impressions: "682000", clicks: "18900", ctr: "2.77",
      actions: [{ action_type: "mobile_app_install", value: "2410" }],
      cost_per_action_type: [{ action_type: "mobile_app_install", value: "1.71" }],
      video_play_actions: [{ action_type: "video_view", value: "228000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "168000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "68000" }],
    },
    cre: { body: "You closed the tab. You'll think about it for three days. Then you'll pay full price." },
  },
  {
    ins: {
      ad_id: "120000004",
      ad_name: "Phia - Transformation - UGC",
      campaign_name: "Phia Acquisition - UGC",
      spend: "5680.30", impressions: "812000", clicks: "22400", ctr: "2.76",
      actions: [{ action_type: "mobile_app_install", value: "3120" }],
      cost_per_action_type: [{ action_type: "mobile_app_install", value: "1.82" }],
      video_play_actions: [{ action_type: "video_view", value: "298000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "224000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "94000" }],
    },
    cre: { body: "I used to overpay for everything. Now I let Phia tell me what's fair." },
  },
  {
    ins: {
      ad_id: "120000005",
      ad_name: "Phia - Generic Discount",
      campaign_name: "Phia Acquisition - Discount",
      spend: "412.20", impressions: "98000", clicks: "920", ctr: "0.94",
      actions: [{ action_type: "mobile_app_install", value: "62" }],
      cost_per_action_type: [{ action_type: "mobile_app_install", value: "6.65" }],
      video_play_actions: [{ action_type: "video_view", value: "34000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "18000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "3200" }],
    },
    cre: { body: "Save big on everything you shop! Get the Phia browser extension free today!" },
  },
];

// -- Live Meta Marketing API fetch (graceful fallback to mock) ----------
async function fetchLive(): Promise<{ ins: MetaInsight; cre: AdCreative }[] | null> {
  const token = process.env.META_INSIGHTS_TOKEN;
  const acct = process.env.META_AD_ACCOUNT_ID;
  if (!token || !acct) return null;
  const id = acct.startsWith("act_") ? acct : `act_${acct}`;
  const fields = [
    "ad_id", "ad_name", "campaign_name", "spend", "impressions", "clicks", "ctr",
    "actions", "cost_per_action_type",
    "video_p25_watched_actions", "video_p75_watched_actions", "video_play_actions",
  ].join(",");
  try {
    const url = `https://graph.facebook.com/v20.0/${id}/insights?access_token=${encodeURIComponent(token)}&level=ad&date_preset=last_90d&fields=${fields}&limit=100`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: MetaInsight[] };
    if (!j.data?.length) return null;
    // Fetch creative bodies in parallel
    const pairs = await Promise.all(
      j.data.slice(0, 30).map(async (ins) => {
        let cre: AdCreative = {};
        try {
          const cr = await fetch(
            `https://graph.facebook.com/v20.0/${ins.ad_id}?fields=creative{body,video_id}&access_token=${encodeURIComponent(token)}`,
            { cache: "no-store" },
          );
          if (cr.ok) {
            const cj = (await cr.json()) as { creative?: AdCreative };
            cre = cj.creative ?? {};
          }
        } catch {}
        return { ins, cre };
      }),
    );
    return pairs;
  } catch {
    return null;
  }
}

// -- Grading ----------
interface GradedAd {
  adId: string;
  name: string;
  campaign?: string;
  hookText: string;
  hook: HookArchetype;
  hookLabel: string;
  format: AdFormat;
  hookRate: number;
  holdRate: number;
  spend: number;
  installs: number;
  cpi: number;
  score: number;
}

function grade(p: { ins: MetaInsight; cre: AdCreative }): GradedAd {
  const { ins, cre } = p;
  const hookText = (cre.body ?? ins.ad_name ?? "").trim();
  const hook = classifyHook(hookText);
  const impressions = num(ins.impressions);
  const p25 = findAct(ins.video_p25_watched_actions, "video_view");
  const p75 = findAct(ins.video_p75_watched_actions, "video_view");
  const hookRate = impressions > 0 ? (p25 > 0 ? p25 / impressions : num(ins.ctr) / 100) : 0;
  const holdRate = p25 > 0 ? p75 / p25 : 0;
  const hasVideo = findAct(ins.video_play_actions, "video_view") > 0 || !!cre.video_id;
  const opening = (cre.body ?? "").slice(0, 100).toLowerCase();
  const isUGC = /\b(i|my|me|i'm|i've)\b/.test(opening);
  const format: AdFormat = !hasVideo ? "static" : isUGC ? "ugc-video" : "short-video";
  const installs = findAct(ins.actions, "mobile_app_install");
  const cpi = findAct(ins.cost_per_action_type, "mobile_app_install");
  // Composite: hookRate 40% + holdRate 25% + CPI 25% + hookFit 10%
  const cpiScore = cpi === 0 ? 0.5 : Math.max(0, Math.min(1, (5 - cpi) / 3.5));
  const score =
    Math.round((hookRate * 0.4 + holdRate * 0.25 + cpiScore * 0.25 + (HOOK_ARCHETYPES[hook].fit / 10) * 0.1) * 100) /
    100;
  return {
    adId: ins.ad_id,
    name: ins.ad_name ?? "(unnamed)",
    campaign: ins.campaign_name,
    hookText,
    hook,
    hookLabel: HOOK_ARCHETYPES[hook].label,
    format,
    hookRate,
    holdRate,
    spend: num(ins.spend),
    installs,
    cpi,
    score,
  };
}

// -- Page ----------
function pct(n: number, d = 1) {
  return `${(n * 100).toFixed(d)}%`;
}
function money(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(2)}`;
}

export default async function InsightsPage() {
  const live = await fetchLive();
  const source = live ? "live" : "mock";
  const sourceNote = live
    ? `Live - ${live.length} ads from Phia Ads - last 90 days`
    : "Mock fixture -- set META_INSIGHTS_TOKEN + META_AD_ACCOUNT_ID in Vercel to flip live.";
  const pairs = live ?? MOCK;
  const graded = pairs.map(grade);
  const topAds = [...graded].sort((a, b) => b.score - a.score);
  const totalSpend = graded.reduce((s, a) => s + a.spend, 0);
  const totalInstalls = graded.reduce((s, a) => s + a.installs, 0);
  const blendedCPI = totalInstalls === 0 ? 0 : totalSpend / totalInstalls;
  const top3 = topAds.slice(0, 3);
  const dominantHook = top3.length
    ? top3.reduce<{ hook: HookArchetype; n: number }>(
        (acc, a) => {
          const next = top3.filter((x) => x.hook === a.hook).length;
          return next > acc.n ? { hook: a.hook, n: next } : acc;
        },
        { hook: top3[0].hook, n: 0 },
      ).hook
    : null;

  return (
    <main className="shell">
      <header className="topbar">
        <div className="wordmark">phia</div>
        <div className="meta">
          Insights
          <br />
          <span className="em">Step 1.6 of 5</span> - Phia's own ad performance
          <br />
          <a href="/" className="step">Back to Step 1 - Competitor Research</a>
          <br />
          <span className={`source-pill${source === "live" ? " live" : ""}`}>
            {source === "live" ? "* Live - " : ""}
            {sourceNote}
          </span>
        </div>
      </header>

      <section className="hero">
        <h1>
          What's <span className="accent">working</span>
          <br />
          for Phia.
        </h1>
        <div className="lede">
          Every ad you've run in the last 90 days, ranked by what actually converts. Graded against the same
          six-archetype hook taxonomy we use on <a href="/signal">/signal</a> for competitors -- so we can answer
          the real question: <strong>which hooks does Phia's audience actually respond to?</strong>
        </div>
      </section>

      <div className="stat-row">
        <div className="stat">
          <div className="label">Ads Analyzed</div>
          <div className="value mono">{graded.length}</div>
          <div className="sub">Last 90 days</div>
        </div>
        <div className="stat">
          <div className="label">Spend</div>
          <div className="value mono">{money(totalSpend)}</div>
          <div className="sub">All campaigns</div>
        </div>
        <div className="stat">
          <div className="label">Installs</div>
          <div className="value mono">{totalInstalls}</div>
          <div className="sub">Primary conversion</div>
        </div>
        <div className="stat">
          <div className="label">Blended CPI</div>
          <div className="value mono">{blendedCPI > 0 ? `$${blendedCPI.toFixed(2)}` : "--"}</div>
          <div className="sub">Spend / installs</div>
        </div>
      </div>

      {dominantHook ? (
        <section className="brief" style={{ marginTop: 56 }}>
          <div className="brief-head">
            <h2>
              <span className="sparkle">*</span> The winning formula
            </h2>
            <div className="sub">Distilled from your top 3 ads - run this through Higgsfield next</div>
          </div>
          <div style={{ color: "#fff", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 28, lineHeight: 1.3, marginBottom: 24 }}>
            Your top performers are dominated by the <strong>{HOOK_ARCHETYPES[dominantHook].label}</strong> archetype.
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            {HOOK_ARCHETYPES[dominantHook].description}
          </div>
          <div style={{ borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: 20 }}>
            {top3.map((a, i) => (
              <div key={a.adId} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: i < 2 ? "1px dashed rgba(255,255,255,0.1)" : "none" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--phia-blue-300)", flexShrink: 0, paddingTop: 4 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.4, color: "#fff" }}>
                  "{a.hookText}"
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="section-head">
          <span className="layer-pill">Top 10 - ranked by composite score</span>
          <h2>Your best ads, in order</h2>
          <div className="frame">Hook rate x hold rate x CPI x hook fit</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg-primary)", border: "1px solid var(--border-primary)", borderRadius: 2 }}>
          <thead>
            <tr style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-tertiary)", background: "var(--bg-secondary)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>#</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Hook</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Archetype</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Hook Rate</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>CPI</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {topAds.slice(0, 10).map((a, i) => (
              <tr key={a.adId} style={{ borderTop: "1px solid var(--border-primary)" }}>
                <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-tertiary)" }}>{String(i + 1).padStart(2, "0")}</td>
                <td style={{ padding: "14px 16px", fontSize: 14, lineHeight: 1.4 }}>
                  <div>{a.hookText || a.name}</div>
                  {a.campaign ? <div style={{ fontSize: 11, color: "var(--fg-tertiary)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{a.campaign}</div> : null}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "3px 8px", background: "var(--bg-accent)", color: "var(--fg-accent)", borderRadius: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {a.hookLabel}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>{pct(a.hookRate)}</td>
                <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>{a.cpi > 0 ? `$${a.cpi.toFixed(2)}` : "--"}</td>
                <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color: "var(--fg-accent)" }}>{a.score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="foot">
        <div>Phia Growth Agent - Step 1.6 / 5 - Own-ad insights</div>
        <a className="next" href="/signal">Step 1.5 -- Signal - Competitor patterns</a>
      </footer>
    </main>
  );
}
