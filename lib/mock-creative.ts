import type { CreativeAngle } from "./creative-prompts";

/**
 * Mock creative output used when HIGGSFIELD_API_KEY is unset.
 *
 * Each angle gets a SVG-encoded data URL as a placeholder "poster" image
 * — Phia-branded gradient with the headline rendered in italic serif.
 * Video URL is empty (no playable asset) but the poster lets the UI
 * render meaningfully and the user can see what each angle will look
 * like before paying for real generation.
 */

export type MockCreativeOutput = {
  videoUrl: null;
  posterUrl: string;
  status: "mock";
};

const PHIA_BLUE = "#0843CB";
const PHIA_BLUE_DARK = "#04205F";
const PHIA_CREAM = "#FAFAF8";

function svgPoster(angle: CreativeAngle): string {
  // SVG that captures the Phia editorial look — dark gradient, serif headline,
  // angle tag in mono, no real photography (clear stub).
  const safeHeadline = angle.headline
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const safeTag = angle.tag.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" width="720" height="720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PHIA_BLUE_DARK}"/>
      <stop offset="60%" stop-color="#000000"/>
      <stop offset="100%" stop-color="${PHIA_BLUE}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.6)"/>
    </radialGradient>
  </defs>
  <rect width="720" height="720" fill="url(#g)"/>
  <rect width="720" height="720" fill="url(#v)"/>
  <text x="48" y="92" font-family="ui-monospace, Menlo, monospace" font-size="13" letter-spacing="2" fill="${PHIA_CREAM}" opacity="0.7">${safeTag.toUpperCase()}</text>
  <foreignObject x="48" y="220" width="624" height="320">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Instrument Serif', 'Times New Roman', serif; font-style: italic; font-size: 56px; line-height: 1.04; color: ${PHIA_CREAM}; letter-spacing: -0.01em;">${safeHeadline}</div>
  </foreignObject>
  <text x="48" y="660" font-family="ui-monospace, Menlo, monospace" font-size="11" letter-spacing="2" fill="${PHIA_CREAM}" opacity="0.55">PHIA · CREATIVE LAB · MOCK PREVIEW</text>
  <text x="672" y="660" font-family="ui-monospace, Menlo, monospace" font-size="11" letter-spacing="2" fill="${PHIA_CREAM}" opacity="0.55" text-anchor="end">SET HIGGSFIELD_API_KEY TO GO LIVE</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function mockCreativeFor(angle: CreativeAngle): MockCreativeOutput {
  return {
    videoUrl: null,
    posterUrl: svgPoster(angle),
    status: "mock",
  };
}
