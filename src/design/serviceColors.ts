export type ServiceTone = { bg: string; fg: string };

export const SERVICE_COLORS: Record<string, string> = {
  general_checkup: "#2563EB",
  prenatal: "#DB2777",
  immunization: "#059669",
  consultation: "#7C3AED",
  bp_checking: "#E11D48",
};

export const SERVICE_COLORS_DARK: Record<string, string> = {
  general_checkup: "#93C5FD",
  prenatal: "#F9A8D4",
  immunization: "#6EE7B7",
  consultation: "#C4B5FD",
  bp_checking: "#FDA4AF",
};

export const SERVICE_TONES_LIGHT: Record<string, ServiceTone> = {
  general_checkup: { bg: "#E8F0FE", fg: SERVICE_COLORS.general_checkup },
  prenatal: { bg: "#FDE8EF", fg: SERVICE_COLORS.prenatal },
  immunization: { bg: "#E3F6EC", fg: SERVICE_COLORS.immunization },
  consultation: { bg: "#EFEAFE", fg: SERVICE_COLORS.consultation },
  bp_checking: { bg: "#FEE9E9", fg: SERVICE_COLORS.bp_checking },
};

export const SERVICE_TONES_DARK: Record<string, ServiceTone> = {
  general_checkup: { bg: "rgba(37,99,235,0.18)", fg: SERVICE_COLORS_DARK.general_checkup },
  prenatal: { bg: "rgba(219,39,119,0.18)", fg: SERVICE_COLORS_DARK.prenatal },
  immunization: { bg: "rgba(5,150,105,0.18)", fg: SERVICE_COLORS_DARK.immunization },
  consultation: { bg: "rgba(124,58,237,0.18)", fg: SERVICE_COLORS_DARK.consultation },
  bp_checking: { bg: "rgba(225,29,72,0.18)", fg: SERVICE_COLORS_DARK.bp_checking },
};

export const NEUTRAL_SERVICE_TONE_LIGHT: ServiceTone = { bg: "#EEF2F7", fg: "#64748B" };
export const NEUTRAL_SERVICE_TONE_DARK: ServiceTone = {
  bg: "rgba(148,163,184,0.16)",
  fg: "#94A3B8",
};

export const serviceColor = (key: string, isDark: boolean, fallback: string): string => {
  const map = isDark ? SERVICE_COLORS_DARK : SERVICE_COLORS;
  return map[key] ?? fallback;
};
