import { buildSignalData } from "@/lib/signal-data";
import { HOOK_ARCHETYPES, LONGEVITY_LABEL } from "@/lib/pattern-mining";

// Refresh hourly; the existing Monday cron triggers a full refresh.
export const revalidate = 3600;

export const metadata = {
 title: "Phia - Signal",
 description:
 "Step 2.5 of the Phia growth agent -- pattern mining across competitor ads, graded against the 2026 hook taxonomy.",
};

function pct(n: number): string {
 return `${Math.round(n * 100)}%`;
}

export default async function SignalPage() {
 const data = await buildSignalData();
 const liveEnabled = data.source === "live";

 return (
 <main className="shell">
 {/* -- Topbar -- */}
 <header className="topbar">
 <div className="wordmark">phia</div>
 <div className="meta">
 Signal
 <br />
 <span className="em">Step 1.5 of 5</span> - Pattern mining across competitor ads
 <br />
 <a href="/" className="step">-- Back to Step 1 - Competitor Research</a>
 <br />
 <span className={`source-pill${liveEnabled ? " live" : ""}`}>
 {liveEnabled ? "-- Live - " : ""}
 {data.sourceNote}
 </span>
 </div>
 </header>

 {/* -- Hero -- */}
 <section className="hero">
 <h1>
 The signal
 <br />
 <span className="accent">behind the noise.</span>
 </h1>
 <div className="lede">
 Every active competitor ad -- graded against the six hook archetypes that
 actually convert in 2026. Ads that have been running 60+ days are{" "}
 <strong>heroes</strong> (they survived the algorithm); the hooks they use are
 the patterns the category is paying for.
 <br /><br />
 The taxonomy below is sourced from cross-referenced 2026 creative-analysis
 reports. The grader runs the same way against{" "}
 <strong>mock data tonight</strong> and <strong>live competitor ads</strong>{" "}
 the moment Meta's <code>ads_read</code> App Review approves -- same page,
 same numbers, real signal.
 </div>
 </section>

 {/* -- Stat row -- */}
 <div className="stat-row">
 <div className="stat">
 <div className="label">Ads Analyzed</div>
 <div className="value mono">{data.totalAds}</div>
 <div className="sub">Across {data.brandsCovered.length} competitor brands</div>
 </div>
 <div className="stat">
 <div className="label">Hook Archetypes</div>
 <div className="value mono">{data.clusters.length}</div>
 <div className="sub">Of 6 in the 2026 taxonomy</div>
 </div>
 <div className="stat">
 <div className="label">Heroes Detected</div>
 <div className="value mono">
 {data.longevityMix.find((l) => l.tier === "hero")?.count ?? 0}
 </div>
 <div className="sub">60+ days continuously active</div>
 </div>
 <div className="stat">
 <div className="label">Source</div>
 <div className="value">{liveEnabled ? "Live" : "Mock"}</div>
 <div className="sub">{liveEnabled ? "Ad Library - weekly refresh" : "Awaiting ads_read approval"}</div>
 </div>
 </div>

 {/* -- Top ads ranked -- */}
 <section className="section">
 <div className="section-head">
 <span className="layer-pill">Top 10 - ranked by composite score</span>
 <h2>What's actually winning right now</h2>
 <div className="frame">Longevity hook fit format weight</div>
 </div>

 <div className="signal-table">
 <div className="signal-row signal-head">
 <div>#</div>
 <div>Brand</div>
 <div>Hook</div>
 <div>Archetype</div>
 <div>Active</div>
 <div>Format</div>
 <div>Score</div>
 </div>
 {data.topAds.map((ad, i) => (
 <div key={ad.adId} className="signal-row">
 <div className="rank mono">{String(i + 1).padStart(2, "0")}</div>
 <div className="brand-cell">{ad.brand}</div>
 <div className="hook-cell">
 <div className="hook-text">{ad.hookText}</div>
 {ad.formula.ctaVerb ? (
 <div className="hook-meta">
 cta: <span className="mono">{ad.formula.ctaVerb}</span>
 </div>
 ) : null}
 </div>
 <div>
 <span className={`hook-pill hook-${ad.hook}`}>
 {HOOK_ARCHETYPES[ad.hook].label}
 </span>
 </div>
 <div className="mono">{ad.activeDays}d</div>
 <div className="mono">{ad.formatLabel}</div>
 <div className="score mono">{ad.score.toFixed(2)}</div>
 </div>
 ))}
 </div>
 </section>

 {/* -- Cluster breakdown -- */}
 <section className="section">
 <div className="section-head">
 <span className="layer-pill muted">Hook archetype mix - all ads</span>
 <h2>The patterns that dominate</h2>
 <div className="frame">Share of competitor ad volume per archetype</div>
 </div>

 <div className="cluster-grid">
 {data.clusters.map((c) => (
 <article key={c.hook} className={`cluster cluster-${c.hook}`}>
 <div className="cluster-head">
 <span className="cluster-label">{c.label}</span>
 <span className="cluster-fit mono">Phia fit - {c.fit}/10</span>
 </div>
 <div className="cluster-share-bar">
 <div
 className="cluster-share-fill"
 style={{ width: `${Math.round(c.share * 100)}%` }}
 />
 </div>
 <div className="cluster-stat mono">
 {c.count} ads - {pct(c.share)} of set
 </div>
 <p className="cluster-desc">{c.description}</p>
 {c.topAds[0] ? (
 <div className="cluster-example">
 <div className="cluster-example-label">Top example</div>
 <div className="cluster-example-text">"{c.topAds[0].hookText}"</div>
 <div className="cluster-example-brand mono">
 {c.topAds[0].brand} - {c.topAds[0].activeDays}d active
 </div>
 </div>
 ) : null}
 </article>
 ))}
 </div>
 </section>

 {/* -- Format + longevity side by side -- */}
 <section className="section">
 <div className="signal-two-col">
 <div>
 <div className="section-head">
 <span className="layer-pill tertiary">Format mix</span>
 <h2>How the category is shooting</h2>
 <div className="frame">Inferred from ad metadata</div>
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
 {f.count} - {pct(f.share)}
 </div>
 </div>
 ))}
 </div>
 </div>

 <div>
 <div className="section-head">
 <span className="layer-pill tertiary">Longevity</span>
 <h2>What survived the algorithm</h2>
 <div className="frame">Active duration = proxy for "it works"</div>
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
 {l.count} - {pct(l.share)}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* -- Footer -- */}
 <footer className="foot">
 <div>Phia Growth Agent - Step 1.5 / 5 - Pattern mining</div>
 <a className="next" href="/creative">Step 2 -- Creative generation via Higgsfield</a>
 </footer>
 </main>
 );
}
