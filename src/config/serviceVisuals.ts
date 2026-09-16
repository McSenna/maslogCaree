import type { MaterialCommunityIcons } from "@expo/vector-icons";

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type ServiceVisual = {
  icon: MaterialIconName;
  tint: { light: string; dark: string };
  fg: { light: string; dark: string };
};

const SERVICE_VISUALS: Record<string, ServiceVisual> = {
  general_checkup: {
    icon: "stethoscope",
    tint: { light: "#EAF2FF", dark: "rgba(37,99,235,0.16)" },
    fg: { light: "#1F7AF8", dark: "#93C5FD" },
  },
  consultation: {
    icon: "clipboard-text-outline",
    tint: { light: "#F1ECFF", dark: "rgba(139,92,246,0.16)" },
    fg: { light: "#6D28D9", dark: "#C4B5FD" },
  },
  bp_checking: {
    icon: "heart-pulse",
    tint: { light: "#FEF1F1", dark: "rgba(239,68,68,0.14)" },
    fg: { light: "#DC2626", dark: "#FCA5A5" },
  },
  prenatal: {
    icon: "mother-heart",
    tint: { light: "#FFF1F6", dark: "rgba(236,72,153,0.16)" },
    fg: { light: "#BE185D", dark: "#F9A8D4" },
  },
  immunization: {
    icon: "needle",
    tint: { light: "#E7F8F0", dark: "rgba(16,185,129,0.14)" },
    fg: { light: "#047857", dark: "#6EE7B7" },
  },
};

const FALLBACK_VISUAL: ServiceVisual = {
  icon: "file-document-outline",
  tint: { light: "#EEF3FA", dark: "#1E293B" },
  fg: { light: "#475569", dark: "#94A3B8" },
};

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
