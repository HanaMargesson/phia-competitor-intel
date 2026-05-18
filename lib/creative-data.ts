import { CREATIVE_ANGLES, type CreativeAngle } from "./creative-prompts";
import { generateVideo, pollUntilDone } from "./higgsfield";
import { mockCreativeFor } from "./mock-creative";

export type AngleOutput = {
  angle: CreativeAngle;
  videoUrl: string | null;
  posterUrl: string;
  /** "live" if Higgsfield returned a real video, "mock" otherwise. */
  source: "live" | "mock" | "error";
  /** Status string from the generator (e.g., "done", "queued", "error"). */
  status: string;
  /** Generation timestamp (ISO). */
  generatedAt: string;
  /** Free-text error if generation failed. */
  error?: string;
};

export type CreativeLabData = {
  generatedAt: string;
  anyLive: boolean;
  sourceNote: string;
  outputs: AngleOutput[];
};

/**
 * Build the Creative Lab payload for the /creative page.
 *
 * If HIGGSFIELD_API_KEY is set: submit all 4 angles to Higgsfield, poll
 * each until done, return the live videos. (Slow — minutes per page load.
 * Production should cache via ISR + a manual regenerate trigger.)
 *
 * If unset: return mock data immediately.
 */
export async function buildCreativeLabData(opts?: {
  /** Skip the live API call even if the key is set (useful for SSR). */
  forceMock?: boolean;
}): Promise<CreativeLabData> {
  const now = new Date().toISOString();
  const hasKey = !!process.env.HIGGSFIELD_API_KEY;
  const useMock = opts?.forceMock || !hasKey;

  if (useMock) {
    return {
      generatedAt: now,
      anyLive: false,
      sourceNote: hasKey
        ? "Mock preview — call /api/creative/generate to render live with Higgsfield."
        : "Mock preview — set HIGGSFIELD_API_KEY in Vercel env to enable live generation.",
      outputs: CREATIVE_ANGLES.map((angle) => {
        const m = mockCreativeFor(angle);
        return {
          angle,
          videoUrl: m.videoUrl,
          posterUrl: m.posterUrl,
          source: "mock" as const,
          status: "mock",
          generatedAt: now,
        };
      }),
    };
  }

  // Live path: submit each angle in parallel, poll each.
  const outputs = await Promise.all(
    CREATIVE_ANGLES.map(async (angle): Promise<AngleOutput> => {
      const submit = await generateVideo({
        prompt: angle.prompt,
        aspectRatio: angle.aspectRatio,
        duration: angle.duration,
        resolution: "720p",
      });
      if (!submit.ok || !submit.jobId) {
        const m = mockCreativeFor(angle);
        return {
          angle,
          videoUrl: m.videoUrl,
          posterUrl: m.posterUrl,
          source: "error",
          status: submit.status ?? "error",
          generatedAt: now,
          error: submit.error,
        };
      }
      // If the submit response already includes a videoUrl (sync mode), skip polling.
      if (submit.videoUrl) {
        return {
          angle,
          videoUrl: submit.videoUrl,
          posterUrl: submit.posterUrl ?? mockCreativeFor(angle).posterUrl,
          source: "live",
          status: submit.status ?? "done",
          generatedAt: now,
        };
      }
      const poll = await pollUntilDone(submit.jobId, 90_000);
      if (poll.ok && poll.videoUrl) {
        return {
          angle,
          videoUrl: poll.videoUrl,
          posterUrl: poll.posterUrl ?? mockCreativeFor(angle).posterUrl,
          source: "live",
          status: poll.status ?? "done",
          generatedAt: now,
        };
      }
      const m = mockCreativeFor(angle);
      return {
        angle,
        videoUrl: m.videoUrl,
        posterUrl: m.posterUrl,
        source: "error",
        status: poll.status ?? "error",
        generatedAt: now,
        error: poll.error,
      };
    }),
  );

  return {
    generatedAt: now,
    anyLive: outputs.some((o) => o.source === "live"),
    sourceNote: outputs.some((o) => o.source === "live")
      ? "Live · Higgsfield"
      : "Generation failed — showing mock preview",
    outputs,
  };
}
