import { PALETTE } from "../../theme/palette.ts";

export type StatusTone = "success" | "warning" | "danger" | "info" | "progress" | "neutral";

export type StatusAudience = "staff" | "resident";

/** Feather glyph names; kept as literals so this module stays import-free. */
export type StatusIcon = "clock" | "check-circle" | "rotate-ccw" | "activity" | "check-square" | "x-circle" | "slash" | "help-circle";

export type StatusMeta = {
  key: string;
  label: string;
  tone: StatusTone;
  dot: string;
  icon: StatusIcon;
};

type StatusSpec = { staff: string; resident: string; tone: StatusTone; dot: string; icon: StatusIcon };

// Dot colours are the palette anchors. The relative import keeps this module
// loadable by the node test runner, which has no "@/" alias. Dots always sit
// beside the icon and label, so meaning never rests on colour alone.
const SPECS: Record<string, StatusSpec> = {
  pending: { staff: "Pending", resident: "Pending", tone: "warning", dot: PALETTE.amber[500], icon: "clock" },
  confirmed: { staff: "Confirmed", resident: "Confirmed", tone: "success", dot: PALETTE.success[500], icon: "check-circle" },
  rescheduled: { staff: "Rescheduled", resident: "Rescheduled", tone: "info", dot: PALETTE.blue[600], icon: "rotate-ccw" },
  processing: { staff: "In Progress", resident: "Being seen", tone: "progress", dot: PALETTE.blue[600], icon: "activity" },
  completed: { staff: "Completed", resident: "Completed", tone: "success", dot: PALETTE.success[500], icon: "check-square" },
  declined: { staff: "Declined", resident: "Declined", tone: "danger", dot: PALETTE.red[500], icon: "x-circle" },
  cancelled: { staff: "Cancelled", resident: "Cancelled", tone: "neutral", dot: PALETTE.slate[500], icon: "slash" },
};

const NEUTRAL_DOT = PALETTE.slate[400];

const titleCase = (value: string): string =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export const normalizeStatus = (status: string | null | undefined): string =>
  String(status ?? "").trim().toLowerCase();

export const getStatusMeta = (
  status: string | null | undefined,
  audience: StatusAudience = "staff"
): StatusMeta => {
  const key = normalizeStatus(status);
  const spec = SPECS[key];
  if (spec) return { key, label: spec[audience], tone: spec.tone, dot: spec.dot, icon: spec.icon };
  return { key, label: key ? titleCase(key) : "Unknown", tone: "neutral", dot: NEUTRAL_DOT, icon: "help-circle" };
};

export const getStatusLabel = (
  status: string | null | undefined,
  audience: StatusAudience = "staff"
): string => getStatusMeta(status, audience).label;
