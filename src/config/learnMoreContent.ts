import type { Ionicons } from "@expo/vector-icons";

export type LearnMoreTone = "blue" | "green" | "orange";

export type LearnMoreFeature = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  tone: LearnMoreTone;
  services?: string[];
};

export type LearnMoreStep = {
  key: string;
  title: string;
  description: string;
};

export const LEARN_MORE_INTRO = {
  eyebrow: "MaslogCare",
  titleLead: "Barangay health visits,",
  titleAccent: "booked from your phone",
  description:
    "MaslogCare is the appointment app of the Barangay Maslog health office. Residents pick an open date and time in the mobile app, and each booking is confirmed right away.",
  imageCaption: "Barangay 61 Maslog, Legazpi City",
};

export const LEARN_MORE_FEATURES: LearnMoreFeature[] = [
  {
    key: "book",
    icon: "calendar-outline",
    title: "Book a visit",
    description:
      "Choose a service, then pick an open date and time. Your appointment is confirmed right away.",
    tone: "blue",
  },
  {
    key: "services",
    icon: "medkit-outline",
    title: "Barangay health services",
    description: "The services you can book in the app:",
    tone: "green",
    services: [
      "General checkup",
      "Consultation",
      "Blood pressure checking",
      "Immunization",
      "Prenatal care",
    ],
  },
  {
    key: "updates",
    icon: "notifications-outline",
    title: "Schedule updates",
    description:
      "Your confirmed date and time, any changes, and barangay health announcements appear in the app.",
    tone: "orange",
  },
];

export const LEARN_MORE_STEPS: LearnMoreStep[] = [
  {
    key: "account",
    title: "Create an account",
    description: "Register, then wait for the health office to approve your account.",
  },
  {
    key: "service",
    title: "Book a visit",
    description: "Choose a service, then an open date and time.",
  },
  {
    key: "schedule",
    title: "Get confirmed",
    description: "Your appointment is confirmed as soon as you book it.",
  },
  {
    key: "confirmed",
    title: "Visit on your date",
    description: "You get the date and time in the app and by email.",
  },
];

export const LEARN_MORE_FOOTER = {
  brand: "MaslogCare",
  tagline: "Serbisyong Mas Malapit, Mas Maaasahan.",
  location: "Barangay 61 Maslog, Legazpi City",
};
