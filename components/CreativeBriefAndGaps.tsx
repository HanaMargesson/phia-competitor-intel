type Angle = {
  tag: string;
  headline: string;
  body: React.ReactNode;
  cta: string;
};

const ANGLES: Angle[] = [
  {
    tag: "Angle 01 · Trust Vacuum",
    headline: "“The savings app that doesn’t steal from the people you watch.”",
    body: (
      <>
        Honey just lost Rakuten + Impact.com in January for creator-attribution fraud. Every Honey user is reading
        headlines. Phia: transparent affiliate stack, public commitment to creator commissions, zero last-click
        overwrites.
      </>
    ),
    cta: "See if Honey owes your favorite creator money",
  },
  {
    tag: "Angle 02 · Post-Agent Reality",
    headline: "“ChatGPT finds it. Alexa buys it. Phia tells you if the price is real.”",
    body: (
      <>
        The shopping-agent wave handles discovery + checkout — but no one is the second-opinion layer at the moment of
        purchase. Phia is the price-intelligence sidekick the new agent stack <strong>doesn’t have</strong>.
      </>
    ),
    cta: "The price you got isn’t always the best one",
  },
  {
    tag: "Angle 03 · Luxury Cross-Market",
    headline: "“Shop Miu Miu. Don’t pay Miu Miu prices.”",
    body: (
      <>
        Vestiaire + Poshmark push Miu Miu / Hermes / Gucci in resale. Phia spans new <em>and</em> secondhand in one
        view: same aspirational target, smarter price stack. Nobody else combines.
      </>
    ),
    cta: "Find your bag — new, used, or both",
  },
  {
    tag: "Angle 04 · Smart, Not Indebted",
    headline: "“Klarna sells you debt. Phia hands you cash back.”",
    body: (
      <>
        Klarna’s AI assistant is the loudest savings positioning on Meta — and it’s BNPL underneath. Phia is
        the inverse identity: you earn money, you don’t owe it. Same shopping moment, opposite math.
      </>
    ),
    cta: "See what you’re leaving on the table",
  },
];

const GAPS: { num: string; body: React.ReactNode }[] = [
  {
    num: "01",
    body: (
      <>
        <strong>The Honey collapse</strong> means the savings-extension category is wide open. No incumbent owns
        "honest savings." This is the single biggest opportunity in the deck.
      </>
    ),
  },
  {
    num: "02",
    body: (
      <>
        <strong>No competitor combines new + secondhand price intelligence in one product.</strong> Vestiaire sells
        used; Daydream sells new; Phia spans both at the point of purchase.
      </>
    ),
  },
  {
    num: "03",
    body: (
      <>
        The AI agent layer (ChatGPT, Alexa, Daydream, Perplexity){" "}
        <strong>doesn’t validate price at checkout.</strong> Phia is the missing trust-and-truth layer at the end
        of the funnel.
      </>
    ),
  },
  {
    num: "04",
    body: (
      <>
        Mercari + Grailed are <strong>dark on Meta.</strong> Fashion-forward resale buyers — esp. menswear — are
        completely unaddressed on IG/FB. Test a male-skew creative.
      </>
    ),
  },
  {
    num: "05",
    body: (
      <>
        <strong>Sustainability is fully owned by ThredUp.</strong> Don’t run it this week. Lean into financial
        intelligence + style identity instead.
      </>
    ),
  },
  {
    num: "06",
    body: (
      <>
        Klarna owns "AI shopping assistant" framing in fintech — but with debt underneath.{" "}
        <strong>Phia owns the opposite identity</strong> with the same audience.
      </>
    ),
  },
];

export function CreativeBrief() {
  return (
    <section className="brief">
      <div className="brief-head">
        <h2>
          <span className="sparkle">✦</span>Phia Creative Brief
        </h2>
        <div className="sub">
          Week of May 19 · 4 angles to test · Grounded in competitor gaps and what the feed is not yet saying
        </div>
      </div>
      <div className="angles">
        {ANGLES.map((a, i) => (
          <div key={i} className="angle">
            <div className="angle-tag">{a.tag}</div>
            <h3>{a.headline}</h3>
            <p>{a.body}</p>
            <div className="cta">{a.cta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Gaps() {
  return (
    <section className="gaps">
      <h2>Key whitespace Phia can own this week</h2>
      <div className="gap-list">
        {GAPS.map((g) => (
          <div key={g.num} className="gap">
            <div className="gap-num">{g.num}</div>
            <div className="gap-body">{g.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
