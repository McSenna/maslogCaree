import { SUPPORT_CATEGORIES, SUPPORT_STATUS_LABELS } from "../constants/support.constants";
import type { SupportCategoryId, SupportStatus } from "../types/support.types";

export const supportCategoryLabel = (categoryId: SupportCategoryId | ""): string =>
  SUPPORT_CATEGORIES.find((entry) => entry.id === categoryId)?.label ?? "Other Concern";

export const supportStatusLabel = (status: SupportStatus): string =>
  SUPPORT_STATUS_LABELS[status] ?? "Open";

export { formatFileSize } from "@/utils/fileSize";

export const fileExtensionOf = (fileName: string): string =>
  fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "";

export const formatTicketDate = (value: string | null): string => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTicketDateTime = (value: string | null): string => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return `${formatTicketDate(value)} · ${date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

const BADGE_PRIORITY: SupportStatus[] = ["awaiting_user", "open", "in_review"];

export const buildSupportBadgeLabel = (
  counts: Partial<Record<SupportStatus, number>>
): string | undefined => {
  const status = BADGE_PRIORITY.find((candidate) => (counts[candidate] ?? 0) > 0);
  return status ? `${counts[status]} ${supportStatusLabel(status)}` : undefined;
};
