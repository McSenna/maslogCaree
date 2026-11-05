import { PROFILE_ACTIONS, type ProfileActionKey } from "../config/profileActions.ts";
import {
  PROFILE_FIELDS,
  type ProfileFieldKey,
  type ProfileFieldValues,
} from "../config/profileFields.ts";
import type { ProfileSectionDefinition } from "../config/profileSections.ts";
import { NOT_PROVIDED } from "./profileHelpers.ts";

const NOT_LOADED = "Not available yet";

export type ProfileFieldRow = {
  kind: "field";
  key: ProfileFieldKey;
  label: string;
  icon: (typeof PROFILE_FIELDS)[ProfileFieldKey]["icon"];
  value: string;
  provided: boolean;
  fullWidth: boolean;
};

export type ProfileActionRow = { kind: "action"; key: ProfileActionKey; value?: undefined } & (typeof PROFILE_ACTIONS)[ProfileActionKey];

export type ProfileSectionRow = ProfileFieldRow | ProfileActionRow;

export type ProfileSection = Omit<ProfileSectionDefinition, "kind"> & {
  kind: ProfileSectionDefinition["kind"];
  rows: ProfileSectionRow[];
};

const toFieldRow = (key: ProfileFieldKey, values: ProfileFieldValues): ProfileFieldRow => {
  const value = values[key];
  const { label, icon, fullWidth = false } = PROFILE_FIELDS[key];
  const base = { kind: "field", key, label, icon, fullWidth } as const;
  if (value === undefined) return { ...base, value: NOT_LOADED, provided: false };
  if (value === null) return { ...base, value: NOT_PROVIDED, provided: false };
  return { ...base, value, provided: true };
};

/** The one place that decides what a profile shows and in what order. */
export const buildProfileSections = (
  sections: ProfileSectionDefinition[],
  values: ProfileFieldValues
): ProfileSection[] => {
  return sections.flatMap((section) => {
    const rows: ProfileSectionRow[] =
      section.kind === "fields"
        ? section.fields.map((key) => toFieldRow(key, values))
        : section.actions.map((key) => ({ kind: "action", key, ...PROFILE_ACTIONS[key] }));

    return rows.length === 0 ? [] : [{ ...section, rows }];
  });
};
