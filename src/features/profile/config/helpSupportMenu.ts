import type { Feather } from "@expo/vector-icons";

export type HelpSupportMenuKey =
  | "helpCenter"
  | "contactSupport"
  | "supportRequests"
  | "privacySecurity";

export type HelpSupportMenuEntry = {
  key: HelpSupportMenuKey;
  label: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
};

export const HELP_SUPPORT_MENU: readonly HelpSupportMenuEntry[] = [
  {
    key: "helpCenter",
    label: "Help Center",
    description: "Find answers and learn how to use MaslogCare.",
    icon: "help-circle",
  },
  {
    key: "contactSupport",
    label: "Contact Support",
    description: "Send a concern or request assistance from the support team.",
    icon: "headphones",
  },
  {
    key: "supportRequests",
    label: "My Support Requests",
    description: "View and track your submitted support tickets.",
    icon: "inbox",
  },
  {
    key: "privacySecurity",
    label: "Privacy & Security",
    description: "Learn how MaslogCare protects your personal and health information.",
    icon: "shield",
  },
];
