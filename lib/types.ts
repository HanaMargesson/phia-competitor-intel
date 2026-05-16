export type Layer = "ai-agents" | "savings-extensions" | "resale";

export type LayerMeta = {
  id: Layer;
  index: number;
  name: string;
  subtitle: string;
  pillStyle: "blue" | "black" | "gray";
};

export type FormatTag = {
  label: string;
  tone?: "default" | "blue" | "warn" | "pos";
};

export type CompetitorStatic = {
  slug: string;
  name: string;
  layer: Layer;
  /** Meta Ad Library Page ID(s). Multiple allowed for brands with regional pages. */
  pageIds: string[];
  /** Country code for the Ad Library query. */
  country: "US";
  /** Optional override label appearing under the name (e.g., "was Rufus"). */
  subname?: string;
  /** Optional fallback editorial copy when API fails or for "dark on Meta" brands. */
  editorial?: {
    hooks?: string[];
    formats?: FormatTag[];
    pattern: string;
    /** Marks card as a "dark / status" card with a status pill instead of vol badge. */
    darkStatus?: string;
    /** Force a vol badge label (overrides live count). */
    volOverride?: string;
    /** Override vol badge styling. */
    volTone?: "default" | "hot" | "dark";
  };
};

export type CompetitorLive = {
  slug: string;
  name: string;
  subname?: string;
  layer: Layer;
  /** "Live" or "Cached" — surfaced in the UI. */
  source: "live" | "mock" | "cached";
  fetchedAt: string;
  /** Active ad count from Meta Ad Library. Null when unavailable. */
  activeAdCount: number | null;
  /** Top hook strings — extracted from ad_creative_bodies (deduped, truncated). */
  hooks: string[];
  /** Format tag breakdown (heuristic from media_type / link properties). */
  formats: FormatTag[];
  /** Hand-curated editorial pattern paragraph (not live). */
  pattern: string;
  /** When set, shows the "dark on Meta" pill instead of a count badge. */
  darkStatus?: string;
  volOverride?: string;
  volTone?: "default" | "hot" | "dark";
};

export type DashboardData = {
  generatedAt: string;
  /** Whether any of the competitors used live API data. */
  anyLive: boolean;
  /** Notes surfaced in the header (e.g., "Meta API token not set — showing mock data"). */
  sourceNote: string;
  competitors: CompetitorLive[];
};
