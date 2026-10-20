import type {
  MasterFormErrors,
  MasterFormField,
} from "./masterResidentForm.ts";

// Field order matches the visual and keyboard reading order of the form.
export const MASTER_FIELD_LABELS: Partial<Record<MasterFormField, string>> = {
  firstName: "First Name",
  middleName: "Middle Name",
  lastName: "Last Name",
  suffix: "Suffix",
  dateOfBirth: "Date of Birth",
  sex: "Sex",
  civilStatus: "Civil Status",
  role: "Role",
  address: "Purok",
  barangay: "Barangay",
};

export const orderedMasterErrors = (errors: MasterFormErrors) =>
  (Object.keys(MASTER_FIELD_LABELS) as MasterFormField[]).flatMap((field) =>
    errors[field]
      ? [{ field, label: MASTER_FIELD_LABELS[field], message: errors[field]! }]
      : [],
  );
