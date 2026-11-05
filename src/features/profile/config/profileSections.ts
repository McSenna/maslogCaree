import type { Feather } from "@expo/vector-icons";

import type { ProfileActionKey } from "./profileActions.ts";
import type { ProfileFieldKey } from "./profileFields.ts";

type IconName = keyof typeof Feather.glyphMap;

export type ProfileSectionId =
  | "personal"
  | "contact"
  | "work"
  | "household"
  | "account"
  | "help"
  | "legal"
  | "about";

type SectionBase = {
  id: ProfileSectionId;
  title: string;
  icon: IconName;
  column: "left" | "right";
  /** "row" is one link standing alone on every layout, like About. */
  presentation: "section" | "row";
  mobileExpanded: boolean;
};

export type ProfileSectionDefinition = SectionBase &
  ({ kind: "fields"; fields: ProfileFieldKey[] } | { kind: "actions"; actions: ProfileActionKey[] });

const DETAILS = {
  column: "left",
  presentation: "section",
  kind: "fields",
} as const;

const LINKS = {
  column: "right",
  presentation: "section",
  mobileExpanded: false,
  kind: "actions",
} as const;

const PERSONAL: ProfileSectionDefinition = {
  ...DETAILS,
  id: "personal",
  title: "Personal information",
  icon: "user",
  mobileExpanded: true,
  // Paired for the two-column grid: name with gender, birth date with age, then the long address.
  fields: ["fullName", "gender", "dateOfBirth", "age", "address"],
};

const CONTACT: ProfileSectionDefinition = {
  ...DETAILS,
  id: "contact",
  title: "Contact information",
  icon: "phone",
  mobileExpanded: true,
  fields: ["email", "phone"],
};

const WORK: ProfileSectionDefinition = {
  ...DETAILS,
  id: "work",
  title: "Work information",
  icon: "briefcase",
  mobileExpanded: false,
  fields: ["role", "dateJoined", "accountStatus"],
};

const HOUSEHOLD: ProfileSectionDefinition = {
  ...DETAILS,
  id: "household",
  title: "Household information",
  icon: "home",
  mobileExpanded: false,
  fields: ["houseOrPurok", "civilStatus"],
};

const ACCOUNT: ProfileSectionDefinition = {
  ...LINKS,
  id: "account",
  title: "Account settings",
  icon: "lock",
  actions: ["changePassword", "notificationSettings"],
};

const HELP: ProfileSectionDefinition = {
  ...LINKS,
  id: "help",
  title: "Help & support",
  icon: "help-circle",
  actions: ["helpCenter", "contactSupport", "supportRequests"],
};

const LEGAL: ProfileSectionDefinition = {
  ...LINKS,
  id: "legal",
  title: "Legal",
  icon: "shield",
  actions: ["privacySecurity", "privacyPolicy", "termsOfService"],
};

const ABOUT: ProfileSectionDefinition = {
  ...LINKS,
  id: "about",
  title: "About MaslogCare",
  icon: "info",
  presentation: "row",
  actions: ["about"],
};

export const STAFF_SECTIONS: ProfileSectionDefinition[] = [
  PERSONAL,
  CONTACT,
  WORK,
  ACCOUNT,
  HELP,
  LEGAL,
  ABOUT,
];

export const RESIDENT_SECTIONS: ProfileSectionDefinition[] = [
  PERSONAL,
  CONTACT,
  HOUSEHOLD,
  ACCOUNT,
  HELP,
  LEGAL,
  ABOUT,
];
