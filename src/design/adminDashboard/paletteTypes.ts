export type MetricTone = "blue" | "green" | "pink" | "purple";

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
};
