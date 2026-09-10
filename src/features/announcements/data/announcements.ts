import type { Feather } from "@expo/vector-icons";

/** One community health event. */
export type Announcement = {
  title: string;
  date: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  /** The accent this event is drawn in. */
  color: string;
  /** The soft fill behind its icon and tag. */
  bg: string;
  tag: string;
};

/**
 * The published health announcements.
 *
 * Static for now — there is no announcements endpoint yet, and the barangay
 * publishes these on a fixed schedule. Kept as data rather than markup so the
 * page needs no change when it moves behind an API.
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    title: "Free Medical Checkup",
    date: "March 20, 2026",
    description:
      "Barangay Maslog Health Center will conduct a free medical checkup for all residents.",
    icon: "activity",
    color: "#10B981",
    bg: "#ECFDF5",
    tag: "Medical",
  },
  {
    title: "Vaccination Program",
    date: "March 25, 2026",
    description: "Free vaccination for children ages 0–5 at the Barangay Health Center.",
    icon: "shield",
    color: "#2D5BFF",
    bg: "#EFF6FF",
    tag: "Vaccination",
  },
  {
    title: "Nutrition Awareness Seminar",
    date: "April 2, 2026",
    description: "Join our seminar about proper nutrition and healthy lifestyle habits.",
    icon: "book-open",
    color: "#F59E0B",
    bg: "#FFFBEB",
    tag: "Seminar",
  },
  {
    title: "Community Health Day",
    date: "April 10, 2026",
    description: "Free blood pressure and diabetes screening for all residents.",
    icon: "heart",
    color: "#EF4444",
    bg: "#FFF1F2",
    tag: "Screening",
  },
];
