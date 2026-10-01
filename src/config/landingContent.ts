export const LANDING_CONTENT = {
  eyebrow: "Barangay Maslog Health Office",

  headline: {
    lead: "Book a health visit",
    accent: "from your phone",
  },

  // Matches the backend flow: residents pick an open mission slot and the booking is confirmed on save.
  description:
    "Choose a service, then pick an open date and time. Your appointment is confirmed right away.",

  actions: {
    primary: { label: "Get started", icon: "arrow-forward" as const },
    secondary: { label: "Learn more", icon: "information-circle-outline" as const },
  },
} as const;

// States the law that applies (see src/features/legal/content) rather than promising a level of security.
// The non-breaking space keeps "RA 10173" together when the line wraps.
export const SECURITY_NOTICE = "Health data is covered by the Data Privacy Act (RA\u00A010173).";

export type LandingFeatureCopy = {
  key: "request" | "priority" | "schedule";
  title: string;
  description: string;
};

// Shared by the native landing and the web login page so both say the same thing.
export const LANDING_FEATURE_COPY: readonly LandingFeatureCopy[] = [
  {
    key: "request",
    title: "Book a visit",
    description: "Pick a service and an open date and time.",
  },
  {
    key: "priority",
    title: "Confirmed right away",
    description: "Your appointment is confirmed as soon as you book it.",
  },
  {
    key: "schedule",
    title: "Keep the details",
    description: "Your date and time are saved in the app and sent by email.",
  },
];
