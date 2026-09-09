import type { Ionicons } from "@expo/vector-icons";

/** One icon family across the whole dashboard, so the glyphs stay consistent. */
export type IoniconName = keyof typeof Ionicons.glyphMap;

/**
 * The statuses the Appointment schema actually stores. There is no "Approved"
 * or "Completed" in the database — a finished visit is a confirmed one whose
 * slot has passed, which the UI derives rather than reads.
 */
export type AppointmentStatus = "pending" | "confirmed" | "rescheduled" | "declined";

/** The semantic families the pastel icon containers are drawn from. */
export type AccentTone = "blue" | "green" | "purple" | "orange" | "pink";

export interface StatItem {
  id: string;
  label: string;
  /** The shorter label the phone's 2-column grid uses. */
  shortLabel: string;
  value: number;
  caption: string;
  icon: IoniconName;
  tone: AccentTone;
}

export interface QuickAction {
  id: string;
  label: string;
  /** The shorter label the phone's grid uses. */
  shortLabel: string;
  icon: IoniconName;
  tone: AccentTone;
  href: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  /** Optional second line — "Barangay Maslog" in the design. */
  detail?: string;
  icon: IoniconName;
  tone: AccentTone;
}

export interface HealthService {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
  tone: AccentTone;
}

export interface HealthTip {
  headline: string;
  ctaLabel: string;
}
