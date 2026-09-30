export const LANDING_CONTENT = {
  eyebrow: "Barangay Maslog Health Office",

  headline: {
    lead: "Request a health visit",
    accent: "from your phone",
  },

  // Matches the backend flow: residents never pick a time; staff assign slots in age-priority order.
  description:
    "Choose a service and describe your concern. The barangay health team schedules each request and sends you the date and time.",

  actions: {
    primary: { label: "Get started", icon: "arrow-forward" as const },
    secondary: { label: "Learn more", icon: "information-circle-outline" as const },
  },
} as const;

// States the law that applies (see legalContent.ts) rather than promising a level of security.
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
    title: "Request a visit",
    description: "Pick a service and describe your concern.",
  },
  {
    key: "priority",
    title: "Seen by priority",
    description: "Infants, children, and seniors are scheduled first.",
  },
  {
    key: "schedule",
    title: "Get your schedule",
    description: "Your date and time arrive in the app and by email.",
  },
];
