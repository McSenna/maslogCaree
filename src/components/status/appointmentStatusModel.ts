export type StatusTone = "success" | "warning" | "danger" | "info" | "progress" | "neutral";

export type StatusAudience = "staff" | "resident";

export type StatusMeta = {
  key: string;
  label: string;
  tone: StatusTone;
  dot: string;
};

type StatusSpec = { staff: string; resident: string; tone: StatusTone; dot: string };

const SPECS: Record<string, StatusSpec> = {
  pending: { staff: "Pending", resident: "Pending", tone: "warning", dot: "#F59E0B" },
  confirmed: { staff: "Approved", resident: "Approved", tone: "success", dot: "#10B981" },
  rescheduled: { staff: "Rescheduled", resident: "Rescheduled", tone: "info", dot: "#1F7AF8" },
  processing: { staff: "In Progress", resident: "Being seen", tone: "progress", dot: "#8B5CF6" },
  completed: { staff: "Completed", resident: "Completed", tone: "success", dot: "#10B981" },
  declined: { staff: "Declined", resident: "Declined", tone: "danger", dot: "#EF4444" },
  cancelled: { staff: "Cancelled", resident: "Cancelled", tone: "neutral", dot: "#64748B" },
};

const NEUTRAL_DOT = "#94A3B8";

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
  if (spec) return { key, label: spec[audience], tone: spec.tone, dot: spec.dot };
  return { key, label: key ? titleCase(key) : "Unknown", tone: "neutral", dot: NEUTRAL_DOT };
};

export const getStatusLabel = (
  status: string | null | undefined,
  audience: StatusAudience = "staff"
): string => getStatusMeta(status, audience).label;
