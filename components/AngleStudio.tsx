import type { AngleOutput } from "@/lib/creative-data";

export function AngleStudio({ output }: { output: AngleOutput }) {
  const { angle, videoUrl, posterUrl, source, status, error } = output;

  return (
    <article className="studio">
      <div className="studio-head">
        <span className="angle-num-pill">{angle.number}</span>
        <span className="studio-tag">{angle.tag}</span>
        <span className={`studio-status studio-status-${source}`}>
          {source === "live" ? "● Live · Higgsfield" : source === "mock" ? "Mock preview" : `Error: ${status}`}
        </span>
      </div>

      <h3 className="studio-headline">{angle.headline}</h3>

      <div className="studio-media">
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={posterUrl}
            controls
            playsInline
            loop
            muted
            preload="metadata"
            className="studio-video"
          />
        ) : (
          <img src={posterUrl} alt={angle.headline} className="studio-poster" />
        )}
      </div>

      <div className="studio-meta">
        <div>
          <div className="field-label">Spec</div>
          <div className="studio-spec">
            {angle.aspectRatio} · {angle.duration}s · 720p · video
          </div>
        </div>
        <div>
          <div className="field-label">CTA</div>
          <div className="studio-cta">{angle.cta}</div>
        </div>
      </div>

      <details className="studio-details">
        <summary>Visual concept</summary>
        <p>{angle.visualConcept}</p>
      </details>

      <details className="studio-details">
        <summary>Higgsfield prompt</summary>
        <pre className="studio-prompt">{angle.prompt}</pre>
      </details>

      <details className="studio-details">
        <summary>Strategic thesis</summary>
        <p>{angle.thesis}</p>
      </details>

      {error ? <div className="studio-error">{error}</div> : null}
    </article>
  );
}
