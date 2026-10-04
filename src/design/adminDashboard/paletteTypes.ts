/**
 * Metric and category accents, named by meaning so a colour is never picked for
 * looks: primary (Healthcare Blue) for core counts, care (Healthcare Green) for
 * healthcare and positive measures, accent (Warm Orange) for what needs a look,
 * danger for failures, neutral for everything else.
 */
export type MetricTone = "primary" | "care" | "accent" | "danger" | "neutral";

export type TrendDirection = "up" | "down";

export type TrendTone = {
  text: string;
  bg: string;
};

export type ToneStyle = {
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  icon: string;
  label: string;
};

/** A semantic status tone: tinted background, readable foreground, and a border between the two. */
export type StatusTone = {
  bg: string;
  fg: string;
  border: string;
};

export type StatusToneName = "success" | "warning" | "danger" | "info" | "progress" | "neutral";

/** Accounts by role. Chart hues, validated as a set (see design/adminDashboard/lightPalette.ts). */
export type RoleColorKey = "admin" | "doctor" | "midwife" | "bhw" | "resident";

export type AdminDashboardPalette = {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  divider: string;
  heading: string;
  body: string;
  muted: string;
  subtle: string;
  primary: string;
  /** Text and icons on a solid primary fill (white in light mode, near-black on dark mode's lighter blue). */
  onPrimary: string;
  /** Keyboard focus outline for interactive dashboard elements. */
  focusRing: string;
  /** Background of hoverable rows and buttons. */
  hoverBg: string;
  positive: string;
  negative: string;
  bannerBg: string;
  bannerBorder: string;
  bannerArt: string;
  bannerArtSoft: string;
  skeleton: string;
  menuBg: string;
  menuBorder: string;
  statusActive: string;
  statusInactive: string;
  tones: Record<MetricTone, ToneStyle>;
  trends: Record<TrendDirection, TrendTone>;
  /** Meaning-bearing colours (done, needs attention, failed); never used as decoration. */
  statusTones: Record<StatusToneName, StatusTone>;
  roleColors: Record<RoleColorKey, string>;
};
