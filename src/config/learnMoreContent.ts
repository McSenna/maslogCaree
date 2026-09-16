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
  titleLead: "Better Access to",
  titleAccent: "Barangay Healthcare",
  description:
    "MaslogCare helps Barangay Maslog residents access local healthcare services more conveniently through a centralized appointment and healthcare scheduling experience.",
  imageCaption: "Healthy Residents. Stronger Community.",
};

export const LEARN_MORE_FEATURES: LearnMoreFeature[] = [
  {
    key: "book",
    icon: "calendar-outline",
    title: "Book Appointments",
    description:
      "Schedule available healthcare services quickly without manually coordinating every visit.",
    tone: "blue",
  },
  {
    key: "services",
    icon: "medkit-outline",
    title: "Access Health Services",
    description: "Connect with available barangay healthcare services.",
    tone: "green",
    services: [
      "General Checkup",
      "Consultation",
      "Blood Pressure Checking",
      "Immunization",
      "Prenatal Care",
    ],
  },
  {
    key: "updates",
    icon: "notifications-outline",
    title: "Stay Updated",
    description:
      "Receive important appointment updates, schedules, announcements, and reminders.",
    tone: "orange",
  },
];

export const LEARN_MORE_STEPS: LearnMoreStep[] = [
  {
    key: "account",
    title: "Create Account",
    description: "Register and verify your resident account.",
  },
  {
    key: "service",
    title: "Choose a Service",
    description: "Select an available healthcare service.",
  },
  {
    key: "schedule",
    title: "Pick a Schedule",
    description: "Choose an available date and time.",
  },
  {
    key: "confirmed",
    title: "Get Confirmed",
    description: "Receive confirmation and visit on your scheduled date.",
  },
];

export const LEARN_MORE_FOOTER = {
  brand: "MaslogCare",
  tagline: "Serbisyong Mas Malapit, Mas Maaasahan.",
  location: "Barangay Maslog, Legazpi City",
};
