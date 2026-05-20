/**
 * Phia Creative Lab -- brand prompt library (V2).
 *
 * Each angle is paired with a Higgsfield prompt that produces an on-brand
 * short-video ad. V2 voice grounded in /insights data: Pain Point archetype
 * + first-person UGC + named designer + specific dollar amount.
 *
 * Brand voice locked in across all prompts:
 *   - Dark editorial fashion photography
 *   - Fashion-forward, taste-driven, magazine-quality
 *   - Phia-Blue (#0843CB) as the single signature accent
 *   - GT Super Display (italic) headlines, Roboto Mono for data
 *   - Deep shadows, cinematic lighting, minimal composition
 *   - Female lead, 22-34, intelligent and discerning
 *
 * Brand-safety rule: NO competitor platforms named in copy or visuals.
 * Designer brands and specific items DO appear -- they make the moment real.
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
  /** The Higgsfield prompt -- Soul Mode, motion + composition + style. */
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
  "Motion: slow 5-second clip -- subtle parallax, micro-movements, a single gentle zoom or pan, no jump cuts. ";

export const CREATIVE_ANGLES: CreativeAngle[] = [
  {
    id: "trust-vacuum",
    number: "01",
    tag: "Angle 01 - Trust Vacuum",
    headline:
      "I bought $4,000 in Louis Vuitton through my favorite creator's link. Not a dollar of her commission came through.",
    thesis:
      "The savings-extension category just took major reputational damage for creator-attribution fraud. Phia owns the transparent-alternative lane -- zero last-click overwrites, public creator-commission commitment.",
    cta: "See what your favorite creators have lost on your shopping",
    visualConcept:
      "First-person POV on a phone. Slow scroll through a receipts dashboard showing the LV bag purchase line by line -- affiliate link clicked, sale recorded, commission redirected away from the creator. Editorial intimacy, soft north light.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: a minimalist apartment, soft north-facing window light, plants in soft focus. " +
      "Subject framing: close-up of hands holding a phone -- manicured nails, subtle gold rings. " +
      "Screen content: a clean receipts list in italic serif typography -- a creator name at the top, then a line item: 'Louis Vuitton Speedy 25 -- $4,000,' then 'Commission earned: $0' highlighted with a single Phia-Blue accent. " +
      "Camera: a slow vertical tilt-down through the receipts list over 5 seconds. " +
      "Overlay text appears at second 3 in italic serif: \"$400 in commission. Not a cent to the creator.\" " +
      "End frame: subject's face out of focus in background, the receipt readout still legible in the foreground.",
    aspectRatio: "1:1",
    duration: 5,
  },
  {
    id: "post-agent-reality",
    number: "02",
    tag: "Angle 02 - Post-Agent Reality",
    headline:
      "I let an AI pick my Chanel mini flap. Three sites later, I'd overpaid by $400.",
    thesis:
      "The shopping-agent wave handles discovery + checkout -- but no one is the second-opinion layer at the moment of purchase. Phia is the price-truth sidekick the new agent stack doesn't have.",
    cta: "Before the agent buys -- let Phia check the math",
    visualConcept:
      "Subject on a couch at night, laptop open. Multiple browser tabs faintly visible behind the foreground one -- an AI shopping chat, a Chanel product page, a checkout page. She squints at the price, closes the laptop slowly. The exhaustion of having shopped but lost.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: editorial nighttime interior, a low warm key light from camera-left, deep navy and shadow elsewhere. " +
      "Subject framing: a 26-year-old woman seated on a low slipper-couch in a cream silk robe, laptop balanced on her knees. " +
      "Screen content: the laptop screen shows an AI shopping chat in one tab and the Chanel mini flap product page across three ghosted background tabs, all with visible price tags ($4,500, $4,500, $4,100). " +
      "Camera: slow 5-second push-in over the subject's shoulder toward the laptop screen. " +
      "Overlay text appears at second 3 in italic serif: \"How much did the agent actually save you?\" " +
      "End frame: subject's hand slowly closes the laptop lid, the Phia-Blue accent appears on the closed laptop's logo.",
    aspectRatio: "1:1",
    duration: 5,
  },
  {
    id: "luxury-cross-market",
    number: "03",
    tag: "Angle 03 - Luxury Cross-Market",
    headline:
      "I waited three months for the Miu Miu ballet flats. They were $300 less on resale the whole time.",
    thesis:
      "Resale dominates secondhand. Shopping agents dominate new. Nobody combines new + resale price intelligence in a single view at the point of purchase. Phia is the only product that spans both.",
    cta: "Phia checks resale the second you check retail",
    visualConcept:
      "Editorial product still-life. The Miu Miu ballet flat in soft hero light, full retail price overlaid in monospace ($895). Subject's hand enters frame, taps phone. The frame transitions -- same shoe, but a resale listing visible below: $595. Soft beat of recognition.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: a warm Calacatta marble countertop, dramatic side-lighting from the right creating long soft shadows. " +
      "Subject framing: a single Miu Miu ballet flat in soft pink satin photographed slightly above eye-level, magazine still-life styling. " +
      "Detail: two price chips hover beside the shoe -- the first reads 'Retail $895' with a clean strike-through; the second reads 'Resale $595' in italic serif numerals on a small Phia-Blue rectangle. " +
      "Camera: a slow rotating dolly over 5 seconds -- light shifts subtly, the lower price chip catches the light at second 4. " +
      "Overlay text appears at second 2 in italic serif: \"Phia checks resale the second you check retail.\" " +
      "End frame: full ballet flat in frame with both price chips clearly legible.",
    aspectRatio: "1:1",
    duration: 5,
  },
  {
    id: "smart-not-indebted",
    number: "04",
    tag: "Angle 04 - Smart, Not Indebted",
    headline:
      "I paid off my Hermes Birkin in four installments. I just realized I should've had $312 in cash back instead.",
    thesis:
      "The loudest savings positioning on Meta belongs to an AI-assistant BNPL product. Phia is the inverse identity: you earn money, you don't owe it. Same shopping moment, opposite math.",
    cta: "Check what your year of installments actually cost you",
    visualConcept:
      "Top-down shot of a monthly installment statement printed out, marked with handwritten totals -- pen-and-paper 'what I owe' math next to the phone screen. The phone screen shows Phia's counter-math: same year of designer purchases, what the cash back stack could have been. Quiet, almost forensic.",
    prompt:
      PHIA_STYLE_PREFIX +
      "Setting: a deep walnut wood desk, soft daylight from camera-right, a small leather notepad and gold pen at the edge of frame. " +
      "Subject framing: top-down flat-lay -- a printed monthly installment statement on cream paper, annotated in fountain-pen ink ('Hermes Birkin -- 4 of 4 paid'), placed beside an iPhone. " +
      "Screen content: the iPhone shows Phia's view of the same year of purchases, the running cash-back tally readable in italic serif: '$312 missed.' The number glows softly in Phia-Blue. " +
      "Camera: a slow vertical pull-back over 5 seconds revealing more of the desk and the contrast between the two surfaces. " +
      "Overlay text appears at second 2 in italic serif: \"Same year. Different math.\" " +
      "End frame: the iPhone Phia-Blue '$312' tally crisp in the center of frame.",
    aspectRatio: "1:1",
    duration: 5,
  },
];

/**
 * Higgsfield Soul Mode reference images -- a small set of brand-anchor
 * images the model can use to keep style consistent across runs.
 */
export const PHIA_REFERENCE_IMAGE_URLS: string[] = [
  // TODO: add 2-3 Phia brand reference images once Hana picks them
];
