import { NextRequest, NextResponse } from "next/server";
import { CREATIVE_ANGLES } from "@/lib/creative-prompts";
import { generateVideo, pollUntilDone } from "@/lib/higgsfield";
import { mockCreativeFor } from "@/lib/mock-creative";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // up to 2 minutes for Higgsfield generation

/**
 * Generate a single Phia creative video for one angle.
 *
 * GET /api/creative/generate?angle=trust-vacuum   (optional)
 * GET /api/creative/generate                      (defaults to first angle)
 *
 * If HIGGSFIELD_API_KEY is unset, returns the mock preview for that angle.
 * Otherwise, submits to Higgsfield and polls until done.
 */
export async function GET(req: NextRequest) {
  const angleId = req.nextUrl.searchParams.get("angle");
  const angle = angleId
    ? CREATIVE_ANGLES.find((a) => a.id === angleId)
    : CREATIVE_ANGLES[0];
  if (!angle) {
    return NextResponse.json(
      { ok: false, error: `Unknown angle: ${angleId}` },
      { status: 400 },
    );
  }

  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    const m = mockCreativeFor(angle);
    return NextResponse.json({
      ok: true,
      source: "mock",
      angleId: angle.id,
      videoUrl: m.videoUrl,
      posterUrl: m.posterUrl,
      note: "HIGGSFIELD_API_KEY not set â returning mock preview.",
    });
  }

  const submit = await generateVideo({
    prompt: angle.prompt,
    aspectRatio: angle.aspectRatio,
    duration: angle.duration,
    resolution: "720p",
  });
  if (!submit.ok || !submit.jobId) {
    return NextResponse.json(
      { ok: false, angleId: angle.id, error: submit.error },
      { status: 502 },
    );
  }
  if (submit.videoUrl) {
    return NextResponse.json({
      ok: true,
      source: "live",
      angleId: angle.id,
      jobId: submit.jobId,
      videoUrl: submit.videoUrl,
      posterUrl: submit.posterUrl,
    });
  }
  const poll = await pollUntilDone(submit.jobId, 90_000);
  if (!poll.ok || !poll.videoUrl) {
    return NextResponse.json(
      {
        ok: false,
        angleId: angle.id,
        jobId: submit.jobId,
        error: poll.error ?? "Generation did not complete",
      },
      { status: 504 },
    );
  }
  return NextResponse.json({
    ok: true,
    source: "live",
    angleId: angle.id,
    jobId: submit.jobId,
    videoUrl: poll.videoUrl,
    posterUrl: poll.posterUrl,
  });
}
