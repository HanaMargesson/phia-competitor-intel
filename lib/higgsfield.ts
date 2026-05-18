/**
 * Higgsfield API client.
 *
 * Docs: https://cloud.higgsfield.ai/
 *
 * Auth: Authorization: Bearer <HIGGSFIELD_API_KEY>
 *
 * Modes:
 *   - Text-to-Video           prompt only
 *   - Image-to-Video          prompt + image_url
 *   - Soul Mode               prompt + reference_image_urls   (best for brand consistency)
 *
 * Aspect ratios: "16:9" | "4:3" | "1:1" | "9:21"
 * Resolutions:   "480p" | "720p" | "1080p"
 * Durations:     5 | 10  (seconds)
 *
 * Without HIGGSFIELD_API_KEY the caller falls back to mock-creative.ts.
 */

import { PHIA_REFERENCE_IMAGE_URLS } from "./creative-prompts";

const HIGGSFIELD_API_BASE = "https://cloud.higgsfield.ai/v1";

export type HiggsfieldGenerationRequest = {
  prompt: string;
  aspectRatio: "16:9" | "4:3" | "1:1" | "9:21";
  resolution?: "480p" | "720p" | "1080p";
  duration?: 5 | 10;
  /** Optional reference images for Soul Mode (brand consistency). */
  referenceImageUrls?: string[];
  /** Seed for reproducibility. */
  seed?: number;
};

export type HiggsfieldGenerationResult = {
  ok: boolean;
  /** Generation job id from Higgsfield. */
  jobId?: string;
  /** Polling URL when the job is async. */
  pollUrl?: string;
  /** URL to the finished video. */
  videoUrl?: string;
  /** URL to the first-frame poster image. */
  posterUrl?: string;
  /** Free-text status from Higgsfield (e.g., "queued", "running", "done"). */
  status?: string;
  error?: string;
};

/**
 * Submit a generation job to Higgsfield.
 *
 * For MVP this is fire-and-forget — Higgsfield returns a job id and we
 * poll for completion. The serverless route handler does the polling
 * before responding.
 */
export async function generateVideo(
  req: HiggsfieldGenerationRequest,
): Promise<HiggsfieldGenerationResult> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "HIGGSFIELD_API_KEY not set",
      status: "no-key",
    };
  }

  const body: Record<string, unknown> = {
    prompt: req.prompt,
    aspect_ratio: req.aspectRatio,
    resolution: req.resolution ?? "720p",
    duration: req.duration ?? 5,
  };
  if (req.seed !== undefined) body.seed = req.seed;
  if (req.referenceImageUrls && req.referenceImageUrls.length > 0) {
    body.reference_image_urls = req.referenceImageUrls;
  } else if (PHIA_REFERENCE_IMAGE_URLS.length > 0) {
    body.reference_image_urls = PHIA_REFERENCE_IMAGE_URLS;
  }

  try {
    const res = await fetch(`${HIGGSFIELD_API_BASE}/jobs`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return {
        ok: false,
        status: "error",
        error: `Higgsfield ${res.status}: ${await res.text()}`,
      };
    }

    const json = (await res.json()) as {
      id?: string;
      status?: string;
      video_url?: string;
      poster_url?: string;
      poll_url?: string;
    };

    return {
      ok: true,
      jobId: json.id,
      status: json.status ?? "queued",
      videoUrl: json.video_url,
      posterUrl: json.poster_url,
      pollUrl: json.poll_url,
    };
  } catch (err) {
    return {
      ok: false,
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Poll a Higgsfield job until it finishes (or timeout).
 * Used by the API route after submitting a generation.
 */
export async function pollUntilDone(
  jobId: string,
  timeoutMs: number = 60_000,
): Promise<HiggsfieldGenerationResult> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "HIGGSFIELD_API_KEY not set" };
  }

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${HIGGSFIELD_API_BASE}/jobs/${jobId}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        return { ok: false, error: `Higgsfield ${res.status}` };
      }
      const json = (await res.json()) as {
        status?: string;
        video_url?: string;
        poster_url?: string;
      };
      if (json.status === "done" || json.video_url) {
        return {
          ok: true,
          jobId,
          status: "done",
          videoUrl: json.video_url,
          posterUrl: json.poster_url,
        };
      }
      if (json.status === "error" || json.status === "failed") {
        return { ok: false, jobId, status: json.status, error: "Job failed" };
      }
      // Otherwise queued/running — wait and retry.
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
  return { ok: false, jobId, error: "Polling timed out" };
}
