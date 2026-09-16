import type { UserRole } from "@/data/mockUsers";
import type { ProfileIconName, ProfileTabKey } from "../types/profile.types";

export type ProfileTabDefinition = {
  key: ProfileTabKey;
  label: string;
  shortLabel: string;
  icon: ProfileIconName;
};

export const PROFILE_TAB_DEFINITIONS: Record<ProfileTabKey, ProfileTabDefinition> = {
  overview: { key: "overview", label: "Overview", shortLabel: "Overview", icon: "user" },
  appointments: {
    key: "appointments",
    label: "Appointments",
    shortLabel: "Visits",
    icon: "calendar",
  },
  records: {
    key: "records",
    label: "Medical Records",
    shortLabel: "Records",
    icon: "file-text",
  },
  activity: { key: "activity", label: "Activity", shortLabel: "Activity", icon: "activity" },
};

const RESIDENT_TABS: ProfileTabKey[] = ["overview", "appointments", "records", "activity"];

const STAFF_TABS: ProfileTabKey[] = ["overview", "appointments", "activity"];

export const isResidentRole = (role?: string | null): boolean =>
  String(role ?? "").toLowerCase() === "resident";

export const getProfileTabsForRole = (role?: UserRole | null): ProfileTabDefinition[] => {
  const keys = isResidentRole(role) ? RESIDENT_TABS : STAFF_TABS;
  return keys.map((key) => PROFILE_TAB_DEFINITIONS[key]);
};
