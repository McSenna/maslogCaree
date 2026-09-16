import type { ProfileFieldKey } from "../config/profileRoleConfig";
import type { ProfileInfoGroup } from "../types/profile.types";
import type { ProfileData, ProfileField } from "./profileData";

type GroupDefinition = {
  key: string;
  title: string;
  icon: ProfileInfoGroup["icon"];
  keys: ProfileFieldKey[];
};

const GROUP_DEFINITIONS: GroupDefinition[] = [
  {
    key: "personal",
    title: "Personal Information",
    icon: "user",
    keys: ["fullName", "dateOfBirth", "gender"],
  },
  {
    key: "contact",
    title: "Contact Information",
    icon: "phone",
    keys: ["phone", "email", "address"],
  },
  {
    key: "account",
    title: "Account Information",
    icon: "shield",
    keys: [
      "userId",
      "accountStatus",
      "dateJoined",
      "specialization",
      "facility",
      "assignedArea",
    ],
  },
];

const toGroupItem = (field: ProfileField): ProfileInfoGroup["items"][number] => ({
  key: field.key,
  label: field.label,
  value: field.value,
  icon: field.icon,
  provided: field.provided,
});

const withAge = (
  items: ProfileInfoGroup["items"],
  age: number | null
): ProfileInfoGroup["items"] => {
  if (age === null) return items;

  const birthIndex = items.findIndex((item) => item.key === "dateOfBirth");
  if (birthIndex === -1) return items;

  const ageItem = {
    key: "age",
    label: "Age",
    value: `${age} years old`,
    icon: "gift" as const,
    provided: true,
  };

  return [...items.slice(0, birthIndex + 1), ageItem, ...items.slice(birthIndex + 1)];
};

export const buildProfileGroups = (profile: ProfileData): ProfileInfoGroup[] => {
  const byKey = new Map(profile.fields.map((field) => [field.key, field]));

  return GROUP_DEFINITIONS.map(({ key, title, icon, keys }) => {
    const items = keys
      .map((fieldKey) => byKey.get(fieldKey))
      .filter((field): field is ProfileField => Boolean(field))
      .map(toGroupItem);

    return {
      key,
      title,
      icon,
      items: key === "personal" ? withAge(items, profile.age) : items,
    };
  }).filter((group) => group.items.length > 0);
};
