import { buildDashboardData } from "@/lib/data";
import { LAYERS } from "@/lib/competitors";
import { CompetitorSection } from "@/components/CompetitorSection";
import { CreativeBrief, Gaps } from "@/components/CreativeBriefAndGaps";
import type { CompetitorLive, LayerMeta } from "@/lib/types";

// Refresh the page every 6 hours; the Monday cron triggers a full refresh.
export const revalidate = 21600;

function groupByLayer(competitors: CompetitorLive[]): Map<string, CompetitorLive[]> {
  const m = new Map<string, CompetitorLive[]>();
  for (const c of competitors) {
    if (!m.has(c.layer)) m.set(c.layer, []);
    m.get(c.layer)!.push(c);
  }
  return m;
}

function formatWeekLabel(d: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const start = new Date(d);
  // Roll back to Monday of the current week
  const day = start.getUTCDay();
  const diff = (day + 6) % 7;
  start.setUTCDate(start.getUTCDate() - diff);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", opts);
  return `${startStr} – ${endStr}, ${end.getUTCFullYear()}`;
}

export default async function Page() {
  const data = await buildDashboardData();
  const byLayer = groupByLayer(data.competitors);
  const weekLabel = formatWeekLabel(new Date(data.generatedAt));

  const totalAds = data.competitors.reduce(
    (sum, c) => sum + (c.activeAdCount ?? 0),
    0,
  );
  const competitorsCovered = data.competitors.length;

  return (
    <main className="shell">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="wordmark">phia</div>
        <div className="meta">
          Weekly Competitor Ad Intelligence
          <br />
          Week of <span className="em">{weekLabel}</span> · Source: Meta Ad Library
          <br />
          <span className="step">Growth Agent · Step 1 of 5 — Competitor Research</span>
          <br />
          <span className={`source-pill${data.anyLive ? " live" : ""}`}>
            {data.anyLive ? "● Live · " : ""}
            {data.sourceNote}
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <h1>
          The shopping
          <br />
          agent war <span className="accent">is here.</span>
        </h1>
        <div className="lede">
          Three weeks after Google’s Universal Commerce Protocol added Cart and Catalog. Two days after Amazon
          retired Rufus and shipped <strong>Alexa for Shopping</strong> with a Buy-for-Me feature that purchases on
          third-party sites. The competitive picture isn’t fashion resale anymore — it’s{" "}
          <strong>who becomes the default shopping interface.</strong>
        </div>
      </section>

      {/* ── Stat row ── */}
      <div className="stat-row">
        <div className="stat">
          <div className="label">Competitors Tracked</div>
          <div className="value mono">{competitorsCovered}</div>
          <div className="sub">Across 3 layers — AI agents, savings ext., resale</div>
        </div>
        <div className="stat">
          <div className="label">Active Ads in Set</div>
          <div className="value mono">
            {totalAds >= 1000 ? `${(totalAds / 1000).toFixed(1)}k` : totalAds}
            <span className="unit">+</span>
          </div>
          <div className="sub">US market, active status on Meta</div>
        </div>
        <div className="stat">
          <div className="label">Dominant Format</div>
          <div className="value">Short Video</div>
          <div className="sub">15–45s UGC &amp; brand · ~62% of total</div>
        </div>
        <div className="stat">
          <div className="label">Whitespace for Phia</div>
          <div className="value mono">4 Angles</div>
          <div className="sub">Uncrowded hooks — see brief below</div>
        </div>
      </div>

      {/* ── Layered sections ── */}
      {LAYERS.map((layer: LayerMeta) => {
        const items = byLayer.get(layer.id) ?? [];
        if (items.length === 0) return null;
        return <CompetitorSection key={layer.id} layer={layer} competitors={items} />;
      })}

      {/* ── Creative brief + gaps ── */}
      <CreativeBrief />
      <Gaps />

      {/* ── Footer ── */}
      <footer className="foot">
        <div>Phia Growth Agent · Step 1 / 5 · Competitor research complete</div>
        <div className="next">Step 2 — Creative generation via Higgsfield</div>
      </footer>
    </main>
  );
}
