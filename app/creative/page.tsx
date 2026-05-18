import { buildCreativeLabData } from "@/lib/creative-data";
import { AngleStudio } from "@/components/AngleStudio";

// Always render fresh â generation is triggered manually via /api/creative/generate.
// On page load we return mock data fast; the user clicks Generate to materialize live.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Phia Â· Creative Lab",
  description:
    "Step 2 of the Phia growth agent â Higgsfield-generated ad creative for the week's strategic angles.",
};

export default async function CreativePage() {
  // Always fetch in mock mode for the initial render so the page loads instantly.
  // Live generation is triggered by clicking through /api/creative/generate?angle=...
  const data = await buildCreativeLabData({ forceMock: true });

  const liveEnabled = !!process.env.HIGGSFIELD_API_KEY;

  return (
    <main className="shell">
      {/* ââ Topbar ââ */}
      <header className="topbar">
        <div className="wordmark">phia</div>
        <div className="meta">
          Creative Lab
          <br />
          <span className="em">Step 2 of 5</span> Â· AI Creative Generation via Higgsfield
          <br />
          <a href="/" className="step">â Back to Step 1 Â· Competitor Research</a>
          <br />
          <span className={`source-pill${liveEnabled ? " live" : ""}`}>
            {liveEnabled ? "â Higgsfield connected Â· click Generate to render" : data.sourceNote}
          </span>
        </div>
      </header>

      {/* ââ Hero ââ */}
      <section className="hero">
        <h1>
          The creative
          <br />
          <span className="accent">response.</span>
        </h1>
        <div className="lede">
          Four ads for four angles, each generated on-brand by Higgsfield from the strategic gaps surfaced in this week's
          competitor intel. <strong>5-second square videos</strong> ready for Meta IG feed â the dominant format in
          your competitive set (~62% of all active competitor ads).
          <br /><br />
          Each studio below shows the angle, the generated creative, the prompt that produced it, and the strategic
          thesis behind the play. Edit the prompt or regenerate to iterate. When you're happy, the next step (Step 3
          of the agent loop) pushes the winning creative into Meta Ads Manager.
        </div>
      </section>

      {/* ââ Stat row ââ */}
      <div className="stat-row">
        <div className="stat">
          <div className="label">Angles this Week</div>
          <div className="value mono">{data.outputs.length}</div>
          <div className="sub">All grounded in competitor whitespace</div>
        </div>
        <div className="stat">
          <div className="label">Format</div>
          <div className="value">Short Video</div>
          <div className="sub">5s Â· 1:1 Â· 720p Â· IG-native</div>
        </div>
        <div className="stat">
          <div className="label">Generator</div>
          <div className="value">Higgsfield</div>
          <div className="sub">Soul Mode Â· brand-locked prompts</div>
        </div>
        <div className="stat">
          <div className="label">Status</div>
          <div className="value mono">{liveEnabled ? "Ready" : "Preview"}</div>
          <div className="sub">{liveEnabled ? "Click Generate per angle" : "Add HIGGSFIELD_API_KEY to ship"}</div>
        </div>
      </div>

      {/* ââ Section header ââ */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill">Studio Â· Week of May 19</span>
          <h2>Four ads, four arguments</h2>
          <div className="frame">Each anchored in a Step-1 whitespace gap</div>
        </div>

        <div className="studio-grid">
          {data.outputs.map((o) => (
            <AngleStudio key={o.angle.id} output={o} />
          ))}
        </div>
      </section>

      {/* ââ Footer ââ */}
      <footer className="foot">
        <div>Phia Growth Agent Â· Step 2 / 5 Â· Creative generation via Higgsfield</div>
        <div className="next">Step 3 â Upload to Meta Ads Manager</div>
      </footer>
    </main>
  );
}
