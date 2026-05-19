/**
 * Mock fixture of Phia's historical ad performance, shaped exactly like the
 * Meta Marketing API `/insights` response (level=ad). Until the System User
 * token + ad account ID are set in Vercel env vars, the /insights page renders
 * this through the same gradePhiaAd() pipeline as live data.
 *
 * Values are illustrative â engineered so the pattern-mining grader produces
 * recognizable winners/losers and the page demonstrates how it'll behave with
 * real numbers.
 *
 * Replace with real data automatically the moment env vars land.
 */

import type { MetaInsight, AdCreative } from "./phia-ads-api";

const today = new Date();
const daysAgo = (n: number): string => {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().split("T")[0];
};

interface MockAd {
  insight: MetaInsight;
  creative: AdCreative;
}

const MOCK_ADS: MockAd[] = [
  // ââ Heroes (longest running, highest hook rate) âââââââââââââââââââââââââââââ
  {
    insight: {
      ad_id: "120000001",
      ad_name: "Phia Â· Curiosity Â· The Question You Ask",
      campaign_name: "Phia Acquisition Â· Curiosity",
      adset_name: "US Â· Women 22â34",
      spend: "8420.50",
      impressions: "1284000",
      reach: "742000",
      frequency: "1.73",
      clicks: "31200",
      ctr: "2.43",
      cpc: "0.27",
      cpm: "6.56",
      actions: [
        { action_type: "link_click", value: "31200" },
        { action_type: "mobile_app_install", value: "4280" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "1.97" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "412000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "298000" }],
      video_p50_watched_actions: [{ action_type: "video_view", value: "184000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "121000" }],
      video_p100_watched_actions: [{ action_type: "video_view", value: "92000" }],
      date_start: daysAgo(82),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c1",
      name: "phia-curiosity-question-v3",
      body: "There's a question I ask before I buy anything online. Anywhere.",
      title: "Phia Â· The smarter checkout",
      thumbnail_url: "",
    },
  },
  {
    insight: {
      ad_id: "120000002",
      ad_name: "Phia Â· Pattern-Interrupt Â· Price Tag Cut",
      campaign_name: "Phia Acquisition Â· Visual",
      adset_name: "US Â· Women 22â34",
      spend: "6890.20",
      impressions: "942000",
      reach: "591000",
      frequency: "1.59",
      clicks: "26100",
      ctr: "2.77",
      cpc: "0.26",
      cpm: "7.31",
      actions: [
        { action_type: "link_click", value: "26100" },
        { action_type: "mobile_app_install", value: "3640" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "1.89" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "342000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "261000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "110000" }],
      date_start: daysAgo(67),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c2",
      name: "phia-interrupt-pricetag-v2",
      body: "[visual] tight crop on price tag â snap cut to lower price â silent",
      title: "Phia",
      thumbnail_url: "",
    },
  },

  // ââ Winners (working, 30+ days) âââââââââââââââââââââââââââââââââââââââââââââ
  {
    insight: {
      ad_id: "120000003",
      ad_name: "Phia Â· Pain-Point Â· The Closed Tab",
      campaign_name: "Phia Acquisition Â· Pain",
      adset_name: "US Â· Women 22â34",
      spend: "4120.80",
      impressions: "682000",
      reach: "434000",
      frequency: "1.57",
      clicks: "18900",
      ctr: "2.77",
      cpc: "0.22",
      cpm: "6.04",
      actions: [
        { action_type: "link_click", value: "18900" },
        { action_type: "mobile_app_install", value: "2410" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "1.71" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "228000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "168000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "68000" }],
      date_start: daysAgo(44),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c3",
      name: "phia-pain-closedtab-v1",
      body: "You closed the tab. You'll think about it for three days. Then you'll pay full price.",
      title: "Phia",
      thumbnail_url: "",
    },
  },
  {
    insight: {
      ad_id: "120000004",
      ad_name: "Phia Â· Social-Proof Â· One Million",
      campaign_name: "Phia Acquisition Â· Proof",
      adset_name: "US Â· Women 22â34",
      spend: "3210.40",
      impressions: "521000",
      reach: "342000",
      frequency: "1.52",
      clicks: "11500",
      ctr: "2.21",
      cpc: "0.28",
      cpm: "6.16",
      actions: [
        { action_type: "link_click", value: "11500" },
        { action_type: "mobile_app_install", value: "1380" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "2.33" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "168000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "112000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "38000" }],
      date_start: daysAgo(38),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c4",
      name: "phia-proof-onemillion-v1",
      body: "One million people don't pay full price anymore. Join them.",
      title: "Phia",
      thumbnail_url: "",
    },
  },
  {
    insight: {
      ad_id: "120000005",
      ad_name: "Phia Â· Transformation Â· UGC Â· Sara",
      campaign_name: "Phia Acquisition Â· UGC",
      adset_name: "US Â· Women 18â28",
      spend: "5680.30",
      impressions: "812000",
      reach: "521000",
      frequency: "1.56",
      clicks: "22400",
      ctr: "2.76",
      cpc: "0.25",
      cpm: "6.99",
      actions: [
        { action_type: "link_click", value: "22400" },
        { action_type: "mobile_app_install", value: "3120" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "1.82" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "298000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "224000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "94000" }],
      date_start: daysAgo(31),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c5",
      name: "phia-ugc-sara-transformation-v1",
      body: "I used to overpay for everything. Now I let Phia tell me what's fair.",
      title: "Phia",
      thumbnail_url: "",
    },
  },

  // ââ Tested (recent, in flight) ââââââââââââââââââââââââââââââââââââââââââââââ
  {
    insight: {
      ad_id: "120000006",
      ad_name: "Phia Â· Question Â· Cart Total",
      campaign_name: "Phia Acquisition Â· Curiosity",
      adset_name: "US Â· Women 25â40",
      spend: "1420.10",
      impressions: "291000",
      reach: "211000",
      frequency: "1.38",
      clicks: "5400",
      ctr: "1.86",
      cpc: "0.26",
      cpm: "4.88",
      actions: [
        { action_type: "link_click", value: "5400" },
        { action_type: "mobile_app_install", value: "612" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "2.32" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "98000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "68000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "22000" }],
      date_start: daysAgo(14),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c6",
      name: "phia-question-carttotal-v1",
      body: "What if every cart told you what it's really worth?",
      title: "Phia",
      thumbnail_url: "",
    },
  },
  {
    insight: {
      ad_id: "120000007",
      ad_name: "Phia Â· Static Â· Logo + CTA",
      campaign_name: "Phia Retargeting",
      adset_name: "US Â· Visited LP",
      spend: "890.40",
      impressions: "184000",
      reach: "152000",
      frequency: "1.21",
      clicks: "3120",
      ctr: "1.70",
      cpc: "0.29",
      cpm: "4.84",
      actions: [
        { action_type: "link_click", value: "3120" },
        { action_type: "mobile_app_install", value: "412" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "2.16" },
      ],
      date_start: daysAgo(11),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c7",
      name: "phia-static-logo-v4",
      body: "Get Phia. Save automatically.",
      title: "Phia",
      thumbnail_url: "",
    },
  },

  // ââ Losers (low hook rate, killed early) ââââââââââââââââââââââââââââââââââââ
  {
    insight: {
      ad_id: "120000008",
      ad_name: "Phia Â· Generic Discount Hook",
      campaign_name: "Phia Acquisition Â· Discount",
      adset_name: "US Â· Women 22â34",
      spend: "412.20",
      impressions: "98000",
      reach: "84000",
      frequency: "1.17",
      clicks: "920",
      ctr: "0.94",
      cpc: "0.45",
      cpm: "4.21",
      actions: [
        { action_type: "link_click", value: "920" },
        { action_type: "mobile_app_install", value: "62" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "6.65" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "34000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "18000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "3200" }],
      date_start: daysAgo(6),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c8",
      name: "phia-discount-generic-v1",
      body: "Save big on everything you shop! Get the Phia browser extension free today!",
      title: "Phia",
      thumbnail_url: "",
    },
  },
  {
    insight: {
      ad_id: "120000009",
      ad_name: "Phia Â· Feature-Dump",
      campaign_name: "Phia Acquisition Â· Features",
      adset_name: "US Â· All",
      spend: "318.50",
      impressions: "82000",
      reach: "72000",
      frequency: "1.14",
      clicks: "612",
      ctr: "0.75",
      cpc: "0.52",
      cpm: "3.88",
      actions: [
        { action_type: "link_click", value: "612" },
        { action_type: "mobile_app_install", value: "31" },
      ],
      cost_per_action_type: [
        { action_type: "mobile_app_install", value: "10.27" },
      ],
      video_play_actions: [{ action_type: "video_view", value: "28000" }],
      video_p25_watched_actions: [{ action_type: "video_view", value: "12000" }],
      video_p75_watched_actions: [{ action_type: "video_view", value: "1800" }],
      date_start: daysAgo(4),
      date_stop: daysAgo(0),
    },
    creative: {
      id: "c9",
      name: "phia-feature-dump-v1",
      body: "Phia is a smart shopping app with price tracking, deal alerts, brand discovery, and cashback rewards.",
      title: "Phia",
      thumbnail_url: "",
    },
  },
];

export const MOCK_PHIA_INSIGHTS: MetaInsight[] = MOCK_ADS.map((m) => m.insight);
export const MOCK_PHIA_CREATIVES: Map<string, AdCreative> = new Map(
  MOCK_ADS.map((m) => [m.insight.ad_id, m.creative]),
);
