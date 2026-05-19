-015",
  },
];
/**
 * Mock fixture of competitor ads, shaped exactly like the Meta Ad Library API
 * `ads_archive` response. Until `ads_read` App Review approves, the /signal
 * page renders this through the same gradeAd() pipeline as live data â so the
 * page works end-to-end and we can sanity-check the taxonomy.
 *
 * Hook examples are *illustrative patterns* representing what the live Ad
 * Library would surface for each archetype. Brand names match the 6 direct
 * competitors from the Step-1 dashboard.
 */

import type { AdLibraryAd } from "./meta-ad-library";

const daysAgo = (n: number): string =>
  new Date(Date.now() - n * 86_400_000).toISOString();

export const MOCK_COMPETITOR_ADS: AdLibraryAd[] = [
  // ââ Pattern-interrupt heroes âââââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-001",
    page_id: "honey",
    page_name: "Honey",
    ad_creative_bodies: [
      "[visual] tight crop on price tag â snap cut to lower price â no narration",
    ],
    ad_delivery_start_time: daysAgo(82),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-001",
  },
  {
    id: "mock-002",
    page_id: "rakuten",
    page_name: "Rakuten",
    ad_creative_bodies: [
      "[snap to] cart total before cashback. [snap to] cart total after. Silent.",
    ],
    ad_delivery_start_time: daysAgo(64),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-002",
  },

  // ââ Pain-point winners âââââââââââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-003",
    page_id: "karma",
    page_name: "Karma",
    ad_creative_bodies: [
      "Tired of paying full price the day before something goes on sale? Karma watches it for you.",
    ],
    ad_delivery_start_time: daysAgo(47),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-003",
  },
  {
    id: "mock-004",
    page_id: "capital-one",
    page_name: "Capital One Shopping",
    ad_creative_bodies: [
      "Still paying full price online? Capital One Shopping finds you a lower one â automatically.",
    ],
    ad_delivery_start_time: daysAgo(73),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-004",
  },

  // ââ Transformation (UGC track) ââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-005",
    page_id: "rakuten",
    page_name: "Rakuten",
    ad_creative_bodies: [
      "I used to forget to check for cashback. Now I just let Rakuten do it. Watch what happens to my cart.",
    ],
    ad_delivery_start_time: daysAgo(38),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-005",
  },
  {
    id: "mock-006",
    page_id: "honey",
    page_name: "Honey",
    ad_creative_bodies: [
      "I added Honey at checkout and the result? My order dropped by $24 with one click.",
    ],
    ad_delivery_start_time: daysAgo(31),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-006",
  },

  // ââ Social-proof âââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-007",
    page_id: "shop-app",
    page_name: "Shop App",
    ad_creative_bodies: [
      "Join the millions of shoppers who track every package in one app. Rated 4.9 stars.",
    ],
    ad_delivery_start_time: daysAgo(56),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-007",
  },
  {
    id: "mock-008",
    page_id: "klarna",
    page_name: "Klarna",
    ad_creative_bodies: [
      "Thousands of shoppers split their cart with Klarna last week. Pay in 4 â no interest.",
    ],
    ad_delivery_start_time: daysAgo(21),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-008",
  },

  // ââ Question hooks âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-009",
    page_id: "karma",
    page_name: "Karma",
    ad_creative_bodies: [
      "Have you ever wondered why prices drop the moment you stop watching? Karma keeps watching.",
    ],
    ad_delivery_start_time: daysAgo(12),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-009",
  },
  {
    id: "mock-010",
    page_id: "klarna",
    page_name: "Klarna",
    ad_creative_bodies: [
      "What if every cart could pay itself off in four? Klarna makes it possible.",
    ],
    ad_delivery_start_time: daysAgo(9),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-010",
  },

  // ââ Curiosity hooks ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-011",
    page_id: "honey",
    page_name: "Honey",
    ad_creative_bodies: [
      "There's a button most online shoppers don't know about â and it saves them money every time.",
    ],
    ad_delivery_start_time: daysAgo(91),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-011",
  },
  {
    id: "mock-012",
    page_id: "capital-one",
    page_name: "Capital One Shopping",
    ad_creative_bodies: [
      "The reason you keep overpaying isn't your fault. Most retailers count on it.",
    ],
    ad_delivery_start_time: daysAgo(44),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-012",
  },

  // ââ Carousel + static ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  {
    id: "mock-013",
    page_id: "shop-app",
    page_name: "Shop App",
    ad_creative_bodies: [
      "Track packages",
      "Browse brands",
      "Save items",
      "Check out faster",
    ],
    ad_delivery_start_time: daysAgo(67),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-013",
  },
  {
    id: "mock-014",
    page_id: "honey",
    page_name: "Honey",
    ad_creative_bodies: ["Get Honey free. Save automatically. Try it now."],
    ad_delivery_start_time: daysAgo(8),
    publisher_platforms: ["facebook", "instagram"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-014",
  },
  {
    id: "mock-015",
    page_id: "rakuten",
    page_name: "Rakuten",
    ad_creative_bodies: ["Get cash back at 3,500+ stores. Join Rakuten today."],
    ad_delivery_start_time: daysAgo(4),
    publisher_platforms: ["facebook"],
    ad_snapshot_url: "https://www.facebook.com/ads/library/?id=mock-015",
  },
];
