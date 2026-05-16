import type { CompetitorLive } from "@/lib/types";

function formatCount(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1000) return `~${(n / 1000).toFixed(1)}k`;
  // Round to nearest 10 to feel ballpark-ish
  const rounded = n < 50 ? n : Math.round(n / 10) * 10;
  return `~${rounded}`;
}

export function CompetitorCard({ c }: { c: CompetitorLive }) {
  const isDark = !!c.darkStatus;
  const volTone = c.volTone ?? "default";
  const volClass =
    volTone === "hot" ? "card-vol hot" : volTone === "dark" ? "card-vol dark-vol" : "card-vol";

  const volLabel = c.volOverride
    ? c.volOverride
    : c.activeAdCount !== null
      ? `${formatCount(c.activeAdCount)} active ads`
      : "—";

  return (
    <article className={`card${isDark ? " dark" : ""}`}>
      <div className="card-head">
        <div className="card-name">
          <span className="blue-dot" />
          {c.name}
          {c.subname ? <span className="subname">({c.subname})</span> : null}
        </div>
        <div className={volClass}>
          {volLabel}
          {c.source === "live" ? <span className="live-tag" title="Live data" /> : null}
        </div>
      </div>

      {c.hooks.length > 0 ? (
        <div>
          <div className="field-label">{isDark ? "Signal" : "Top hooks running"}</div>
          <div className="hooks">
            {c.hooks.map((h, i) => (
              <div key={i} className={`hook${i === 0 && !isDark ? " accent" : ""}`}>
                {h}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {c.darkStatus ? (
        <div>
          <div className="field-label">Status</div>
          <div className="formats">
            <span className="dark-status">{c.darkStatus}</span>
          </div>
        </div>
      ) : c.formats.length > 0 ? (
        <div>
          <div className="field-label">Creative formats</div>
          <div className="formats">
            {c.formats.map((f, i) => (
              <span key={i} className={`fmt${f.tone && f.tone !== "default" ? " " + f.tone : ""}`}>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {c.pattern ? (
        <div
          className="pattern"
          dangerouslySetInnerHTML={{ __html: enrichPattern(c.pattern) }}
        />
      ) : null}
    </article>
  );
}

/** Turn the leading "Pattern:" / "Takeaway:" prefix into <strong>. */
function enrichPattern(text: string): string {
  // Escape HTML
  const escaped = text.replace(/[&<>]/g, (ch) =>
    ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : "&gt;",
  );
  return escaped.replace(
    /^(Pattern|Takeaway|Signal):/i,
    (_m, label) => `<strong>${label}:</strong>`,
  );
}
