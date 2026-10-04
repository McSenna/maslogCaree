// Steps of the add/edit master list record dialog, mirroring the registration
// wizard. Import-free so `node --test` can load it.
import type { MasterFormErrors, MasterFormField } from "./masterResidentForm.ts";

export const MASTER_STEPS = [
  {
    key: "name",
    label: "Name",
    title: "Resident name",
    subtitle: "Copy the name exactly as it appears in the barangay registry.",
  },
  {
    key: "details",
    label: "Details",
    title: "Personal details",
    subtitle: "Birth date, sex and civil status from the official record.",
  },
  {
    key: "address",
    label: "Address",
    title: "Address and record ID",
    subtitle: "Where the resident lives in the barangay, and the registry's ID if it has one.",
  },
  {
    key: "review",
    label: "Review",
    title: "Review the record",
    subtitle: "Check every detail before saving. Saving never creates or changes an app account.",
  },
] as const;

export type MasterStepKey = (typeof MASTER_STEPS)[number]["key"];

export const MASTER_STEP_FIELDS: Record<MasterStepKey, MasterFormField[]> = {
  name: ["firstName", "middleName", "lastName", "suffix"],
  details: ["dateOfBirth", "sex", "civilStatus"],
  address: ["barangay", "address", "masterResidentId"],
  review: [],
};

export const errorsForStep = (key: MasterStepKey, errors: MasterFormErrors): MasterFormErrors =>
  Object.fromEntries(
    Object.entries(errors).filter(([field]) => MASTER_STEP_FIELDS[key].includes(field as MasterFormField))
  );

/** The first step holding an error, so a failed save lands where the fix is. */
export const firstStepWithError = (errors: MasterFormErrors): number => {
  const index = MASTER_STEPS.findIndex((step) => Object.keys(errorsForStep(step.key, errors)).length > 0);
  return index;
};
