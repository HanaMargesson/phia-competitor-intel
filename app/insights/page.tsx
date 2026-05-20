import { buildInsightsData } from "@/lib/insights-data";
import { HOOK_ARCHETYPES } from "@/lib/pattern-mining";

// Pull fresh insights every 30 min when live.
export const revalidate = 1800;

export const metadata = {
  title: "Phia - Insights",
  description:
    "Step 1.6 of the Phia growth agent -- Phia's own ad performance graded against the 2026 hook taxonomy.",
};

function fmtMoney(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}

function fmtNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function fmtPct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}

const FORMAT_LABEL_DISPLAY: Record<string, string> = {
  static: "Static",
  "short-video": "Short Video",
  "ugc-video": "UGC Video",
  carousel: "Carousel",
  unknown: "Unknown",
};

export default async function InsightsPage() {
  const data = await buildInsightsData();
  const liveEnabled = data.source === "live";
  const formula = data.winningFormula;

  return (
    <main className="shell">
      {/* -- Topbar -- */}
      <header className="topbar">
        <div className="wordmark">phia</div>
        <div className="meta">
          Insights
          <br />
          <span className="em">Step 1.6 of 5</span> - Phia's own ad performance
          <br />
          <a href="/" className="step">Back to Step 1 - Competitor Research</a>
          <br />
          <span className={`source-pill${liveEnabled ? " live" : ""}`}>
            {liveEnabled ? "* Live - " : ""}
            {data.sourceNote}
          </span>
        </div>
      </header>

      {/* -- Hero -- */}
      <section className="hero">
        <h1>
          What's <span className="accent">working</span>
          <br />
          for Phia.
        </h1>
        <div className="lede">
          Every ad you've run in the last 90 days, ranked by what actually
          converts. Each one graded against the same six-archetype hook taxonomy
          we use on <a href="/signal">/signal</a> for competitors -- so we can
          compare apples to apples and answer the real question:{" "}
          <strong>which hooks does Phia's audience actually respond to?</strong>
          <br /><br />
          The <strong>Winning Formula</strong> below distills your top 3 ads
          into a creative blueprint -- that's what we'll prompt Higgsfield with
          when we rewrite the angles.
        </div>
      </section>

      {/* -- Stat row -- */}
      <div className="stat-row">
        <div className="stat">
          <div className="label">Ads Analyzed</div>
          <div className="value mono">{data.adsAnalyzed}</div>
          <div className="sub">Last 90 days</div>
        </div>
        <div className="stat">
          <div className="label">Spend</div>
          <div className="value mono">{fmtMoney(data.totalSpend)}</div>
          <div className="sub">All campaigns</div>
        </div>
        <div className="stat">
          <div className="label">Installs</div>
          <div className="value mono">{fmtNumber(data.totalInstalls)}</div>
          <div className="sub">Primary conversion</div>
        </div>
        <div className="stat">
          <div className="label">Blended CPI</div>
          <div className="value mono">
            {data.blendedCPI > 0 ? `$${data.blendedCPI.toFixed(2)}` : "--"}
          </div>
          <div className="sub">Spend / installs</div>
        </div>
      </div>

      {/* -- Winning Formula -- */}
      {formula ? (
        <section className="brief" style={{ marginTop: 56 }}>
          <div className="brief-head">
            <h2>
              <span className="sparkle">*</span> The winning formula
            </h2>
            <div className="sub">
              Distilled from your top 3 ads - run this through Higgsfield next
            </div>
          </div>

          <div className="formula-grid">
            <div className="formula-cell">
              <div className="formula-label">Dominant hook</div>
              <div className="formula-value">{formula.dominantHookLabel}</div>
              <div className="formula-meta">
                {HOOK_ARCHETYPES[formula.dominantHook].description}
              </div>
            </div>
            <div className="formula-cell">
              <div className="formula-label">Dominant format</div>
              <div className="formula-value">
                {FORMAT_LABEL_DISPLAY[formula.dominantFormat]}
              </div>
              <div className="formula-meta">
                {formula.dominantFormat === "ugc-video"
                  ? "First-person creator on camera"
                  : formula.dominantFormat === "static"
                    ? "Single image - highest ecom conversion share"
                    : formula.dominantFormat === "short-video"
                      ? "5-30s vertical - IG-native"
                      : "--"}
              </div>
            </div>
            <div className="formula-cell">
              <div className="formula-label">Avg hook rate (top 3)</div>
              <div className="formula-value mono">
                {fmtPct(formula.avgHookRate)}
              </div>
              <div className="formula-meta">3s view / impressions</div>
            </div>
            <div className="formula-cell">
              <div className="formula-label">Avg CPI (top 3)</div>
              <div className="formula-value mono">
                {formula.avgCPI > 0 ? `$${formula.avgCPI.toFixed(2)}` : "--"}
              </div>
              <div className="formula-meta">Cost per install</div>
            </div>
          </div>

          <div className="formula-hooks">
            <div className="formula-label">Top-3 hook copy</div>
            {formula.sampleHooks.map((h, i) => (
              <div key={i} className="formula-hook-line">
                <span className="formula-hook-num mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="formula-hook-text">"{h}"</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* -- Top ads ranked -- */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill">Top 10 - ranked by composite score</span>
          <h2>Your best ads, in order</h2>
          <div className="frame">Hook rate x hold rate x CPI x hook fit</div>
        </div>

        <div className="signal-table insights-table">
          <div className="signal-row signal-head insights-row">
            <div>#</div>
            <div>Hook</div>
            <div>Archetype</div>
            <div>Format</div>
            <div>Hook Rate</div>
            <div>Hold</div>
            <div>CPI</div>
            <div>Score</div>
          </div>
          {data.topAds.slice(0, 10).map((ad, i) => (
            <div key={ad.adId} className="signal-row insights-row">
              <div className="rank mono">{String(i + 1).padStart(2, "0")}</div>
              <div className="hook-cell">
                <div className="hook-text">{ad.hookText || ad.adName}</div>
                <div className="hook-meta">
                  {ad.campaign ? <span>{ad.campaign}</span> : null}
                </div>
              </div>
              <div>
                <span className={`hook-pill hook-${ad.hook}`}>
                  {ad.hookLabel}
                </span>
              </div>
              <div className="mono">{FORMAT_LABEL_DISPLAY[ad.format]}</div>
              <div className="mono">{fmtPct(ad.hookRate)}</div>
              <div className="mono">{fmtPct(ad.holdRate)}</div>
              <div className="mono">
                {ad.primaryAction && ad.primaryAction.cpa > 0
                  ? `$${ad.primaryAction.cpa.toFixed(2)}`
                  : "--"}
              </div>
              <div className="score mono">{ad.score.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -- Hook performance -- */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill muted">Performance by hook archetype</span>
          <h2>Which hooks Phia's audience actually responds to</h2>
          <div className="frame">Avg metrics across all ads per archetype</div>
        </div>

        <div className="signal-table">
          <div className="signal-row signal-head hookperf-row">
            <div>Archetype</div>
            <div>Ads</div>
            <div>Spend</div>
            <div>Avg Hook Rate</div>
            <div>Avg Hold</div>
            <div>Avg CPI</div>
          </div>
          {data.hookPerformance.map((row) => (
            <div key={row.hook} className="signal-row hookperf-row">
              <div>
                <span className={`hook-pill hook-${row.hook}`}>{row.label}</span>
              </div>
              <div className="mono">{row.adCount}</div>
              <div className="mono">{fmtMoney(row.totalSpend)}</div>
              <div className="mono">{fmtPct(row.avgHookRate)}</div>
              <div className="mono">{fmtPct(row.avgHoldRate)}</div>
              <div className="mono">
                {row.avgCPI > 0 ? `$${row.avgCPI.toFixed(2)}` : "--"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- Format performance -- */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill tertiary">Performance by format</span>
          <h2>Which format moves Phia's needle</h2>
          <div className="frame">Static vs. short-video vs. UGC-video</div>
        </div>

        <div className="mix-list">
          {data.formatPerformance.map((row) => (
            <div key={row.format} className="mix-row insights-format-row">
              <div className="mix-label">{FORMAT_LABEL_DISPLAY[row.format]}</div>
              <div className="mix-bar">
                <div
                  className="mix-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.round(row.avgHookRate * 100 * 3))}%`,
                  }}
                />
              </div>
              <div className="mix-stat mono">
                {row.adCount} ads - {fmtPct(row.avgHookRate)} hook -{" "}
                {row.avgCPI > 0 ? `$${row.avgCPI.toFixed(2)}` : "--"} CPI
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- Footer -- */}
      <footer className="foot">
        <div>Phia Growth Agent - Step 1.6 / 5 - Own-ad insights</div>
        <a className="next" href="/signal">Step 1.5 -- Signal - Competitor patterns</a>
      </footer>
    </main>
  );
}
