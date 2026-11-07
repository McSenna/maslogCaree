export const LANDING_CONTENT = {
  eyebrow: "Barangay Maslog Health Office",

  headline: {
    lead: "Book a health visit",
    accent: "from your phone",
  },

  // Matches the backend flow (2026-11-07): BP checking and prenatal are booked at a chosen time;
  // general checkups and consultations are queued and placed on a doctor's mission.
  description:
    "Pick your own time for BP checks and prenatal visits. Checkups and consultations join the doctor's queue, and you get a time when one opens.",

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
    description: "Pick a service and tell us what you need.",
  },
  {
    key: "priority",
    title: "Fair order for doctor visits",
    description: "Doctor requests are scheduled by age group, infants and seniors first.",
  },
  {
    key: "schedule",
    title: "Keep the details",
    description: "Your date and time are saved in the app and sent by email.",
  },
];
