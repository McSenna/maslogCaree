import { getAdminDashboardPalette, type MetricTone } from "@/design/adminDashboardTheme";
import { PALETTE } from "@/theme/palette";

export type ServiceTone = { bg: string; fg: string };

const { blue, green, orange } = PALETTE;

/**
 * Each service's family: consults and check-ups are primary blue, maternal and
 * child care is care green, BP checks wear the accent. Badges use the family's
 * tone; charts use two lightness steps per family, because each role's chart
 * shows exactly one pair (doctor: check-up and consultation; midwife:
 * prenatal and immunisation).
 */
const SERVICE_TONE: Record<string, MetricTone> = {
  general_checkup: "primary",
  consultation: "primary",
  prenatal: "care",
  immunization: "care",
  bp_checking: "accent",
};

/** Chart series colours (light). */
export const SERVICE_COLORS: Record<string, string> = {
  general_checkup: blue[600],
  consultation: blue[300],
  prenatal: green[600],
  immunization: green[300],
  bp_checking: orange[400],
};

/** Chart series colours (dark): the same families, readable as marks on the dark card. */
export const SERVICE_COLORS_DARK: Record<string, string> = {
  general_checkup: blue[400],
  consultation: blue[200],
  prenatal: green[500],
  immunization: green[200],
  bp_checking: orange[400],
};

const toneMap = (theme: "light" | "dark"): Record<string, ServiceTone> => {
  const { tones } = getAdminDashboardPalette(theme);
  return Object.fromEntries(
    Object.entries(SERVICE_TONE).map(([key, tone]) => [key, { bg: tones[tone].iconBg, fg: tones[tone].icon }])
  );
};

export const SERVICE_TONES_LIGHT = toneMap("light");
export const SERVICE_TONES_DARK = toneMap("dark");

const neutral = (theme: "light" | "dark"): ServiceTone => {
  const { tones } = getAdminDashboardPalette(theme);
  return { bg: tones.neutral.iconBg, fg: tones.neutral.icon };
};

export const NEUTRAL_SERVICE_TONE_LIGHT = neutral("light");
export const NEUTRAL_SERVICE_TONE_DARK = neutral("dark");

export const serviceColor = (key: string, isDark: boolean, fallback: string): string => {
  const map = isDark ? SERVICE_COLORS_DARK : SERVICE_COLORS;
  return map[key] ?? fallback;
};
