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
  titleAccent: "requested from your phone",
  description:
    "MaslogCare is the appointment app of the Barangay Maslog health office. Residents send a request from the mobile app, and health staff set the date and time of each visit.",
  imageCaption: "Barangay 61 Maslog, Legazpi City",
};

export const LEARN_MORE_FEATURES: LearnMoreFeature[] = [
  {
    key: "book",
    icon: "calendar-outline",
    title: "Request a visit",
    description:
      "Choose a service and describe your concern. You do not pick a time. The health team assigns one.",
    tone: "blue",
  },
  {
    key: "services",
    icon: "medkit-outline",
    title: "Barangay health services",
    description: "The services you can request in the app:",
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
    title: "Send a request",
    description: "Choose a service and describe your concern.",
  },
  {
    key: "schedule",
    title: "Wait for your slot",
    description: "Infants, children, and seniors are scheduled first.",
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
