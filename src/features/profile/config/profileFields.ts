import type { Feather } from "@expo/vector-icons";

type IconName = keyof typeof Feather.glyphMap;

export type ProfileFieldKey =
  | "fullName"
  | "dateOfBirth"
  | "age"
  | "gender"
  | "address"
  | "civilStatus"
  | "houseOrPurok"
  | "email"
  | "phone"
  | "role"
  | "dateJoined"
  | "accountStatus";

/** A string shows as is, null reads "Not provided", undefined means not loaded yet. */
export type ProfileFieldValues = Record<ProfileFieldKey, string | null | undefined>;

/** fullWidth gives a long value its own row instead of squeezing it into half of one. */
export const PROFILE_FIELDS: Record<ProfileFieldKey, { label: string; icon: IconName; fullWidth?: boolean }> = {
  fullName: { label: "Full name", icon: "user" },
  dateOfBirth: { label: "Date of birth", icon: "calendar" },
  age: { label: "Age", icon: "gift" },
  gender: { label: "Gender", icon: "users" },
  address: { label: "Address", icon: "map-pin", fullWidth: true },
  civilStatus: { label: "Civil status", icon: "heart" },
  houseOrPurok: { label: "House no. or purok", icon: "home" },
  email: { label: "Email address", icon: "mail", fullWidth: true },
  phone: { label: "Phone number", icon: "phone" },
  role: { label: "Role", icon: "briefcase" },
  dateJoined: { label: "Date joined", icon: "clock" },
  accountStatus: { label: "Account status", icon: "check-circle" },
};
