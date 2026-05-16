import type { CompetitorLive, LayerMeta } from "@/lib/types";
import { CompetitorCard } from "./CompetitorCard";

export function CompetitorSection({
  layer,
  competitors,
}: {
  layer: LayerMeta;
  competitors: CompetitorLive[];
}) {
  const pillClass =
    layer.pillStyle === "blue"
      ? "layer-pill"
      : layer.pillStyle === "black"
        ? "layer-pill muted"
        : "layer-pill tertiary";

  return (
    <section className="section">
      <div className="section-head">
        <span className={pillClass}>
          Layer {String(layer.index).padStart(2, "0")} ·{" "}
          {layer.id === "ai-agents" ? "Direct" : layer.id === "savings-extensions" ? "Legacy" : "Adjacent"}
        </span>
        <h2>{layer.name}</h2>
        <div className="frame">{layer.subtitle}</div>
      </div>
      <div className="grid">
        {competitors.map((c) => (
          <CompetitorCard key={c.slug} c={c} />
        ))}
      </div>
    </section>
  );
}
