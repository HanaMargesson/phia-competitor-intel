import type { CompetitorStatic, LayerMeta } from "./types";

export const LAYERS: LayerMeta[] = [
  {
    id: "ai-agents",
    index: 1,
    name: "AI Shopping Agents",
    subtitle: "The competitive frontier",
    pillStyle: "blue",
  },
  {
    id: "savings-extensions",
    index: 2,
    name: "Savings Extensions",
    subtitle: "The category being disrupted",
    pillStyle: "black",
  },
  {
    id: "resale",
    index: 3,
    name: "Resale & Secondhand",
    subtitle: "Audience overlap, not direct competition",
    pillStyle: "gray",
  },
];

/**
 * Competitor metadata.
 *
 * `pageIds` are Meta Facebook Page IDs used as `search_page_ids` in the Ad Library API.
 * Some are placeholders — update with the real IDs from
 *   https://www.facebook.com/ads/library/?country=US&q=<brand>
 * (open any ad → "See ad details" → page ID is visible).
 *
 * Editorial fallbacks are used when the API is unavailable or returns empty.
 */
export const COMPETITORS: CompetitorStatic[] = [
  // ───── Layer 1: AI Shopping Agents ─────
  {
    slug: "daydream",
    name: "Daydream",
    layer: "ai-agents",
    pageIds: ["100089120000000"], // TODO: replace with real Page ID
    country: "US",
    editorial: {
      hooks: [
        '"Revenge dress for a party in Sicily"',
        '"Your AI fashion stylist, finally"',
        '"Chat your way to your next outfit"',
        '"2M products. 8K brands. Zero browsing."',
        '"Karlie Kloss invests"',
      ],
      formats: [
        { label: "Chat Replay UGC", tone: "blue" },
        { label: "Founder Story" },
        { label: "Outfit Demo" },
      ],
      pattern:
        'Owns "fashion-only AI shopping" via iPhone app. $50M seed, 200+ retailer integrations. Sells the conversational moment, not the savings. Phia gap: they don\'t operate at checkout, they don\'t surface price intelligence.',
    },
  },
  {
    slug: "alexa-shopping",
    name: "Alexa for Shopping",
    subname: "was Rufus",
    layer: "ai-agents",
    pageIds: ["20446254070"], // Amazon US Page ID
    country: "US",
    editorial: {
      volOverride: "Just launched May 13",
      volTone: "hot",
      hooks: [
        '"Buy for me — across the web"',
        '"From search bar to checkout, by Alexa"',
        '"Compare. Track price. Reorder."',
        '"Your shopping, on autopilot"',
      ],
      formats: [
        { label: "Brand Hero Video", tone: "blue" },
        { label: "Voice Demo" },
        { label: "Echo Show Static" },
      ],
      pattern:
        "Two-day-old launch — expect heavy Meta spend ramp through end of month. Amazon's pitch: voice-first agentic commerce that purchases on third-party sites. Phia gap: browser-native, not voice; not locked to Amazon's product graph.",
    },
  },
  {
    slug: "perplexity-shopping",
    name: "Perplexity Shopping",
    layer: "ai-agents",
    pageIds: ["106020181947268"], // TODO: verify
    country: "US",
    editorial: {
      darkStatus: "Dark on Meta · by choice",
      volOverride: "Pulled all paid ads · Feb '26",
      volTone: "dark",
      hooks: [
        "Eliminated all ad placements (trust pivot)",
        "0% merchant fees · no transaction cut",
        'Promoting "Computer" agent for marketers',
      ],
      formats: [],
      pattern:
        "Won't outspend you. Will out-recommend you inside conversational search. Phia plays a different surface (browser at point-of-purchase), but Perplexity is shifting where product discovery starts.",
    },
  },
  {
    slug: "chatgpt-shopping",
    name: "ChatGPT Shopping",
    layer: "ai-agents",
    pageIds: ["112524473672981"], // TODO: verify (OpenAI page)
    country: "US",
    editorial: {
      volOverride: "~$100M ARR ad pilot",
      volTone: "hot",
      hooks: [
        '"Ask. Compare. Buy."',
        '"Shopping with 700M people"',
        '"Now in Free, Go, Plus, Pro"',
        '"Discover, then check out where you like"',
      ],
      formats: [
        { label: "Product UGC", tone: "blue" },
        { label: "Chat Replay" },
        { label: "Editorial Static" },
      ],
      pattern:
        "Abandoned Instant Checkout — pivoted to product discovery, ceded purchase completion. New ad platform at $60 CPM, fastest-growing since TikTok. Phia gap: ChatGPT discovers; Phia validates the deal at the moment you actually buy.",
    },
  },
  {
    slug: "klarna",
    name: "Klarna AI",
    layer: "ai-agents",
    pageIds: ["156675057755876"],
    country: "US",
    editorial: {
      hooks: [
        '"Ask Klarna — your AI personal shopper"',
        '"100M products. One agent."',
        '"Smoooth payments + smart discovery"',
        '"Buy now, ask later"',
        '"Resell from inside the app"',
      ],
      formats: [
        { label: "In-App Demo", tone: "blue" },
        { label: "Co-branded Static" },
        { label: "Lifestyle Video" },
      ],
      pattern:
        "Most aggressive AI repositioning in fintech. Owns Agentic Product Protocol (100M products, 12 markets), live on Google UCP + Stripe SPT. Still selling debt-shaped 'savings.' Phia contrast: you earn, you don't owe.",
    },
  },
  {
    slug: "google-shopping",
    name: "Google Shopping AI",
    layer: "ai-agents",
    pageIds: ["104958162837"], // Google US Page ID
    country: "US",
    editorial: {
      hooks: [
        '"Try it on with AI"',
        '"75M people shop with AI Mode"',
        '"Universal Commerce Protocol — checkout on Etsy & Wayfair"',
        '"50B products. Refreshed every hour."',
      ],
      formats: [
        { label: "AI Mode Demo", tone: "blue" },
        { label: "Try-On Video" },
        { label: "YouTube Pre-roll" },
      ],
      pattern:
        "Owns the discovery funnel above the browser. UCP added Cart, Catalog, Identity Linking in Q1. Phia plays inside-the-tab where Google ends. Phia gap: nobody is doing post-Google price validation in the moment.",
    },
  },

  // ───── Layer 2: Savings Extensions ─────
  {
    slug: "honey",
    name: "Honey (PayPal)",
    layer: "savings-extensions",
    pageIds: ["1622248671354711"],
    country: "US",
    editorial: {
      darkStatus: "Effectively dark · trust crisis",
      volOverride: "Category collapse",
      volTone: "dark",
      hooks: [
        "Rakuten Advertising terminated Honey · Jan 12",
        "Impact.com removed from network · Jan 17",
        "~2,000 retailers lost in 5 days",
        "'Stand-down' attribution fraud allegations",
      ],
      formats: [],
      pattern:
        "The category-defining player just imploded. Every Honey user is a high-intent prospect for a savings extension that doesn't steal creator commissions. This is the single biggest Phia opportunity in the deck.",
    },
  },
  {
    slug: "rakuten",
    name: "Rakuten Cashback",
    layer: "savings-extensions",
    pageIds: ["117464888278842"],
    country: "US",
    editorial: {
      hooks: [
        '"Get cash back at 3,500+ stores"',
        '"Big Fat Cash Back" seasonal hook',
        '"Why pay full price — ever"',
        '"Now with the network Honey lost"',
      ],
      formats: [
        { label: "Brand Static" },
        { label: "Founder Talking-Head" },
        { label: "DPA Carousel" },
      ],
      pattern:
        "Picked up Honey's affiliate footprint and is leaning hard on trust. Still feels like a 2015 product visually. Phia gap: aesthetics + fashion-native targeting — Rakuten is general retail, Phia is curated.",
    },
  },
  {
    slug: "capitalone-shopping",
    name: "Capital One Shopping",
    layer: "savings-extensions",
    pageIds: ["80878724562"],
    country: "US",
    editorial: {
      hooks: [
        '"Price comparison automatically"',
        '"Coupon codes, applied"',
        '"Free, no credit card required"',
      ],
      formats: [{ label: "Demo Screenshot" }, { label: "Performance DR" }],
      pattern:
        "Steady, low-volume, primarily DR. Tied to bank brand. No fashion-specific creative. Phia gap: identity — Phia is a fashion shopper's tool; Cap1 is a household utility.",
    },
  },
  {
    slug: "karma-cently-slickdeals",
    name: "Karma, Cently, Slickdeals",
    layer: "savings-extensions",
    pageIds: [],
    country: "US",
    editorial: {
      darkStatus: "Long tail · low pressure",
      volOverride: "Minimal Meta presence",
      volTone: "dark",
      hooks: [
        "Karma — sub-10 active ads, niche affiliates",
        "Cently — no current Meta presence",
        "Slickdeals — community-led, not paid",
      ],
      formats: [],
      pattern:
        "Beyond Honey + Rakuten + Cap1, the savings-extension category has effectively no Meta presence. Phia can claim 'the smart savings app for fashion' with no direct paid competitor.",
    },
  },
  {
    slug: "edge-coupons",
    name: "Microsoft Edge Coupons",
    layer: "savings-extensions",
    pageIds: ["20528438720"], // Microsoft
    country: "US",
    editorial: {
      hooks: ['"Built into your browser"', '"Copilot finds you a deal"'],
      formats: [{ label: "Browser Demo" }],
      pattern:
        "Browser-native savings via Copilot. Tied to Edge adoption — not a real threat outside the Edge user base. Phia plays in Chrome/Safari where 90%+ of US shoppers live.",
    },
  },
  {
    slug: "shop-app",
    name: "Shop App (Shopify)",
    layer: "savings-extensions",
    pageIds: ["170787229681415"], // Shopify
    country: "US",
    editorial: {
      hooks: [
        '"Track every package in one place"',
        '"Discover small brands"',
        '"Shop Pay — one-tap checkout"',
      ],
      formats: [
        { label: "Product UGC" },
        { label: "Brand Story" },
        { label: "Tracking Demo" },
      ],
      pattern:
        "Owns the post-purchase tracking and Shopify-brand discovery surface. Doesn't compete on price intelligence. Phia gap: works on any store, not just Shopify.",
    },
  },

  // ───── Layer 3: Resale & Secondhand ─────
  {
    slug: "depop",
    name: "Depop",
    layer: "resale",
    pageIds: ["161987840470174"],
    country: "US",
    editorial: {
      hooks: [
        '"The best style lives on Depop"',
        '"Snap an outfit. Find it on Depop." (AI image search)',
        '"Zero selling fees — US & UK"',
        '"Depop Space — NYC, LA, London"',
        '"Selfridges curated drop"',
      ],
      formats: [
        { label: "UGC Haul", tone: "blue" },
        { label: "GRWM" },
        { label: "TikTok Reel", tone: "warn" },
      ],
      pattern:
        "+40% TikTok/IG Reels spend. AI image search live. Active listings up ~20%. Phia overlap: identical Gen Z fashion audience — but Depop sells the secondhand product, Phia adds the layer that finds the better price anywhere.",
    },
  },
  {
    slug: "poshmark",
    name: "Poshmark",
    layer: "resale",
    pageIds: ["161817830543036"],
    country: "US",
    editorial: {
      volTone: "hot",
      hooks: [
        '"Save up to 70% off"',
        '"Smart List AI — list from one photo"',
        '"Promoted Closet — one click ads"',
        '"Live shopping, every night"',
        '"Pre-loved luxury — Miu Miu, Hermes"',
      ],
      formats: [
        { label: "Product Static" },
        { label: "Live Replay", tone: "blue" },
        { label: "DPA Carousel" },
        { label: "UGC Haul" },
      ],
      pattern:
        "Largest paid presence in resale. Heavy DPA retargeting. AI seller tools are the new pillar. Luxury creep continues. Phia overlap: Poshmark wants their price; Phia helps you find the real best price across new + secondhand.",
    },
  },
  {
    slug: "thredup",
    name: "ThredUp",
    layer: "resale",
    pageIds: ["119469084743543"],
    country: "US",
    editorial: {
      hooks: [
        '"Why pay full price? Thrift it."',
        '"Resale-as-a-Service — for brands"',
        '"AI-powered fit + style match"',
        '"Up to 90% off est. retail"',
        '"Clean Out Bag" seller campaign',
      ],
      formats: [
        { label: "Product Static" },
        { label: "Brand Video 15–30s" },
        { label: "Sustainability Hero", tone: "pos" },
      ],
      pattern:
        "Owns sustainability + value-led messaging. Three new AI tools shipped. B2B 'Resale-as-a-Service' expanding. Phia avoids sustainability lane — it's saturated. Lean into financial intelligence + identity instead.",
    },
  },
  {
    slug: "vestiaire",
    name: "Vestiaire Collective",
    layer: "resale",
    pageIds: ["134175983321040"],
    country: "US",
    editorial: {
      hooks: [
        '"Stop dreaming. Start wearing."',
        '"3M items. 12K brands. Up to 70% off."',
        '"CPW — cost per wear, exposed"',
        '"B Corp certified resale"',
        "Code: NEW10",
      ],
      formats: [
        { label: "Luxury Static" },
        { label: "Brand Video 30–45s", tone: "blue" },
        { label: "UGC Short" },
      ],
      pattern:
        "Lean operation, highest signal-per-ad. Authentication + CPW metric as differentiators. Luxury framing. Phia overlap: shared aspirational audience — Phia wins by working on the full-price first-hand purchase they're trying to talk people out of.",
    },
  },
  {
    slug: "mercari",
    name: "Mercari",
    layer: "resale",
    pageIds: ["143020365802099"],
    country: "US",
    editorial: {
      darkStatus: "Pulled back from Meta",
      volOverride: "Dark on Meta",
      volTone: "dark",
      hooks: [
        "No Mercari.com campaigns active",
        "Search returns reseller tools only",
      ],
      formats: [],
      pattern:
        "Mercari has fully retreated from Meta. Their fashion-resale audience is sitting unaddressed on IG/FB.",
    },
  },
  {
    slug: "grailed",
    name: "Grailed",
    layer: "resale",
    pageIds: ["271920036332170"],
    country: "US",
    editorial: {
      darkStatus: "Organic-only · no Meta spend",
      volOverride: "Dark on Meta",
      volTone: "dark",
      hooks: [
        "No US paid ads on Meta",
        "Strong Reddit / Discord organic",
      ],
      formats: [],
      pattern:
        "Zero paid Meta presence. Fashion-forward menswear-leaning resale audience completely unaddressed on IG/FB. Clear Phia opportunity for a male-skew creative test.",
    },
  },
];
