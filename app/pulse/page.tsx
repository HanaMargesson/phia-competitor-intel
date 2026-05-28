import { buildSignalData } from "@/lib/signal-data";
import { HOOK_ARCHETYPES, LONGEVITY_LABEL } from "@/lib/pattern-mining";

// Refresh every 6 hours so the page stays fresh without thrashing the API.
export const revalidate = 21600;

export const metadata = {
  title: "Phia - Category Pulse",
  description:
    "A monthly transparency snapshot of the smart-shopping app landscape - which tools are advertising, what they are saying, and how long their campaigns have been running. Built for Phia users.",
};

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export default async function PulsePage() {
  const data = await buildSignalData();
  const heroes = data.longevityMix.find((l) => l.tier === "hero")?.count ?? 0;
  const heroShare = data.longevityMix.find((l) => l.tier === "hero")?.share ?? 0;
  const fresh = data.longevityMix.find((l) => l.tier === "fresh")?.count ?? 0;
  const topThreeArchetypes = data.clusters.slice(0, 3);

  // Pretty date for the user
  const updated = new Date(data.generatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="shell">
      {/*  Topbar  */}
      <header className="topbar">
        <div className="wordmark">phia</div>
        <div className="meta">
          Category Pulse
          <br />
          <span className="em">Updated {updated}</span> - For Phia users navigating a noisy shopping landscape
          <br />
          <span className={`source-pill${data.source === "live" ? " live" : ""}`}>
            {data.source === "live"
              ? "Live - sourced from Meta public Ad Library"
              : "Awaiting Meta App Review approval - showing latest cached snapshot"}
          </span>
        </div>
      </header>

      {/*  Hero  */}
      <section className="hero">
        <h1>
          What the shopping-app
          <br />
          <span className="accent">market is doing</span> right now.
        </h1>
        <div className="lede">
          Every month, dozens of new AI shopping agents, savings extensions, BNPL tools, and resale apps launch
          campaigns - many with claims that are hard to verify.
          <br /><br />
          <strong>Category Pulse</strong> aggregates publicly available data from Meta&apos;s Ad Library so you can see
          which tools in your daily shopping flow are actually active, what they&apos;re promising, and how long their
          campaigns have been running. (Longer campaigns = signals from real performance data, not just hype.)
          <br /><br />
          This page is for Phia users to make informed choices about the shopping tools you encounter alongside
          Phia. Nothing here is sponsored - just aggregated public data.
        </div>
      </section>

      {/*  Stat row  */}
      <div className="stat-row">
        <div className="stat">
          <div className="label">Tools Tracked</div>
          <div className="value mono">{data.brandsCovered.length}</div>
          <div className="sub">Across savings ext, AI agents, resale</div>
        </div>
        <div className="stat">
          <div className="label">Active Ads</div>
          <div className="value mono">{data.totalAds}</div>
          <div className="sub">In the US market right now</div>
        </div>
        <div className="stat">
          <div className="label">Trust Signals</div>
          <div className="value mono">{heroes}</div>
          <div className="sub">Ads running 60+ days ({pct(heroShare)} of set)</div>
        </div>
        <div className="stat">
          <div className="label">Fresh Launches</div>
          <div className="value mono">{fresh}</div>
          <div className="sub">New campaigns this week</div>
        </div>
      </div>

      {/*  What everyone is saying  */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill">What everyone&apos;s saying</span>
          <h2>The 3 messaging patterns dominating the category</h2>
          <div className="frame">Aggregated from active ad copy across all tracked brands</div>
        </div>

        <div className="cluster-grid">
          {topThreeArchetypes.map((c) => (
            <article key={c.hook} className={`cluster cluster-${c.hook}`}>
              <div className="cluster-head">
                <span className="cluster-label">{c.label}</span>
                <span className="cluster-fit mono">{pct(c.share)} of category</span>
              </div>
              <div className="cluster-share-bar">
                <div
                  className="cluster-share-fill"
                  style={{ width: `${Math.round(c.share * 100)}%` }}
                />
              </div>
              <p className="cluster-desc">{c.description}</p>
              {c.topAds[0] ? (
                <div className="cluster-example">
                  <div className="cluster-example-label">Example we&apos;re seeing</div>
                  <div className="cluster-example-text">&quot;{c.topAds[0].hookText}&quot;</div>
                  <div className="cluster-example-brand mono">
                    {c.topAds[0].brand} - {c.topAds[0].activeDays}d active
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/*  Trust longevity  */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill muted">Trust by longevity</span>
          <h2>How long has each tool been advertising?</h2>
          <div className="frame">
            Longer campaigns tend to mean the messaging actually works - a useful signal when a tool makes big claims.
          </div>
        </div>

        <div className="mix-list">
          {data.longevityMix.map((l) => (
            <div key={l.tier} className="mix-row">
              <div className="mix-label">{LONGEVITY_LABEL[l.tier]}</div>
              <div className="mix-bar">
                <div
                  className={`mix-bar-fill tier-${l.tier}`}
                  style={{ width: `${Math.round(l.share * 100)}%` }}
                />
              </div>
              <div className="mix-stat mono">
                {l.count} ads - {pct(l.share)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*  Format mix  */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill tertiary">Format mix</span>
          <h2>What kind of ads dominate</h2>
          <div className="frame">Short video, static, UGC - inferred from public ad metadata</div>
        </div>

        <div className="mix-list">
          {data.formatMix.map((f) => (
            <div key={f.format} className="mix-row">
              <div className="mix-label">{f.label}</div>
              <div className="mix-bar">
                <div
                  className="mix-bar-fill"
                  style={{ width: `${Math.round(f.share * 100)}%` }}
                />
              </div>
              <div className="mix-stat mono">
                {f.count} ads - {pct(f.share)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*  Why we built this  */}
      <section className="brief" style={{ marginTop: 56 }}>
        <div className="brief-head">
          <h2>Why we built this</h2>
          <div className="sub">A note from the Phia team</div>
        </div>
        <div style={{ color: "#fff", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20, lineHeight: 1.5 }}>
          When we started Phia, our users kept asking the same thing: &quot;Should I trust this new shopping tool?
          What is it actually doing?&quot; The smart-shopping space moves fast - dozens of new agents, extensions, and
          buy-now-pay-later apps launch every month, many with claims that are hard to verify.
          <br /><br />
          Category Pulse is our answer. We aggregate what every player in your daily shopping flow is publicly
          advertising on Meta - which we believe is a more honest signal than press releases or app store
          screenshots. If a tool has been running the same campaign for 90 days, it&apos;s probably working. If a
          tool just launched a glossy campaign last week, treat the claims with a pinch of salt.
          <br /><br />
          This is built directly into how we think about Phia: be the most useful, honest, and transparent
          shopping companion in a category that often is not.
        </div>
      </section>

      {/*  Footer  */}
      <footer className="foot">
        <div>Phia - Category Pulse - Updated {updated}</div>
        <div className="next">All data sourced from Meta&apos;s public Ad Library. No tracking, no sponsorship.</div>
      </footer>
    </main>
  );
}
