import type { Feather } from "@expo/vector-icons";
import { LIGHT_NOTIFICATION_PALETTE, type NotificationPalette } from "./notification.theme";
import type {
  NotificationCategory,
  NotificationItem,
  NotificationTone,
} from "./notification.types";

type FeatherIcon = keyof typeof Feather.glyphMap;

export type NotificationVisual = {
  category: NotificationCategory;
  icon: FeatherIcon;
  color: string;
  soft: string;
};

type ToneKey = "success" | "warning" | "info" | "danger" | "teal";

const TONE_ICON: Record<NotificationTone, FeatherIcon> = {
  success: "check-circle",
  warning: "alert-triangle",
  info: "bell",
};

const paint = (palette: NotificationPalette, key: ToneKey) => ({
  color: palette[key === "info" ? "primary" : key],
  soft: palette[key === "info" ? "primarySoft" : (`${key}Soft` as const)],
});

type VisualSpec = { category: NotificationCategory; icon: FeatherIcon; tone: ToneKey };

const EXACT_VISUAL: Record<string, VisualSpec> = {
  appointment_confirmed: { category: "appointment", icon: "check-circle", tone: "success" },
  appointment_declined: { category: "appointment", icon: "x-circle", tone: "danger" },
  appointment_cancelled: { category: "appointment", icon: "x-circle", tone: "danger" },
  appointment_rescheduled: { category: "appointment", icon: "clock", tone: "warning" },
  appointment_reminder: { category: "appointment", icon: "calendar", tone: "info" },
  appointment_completed: { category: "medical", icon: "activity", tone: "teal" },
  resident_verification: { category: "account", icon: "user-plus", tone: "info" },
  resident_approved: { category: "account", icon: "user-check", tone: "success" },
  resident_rejected: { category: "account", icon: "user-x", tone: "danger" },
  medical_record_available: { category: "medical", icon: "file-text", tone: "teal" },
  medical_record_updated: { category: "medical", icon: "file-text", tone: "teal" },
};

const PREFIX_CATEGORY: readonly [string, NotificationCategory, FeatherIcon][] = [
  ["appointment", "appointment", "calendar"],
  ["resident", "account", "user"],
  ["account", "account", "user"],
  ["inventory", "inventory", "package"],
  ["medical", "medical", "activity"],
  ["record", "medical", "file-text"],
  ["announcement", "announcement", "volume-2"],
  ["security", "account", "shield"],
];

/**
 * Safely formats dense backend notification messages (like appointment details)
 * into natural, easy-to-read sentences without altering the raw database value.
 */
export const formatNotificationMessage = (body?: string | null): string => {
  if (!body) return "";

  const currentYear = new Date().getFullYear().toString();

  const confirmedMatch = body.match(
    /^Your\s+(.+?)\s+appointment is confirmed\.\s*Date:\s*(?:[A-Za-z]+,\s*)?([A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?)\.\s*Time:\s*([^.]+)\.\s*(?:Doctor:\s*([^.]+)\.?)?$/i
  );
  if (confirmedMatch) {
    const [, service, date, time, doctor] = confirmedMatch;
    const cleanDate = date.trim().replace(new RegExp(`,\\s*${currentYear}$`), "");
    const cleanTime = time.trim();
    const cleanDoctor = doctor?.trim();
    return cleanDoctor
      ? `Your ${service} appointment is confirmed for ${cleanDate} at ${cleanTime} with ${cleanDoctor}.`
      : `Your ${service} appointment is confirmed for ${cleanDate} at ${cleanTime}.`;
  }

  const reschedMatch = body.match(
    /^Your\s+(.+?)\s+appointment is rescheduled\.\s*Date:\s*(?:[A-Za-z]+,\s*)?([A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?)\.\s*Time:\s*([^.]+)\.\s*(?:Doctor:\s*([^.]+)\.?)?$/i
  );
  if (reschedMatch) {
    const [, service, date, time, doctor] = reschedMatch;
    const cleanDate = date.trim().replace(new RegExp(`,\\s*${currentYear}$`), "");
    const cleanTime = time.trim();
    const cleanDoctor = doctor?.trim();
    return cleanDoctor
      ? `Your ${service} appointment has been rescheduled for ${cleanDate} at ${cleanTime} with ${cleanDoctor}.`
      : `Your ${service} appointment has been rescheduled for ${cleanDate} at ${cleanTime}.`;
  }

  return body;
};

export const resolveNotificationVisual = (
  item: NotificationItem,
  palette: NotificationPalette = LIGHT_NOTIFICATION_PALETTE
): NotificationVisual => {
  const type = item.type ?? "system";
  const tone: NotificationTone = item.tone ?? "info";

  const exact = EXACT_VISUAL[type];
  if (exact) return { category: exact.category, icon: exact.icon, ...paint(palette, exact.tone) };

  // Fallback to title inspection if type is generic or missing
  const titleLower = (item.title || "").toLowerCase();
  if (titleLower.includes("confirmed")) {
    return { category: "appointment", icon: "check-circle", ...paint(palette, "success") };
  }
  if (titleLower.includes("completed")) {
    return { category: "medical", icon: "activity", ...paint(palette, "teal") };
  }
  if (titleLower.includes("cancelled") || titleLower.includes("declined")) {
    return { category: "appointment", icon: "x-circle", ...paint(palette, "danger") };
  }
  if (titleLower.includes("rescheduled")) {
    return { category: "appointment", icon: "clock", ...paint(palette, "warning") };
  }
  if (titleLower.includes("record")) {
    return { category: "medical", icon: "file-text", ...paint(palette, "teal") };
  }
  if (titleLower.includes("announcement")) {
    return { category: "announcement", icon: "volume-2", ...paint(palette, "info") };
  }

  const match = PREFIX_CATEGORY.find(([prefix]) => type.startsWith(prefix));
  const toneKey: ToneKey = tone;

  if (!match) {
    return { category: "system", icon: TONE_ICON[tone] ?? "bell", ...paint(palette, toneKey) };
  }

  const [, category, icon] = match;
  return {
    category,
    icon: tone === "info" ? icon : (TONE_ICON[tone] ?? icon),
    ...paint(palette, toneKey),
  };
};

export { formatNotificationTime, groupNotifications } from "./notificationTime";
