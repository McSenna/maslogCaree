import type { Feather } from "@expo/vector-icons";
import { PALETTE } from "@/theme/palette";

export type Announcement = {
  title: string;
  date: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  tag: string;
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    title: "Free Medical Checkup",
    date: "March 20, 2026",
    description:
      "Barangay Maslog Health Center will conduct a free medical checkup for all residents.",
    icon: "activity",
    color: PALETTE.success[500],
    bg: PALETTE.success[50],
    tag: "Medical",
  },
  {
    title: "Vaccination Program",
    date: "March 25, 2026",
    description: "Free vaccination for children ages 0–5 at the Barangay Health Center.",
    icon: "shield",
    color: PALETTE.blue[600],
    bg: PALETTE.blue[50],
    tag: "Vaccination",
  },
  {
    title: "Nutrition Awareness Seminar",
    date: "April 2, 2026",
    description: "Join our seminar about proper nutrition and healthy lifestyle habits.",
    icon: "book-open",
    color: PALETTE.amber[500],
    bg: PALETTE.amber[50],
    tag: "Seminar",
  },
  {
    title: "Community Health Day",
    date: "April 10, 2026",
    description: "Free blood pressure and diabetes screening for all residents.",
    icon: "heart",
    color: PALETTE.red[500],
    bg: PALETTE.red[50],
    tag: "Screening",
  },
];
