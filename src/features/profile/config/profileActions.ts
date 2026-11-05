import type { Feather } from "@expo/vector-icons";

import { LEGAL_CATALOG } from "../../legal/constants/legalCatalog.ts";

export type ProfileActionKey =
  | "changePassword"
  | "notificationSettings"
  | "helpCenter"
  | "contactSupport"
  | "supportRequests"
  | "privacySecurity"
  | "privacyPolicy"
  | "termsOfService"
  | "about";

type ProfileActionDefinition = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  hint?: string;
};

export const PROFILE_ACTIONS: Record<ProfileActionKey, ProfileActionDefinition> = {
  changePassword: { label: "Change password", icon: "lock" },
  notificationSettings: { label: "Notification settings", icon: "bell" },
  helpCenter: {
    label: "Help center",
    icon: "help-circle",
    hint: "Find answers and learn how to use MaslogCare.",
  },
  contactSupport: {
    label: "Contact support",
    icon: "headphones",
    hint: "Send a concern or request assistance from the support team.",
  },
  supportRequests: {
    label: "My support requests",
    icon: "inbox",
    hint: "View and track your submitted support tickets.",
  },
  privacySecurity: {
    label: "Privacy and security",
    icon: "shield",
    hint: "Learn how MaslogCare protects your personal and health information.",
  },
  privacyPolicy: {
    label: LEGAL_CATALOG.privacy.title,
    icon: "lock",
    hint: LEGAL_CATALOG.privacy.description,
  },
  termsOfService: {
    label: LEGAL_CATALOG.terms.title,
    icon: "file-text",
    hint: LEGAL_CATALOG.terms.description,
  },
  about: { label: "About MaslogCare", icon: "info" },
};
