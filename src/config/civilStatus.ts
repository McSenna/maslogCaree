// Mirrors CIVIL_STATUS_OPTIONS in backend/config/residency.js. Values are the
// stored slugs; labels are display only. Import-free so `node --test` can load it.
export const CIVIL_STATUS_CHOICES = [
  { value: "single", label: "Single" },
  { value: "single_live_in", label: "Single - Live In" },
  { value: "single_solo_parent", label: "Single - Solo Parent" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
] as const;

export type CivilStatus = (typeof CIVIL_STATUS_CHOICES)[number]["value"];

/** Blank for a record saved without a status; an unknown legacy value shows as stored. */
export const civilStatusLabel = (value: string | null | undefined) => {
  const stored = (value ?? "").trim().toLowerCase();
  if (!stored) return "";
  const known = CIVIL_STATUS_CHOICES.find((option) => option.value === stored);
  return known ? known.label : `${stored[0].toUpperCase()}${stored.slice(1)}`;
};
