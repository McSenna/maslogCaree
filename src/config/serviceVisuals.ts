import type { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAdminDashboardPalette, type MetricTone } from "@/design/adminDashboardTheme";

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type ServiceVisual = {
  icon: MaterialIconName;
  tint: { light: string; dark: string };
  fg: { light: string; dark: string };
};

const light = getAdminDashboardPalette("light").tones;
const dark = getAdminDashboardPalette("dark").tones;

const visual = (icon: MaterialIconName, tone: MetricTone): ServiceVisual => ({
  icon,
  tint: { light: light[tone].iconBg, dark: dark[tone].iconBg },
  fg: { light: light[tone].icon, dark: dark[tone].icon },
});

// Same families as design/serviceColors: consults blue, maternal and child care green, BP checks accent.
const SERVICE_VISUALS: Record<string, ServiceVisual> = {
  general_checkup: visual("stethoscope", "primary"),
  consultation: visual("clipboard-text-outline", "primary"),
  bp_checking: visual("heart-pulse", "accent"),
  prenatal: visual("mother-heart", "care"),
  immunization: visual("needle", "care"),
};

const FALLBACK_VISUAL: ServiceVisual = visual("file-document-outline", "neutral");

export const getServiceVisual = (serviceType: string | null | undefined): ServiceVisual => {
  return SERVICE_VISUALS[String(serviceType ?? "")] ?? FALLBACK_VISUAL;
};

export const resolveVisual = (visual: ServiceVisual, isDark: boolean) => {
  return {
    icon: visual.icon,
    tint: isDark ? visual.tint.dark : visual.tint.light,
    fg: isDark ? visual.fg.dark : visual.fg.light,
  };
};
