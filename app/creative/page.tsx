import { buildCreativeLabData } from "@/lib/creative-data";
import { AngleStudio } from "@/components/AngleStudio";

// Always render fresh -- generation is triggered manually via /api/creative/generate.
// On page load we return mock data fast; the user clicks Generate to materialize live.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Phia - Creative Lab",
  description:
    "Step 2 of the Phia growth agent -- Higgsfield-generated ad creative for the week's strategic angles.",
};

export default async function CreativePage() {
  // Always fetch in mock mode for the initial render so the page loads instantly.
  // Live generation is triggered by clicking through /api/creative/generate?angle=...
  const data = await buildCreativeLabData({ forceMock: true });

  const liveEnabled = !!process.env.HIGGSFIELD_API_KEY;

  return (
    <main className="shell">
      {/*  Topbar  */}
      <header className="topbar">
        <div className="wordmark">phia</div>
        <div className="meta">
          Creative Lab
          <br />
          <span className="em">Step 2 of 5</span> - AI Creative Generation via Higgsfield
          <br />
          <a href="/" className="step"> Back to Step 1 - Competitor Research</a>
          <br />
          <span className={`source-pill${liveEnabled ? " live" : ""}`}>
            {liveEnabled ? " Higgsfield connected - click Generate to render" : data.sourceNote}
          </span>
        </div>
      </header>

      {/*  Hero  */}
      <section className="hero">
        <h1>
          The creative
          <br />
          <span className="accent">response.</span>
        </h1>
        <div className="lede">
          Four ads for four angles, each generated on-brand by Higgsfield from the strategic gaps surfaced in this week's
          competitor intel. <strong>5-second square videos</strong> ready for Meta IG feed -- the dominant format in
          your competitive set (~62% of all active competitor ads).
          <br /><br />
          Each studio below shows the angle, the generated creative, the prompt that produced it, and the strategic
          thesis behind the play. Edit the prompt or regenerate to iterate. When you're happy, the next step (Step 3
          of the agent loop) pushes the winning creative into Meta Ads Manager.
        </div>
      </section>

      {/*  Stat row  */}
      <div className="stat-row">
        <div className="stat">
          <div className="label">Angles this Week</div>
          <div className="value mono">{data.outputs.length}</div>
          <div className="sub">All grounded in competitor whitespace</div>
        </div>
        <div className="stat">
          <div className="label">Format</div>
          <div className="value">Short Video</div>
          <div className="sub">5s - 1:1 - 720p - IG-native</div>
        </div>
        <div className="stat">
          <div className="label">Generator</div>
          <div className="value">Higgsfield</div>
          <div className="sub">Soul Mode - brand-locked prompts</div>
        </div>
        <div className="stat">
          <div className="label">Status</div>
          <div className="value mono">{liveEnabled ? "Ready" : "Preview"}</div>
          <div className="sub">{liveEnabled ? "Click Generate per angle" : "Add HIGGSFIELD_API_KEY to ship"}</div>
        </div>
      </div>

      {/*  Section header  */}
      <section className="section">
        <div className="section-head">
          <span className="layer-pill">Studio - Week of May 19</span>
          <h2>Four ads, four arguments</h2>
          <div className="frame">Each anchored in a Step-1 whitespace gap</div>
        </div>

        <div className="studio-grid">
          {data.outputs.map((o) => (
            <AngleStudio key={o.angle.id} output={o} />
          ))}
        </div>
      </section>

      {/*  Footer  */}
      <footer className="foot">
        <div>Phia Growth Agent - Step 2 / 5 - Creative generation via Higgsfield</div>
        <div className="next">Step 3 -- Upload to Meta Ads Manager</div>
      </footer>
    </main>
  );
}
