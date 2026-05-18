/**
 * Phia Creative Lab — brand prompt library.
 *
 * Each angle from the competitor-intel creative brief is paired with a
 * Higgsfield prompt that produces an on-brand short-video ad.
 *
 * Brand voice locked in across all prompts:
 *   - Dark editorial fashion photography
 *   - Fashion-forward, taste-driven, magazine-quality
 *   - Phia-Blue (#0843CB) as the single signature accent
 *   - GT Super Display (italic) headlines, Roboto Mono for data
 *   - Deep shadows, cinematic lighting, minimal composition
 *   - Female lead, 22–34, intelligent and discerning
 *
 * These prompts are designed to render through Higgsfield's Soul Mode
 * (text + reference_image_urls) so that successive runs stay visually
 * consistent across the four angles.
 */

export type CreativeAngle = {
  id: string;
  number: string;
  tag: string;
  headline: string;
  thesis: string;
  cta: string;
  /** The visual concept in plain English. */
  visualConcept: string;
  /** The Higgsfield prompt — Soul Mode, motion + composition + style. */
  prompt: string;
  /** Aspect ratio for Meta IG feed (square) vs Reels (vertical). */
  aspectRatio: "1:1" | "9:21";
  /** Video duration in seconds. */
  duration: 5 | 10;
};

const PHIA_STYLE_PREFIX =
  "Dark editorial fashion photography, magazine cover quality, soft cinematic lighting with deep directional shadows. " +
  "Minimal composition, fashion-forward styling, taste-driven aesthetic. " +
  "Color palette: deep blacks, soft cream highlights, single Phia-Blue accent (#0843CB) used sparingly. " +
  "Typography overlay in italic serif (GT Super Display style), kerned generously. " +
  "Mood: confident, intelligent, discerning, modern. " +
  "Subject: a 26-year-old woman with refined style, natural makeup, slightly off-camera gaze. " +
  "Motion: slow 5-second clip — subtle parallax, micro-movements, a single gentle zoom or pan, no jump cuts. ";

export const CREATIVE_ANGLES: CreativeAngle[] = [
  // ─────────────────────────────────────────────────────────────
  {
    id: "trust-vacuum",
    number: "01",
    tag: "Angle 01 · Trust Vacuum",
    headline: "The savings app that doesn't steal from the people you watch.",
    thesis:
      "Honey just lost Rakuten + Impact.com in January for creator-attribution fraud. Every Honey user is reading headlines. Phia: transparent affiliate stack, public commitment to creator commissions, zero last-click overwrites.",
    cta: "See if Honey owes your favorite creator money",
    visualConcept:
      "A creator-coded young woman reviewing a transparent dashboard on her phone — soft window light, hand-held intimacy, the screen subtly glowing Phia-Blue. The headline lands in italic serif across the upper third.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: a minimalist creator's apartment, soft north-facing window light, plants in soft focus. " +
      "The subject sits at a marble counter, hands cradling a phone — the phone screen shows a clean transparent dashboard with the Phia-Blue accent. " +
      "Camera: handheld feel, slow push-in over 5 seconds. " +
      "Overlay text appears around second 2 in italic serif: \"The savings app that doesn't steal from the people you watch.\" " +
      "End frame: the dashboard glows brighter, the subject offers a small confident smile.",
    aspectRatio: "1:1",
    duration: 5,
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "post-agent-reality",
    number: "02",
    tag: "Angle 02 · Post-Agent Reality",
    headline: "ChatGPT finds it. Alexa buys it. Phia tells you if the price is real.",
    thesis:
      "The shopping-agent wave handles discovery + checkout — but no one is the second-opinion layer at the moment of purchase. Phia is the price-intelligence sidekick the new agent stack doesn't have.",
    cta: "The price you got isn't always the best one",
    visualConcept:
      "Hands typing on a laptop — multiple AI chat browser tabs visible but blurred, foreground shows a fashion product page with a small Phia browser-extension popup surfacing a better price. Editorial close-up, almost still-life.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: a sleek desk, late afternoon golden hour spilling from camera-left. " +
      "Subject framing: tight shot of hands typing on a slim silver laptop — manicured nails, subtle gold rings. " +
      "Screen content: a fashion brand product page (designer handbag), with a small Phia browser-extension popup in the corner showing 'Better price found' in italic serif on a Phia-Blue background. " +
      "Camera: slow drift-in over 5 seconds — laptop screen comes into focus, popup appears at second 3. " +
      "Overlay text appears at second 4 in italic serif: \"The price isn't always real.\" " +
      "End frame: a hand reaches toward the Phia popup.",
    aspectRatio: "1:1",
    duration: 5,
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "luxury-cross-market",
    number: "03",
    tag: "Angle 03 · Luxury Cross-Market",
    headline: "Shop Miu Miu. Don't pay Miu Miu prices.",
    thesis:
      "Vestiaire + Poshmark push Miu Miu / Hermes / Gucci in resale. Phia spans new and secondhand in one view: same aspirational target, smarter price stack. Nobody else combines.",
    cta: "Find your bag — new, used, or both",
    visualConcept:
      "A luxury handbag on warm marble in dramatic editorial light. Two price tags hang from the strap: one struck-through retail, one Phia-Blue savings number. Still-life cinematography with subtle parallax.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: warm cream Calacatta marble countertop, dramatic side-lighting from the right creating long soft shadows. " +
      "Subject: a luxury structured handbag in dusty pink leather with a gold chain (Miu Miu Wander style), photographed slightly above eye-level. " +
      "Detail: two price tags hang from the strap on tiny black ribbons — the first shows a high retail price with a clean strike-through line; the second shows a much lower price in italic serif numerals, set against a Phia-Blue rectangle. " +
      "Camera: a slow rotating dolly over 5 seconds — light shifts subtly, shadows move, the lower price tag catches the light at second 4. " +
      "Overlay text appears at second 2 in italic serif: \"Shop Miu Miu. Don't pay Miu Miu prices.\" " +
      "End frame: full handbag in frame with both price tags clearly legible.",
    aspectRatio: "1:1",
    duration: 5,
  },
  // ─────────────────────────────────────────────────────────────
  {
    id: "smart-not-indebted",
    number: "04",
    tag: "Angle 04 · Smart, Not Indebted",
    headline: "Klarna sells you debt. Phia hands you cash back.",
    thesis:
      "Klarna's AI assistant is the loudest savings positioning on Meta — and it's BNPL underneath. Phia is the inverse identity: you earn money, you don't owe it. Same shopping moment, opposite math.",
    cta: "See what you're leaving on the table",
    visualConcept:
      "A serene confident woman against a deep navy backdrop — soft chiaroscuro lighting — holding a crisp folded stack of cash in her palm. Editorial portrait, almost Vermeer-quality lighting.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: a studio with a deep navy seamless backdrop, single soft directional key light from camera-left creating Vermeer-style chiaroscuro. " +
      "Subject: a 26-year-old woman in a structured cream silk blouse, hair pulled back, natural makeup, expression confident and quietly satisfied. " +
      "Pose: she holds a small neat stack of folded $100 bills resting in her open palm, framed at chest height, the cash slightly glowing under the key light. " +
      "Camera: a very slow 5-second push-in toward her face and hands. " +
      "Overlay text appears at second 2 in italic serif: \"Klarna sells you debt.\" Then at second 3.5 the second line slides in below in Phia-Blue: \"Phia hands you cash back.\" " +
      "End frame: her gaze meets the camera with a subtle smile.",
    aspectRatio: "1:1",
    duration: 5,
  },
];

/**
 * Higgsfield Soul Mode reference images — a small set of brand-anchor
 * images that the model can use to keep style consistent across runs.
 *
 * These should be hosted on phia.com or a public Phia CDN. For MVP they
 * can be empty (Soul Mode falls back to Text-to-Video which is fine).
 */
export const PHIA_REFERENCE_IMAGE_URLS: string[] = [
  // TODO: add 2-3 Phia brand reference images once Hana picks them
  // e.g., "https://phia.com/brand/editorial-01.jpg",
  // e.g., "https://phia.com/brand/editorial-02.jpg",
];
