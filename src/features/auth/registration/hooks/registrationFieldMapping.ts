import { STEP_FIELDS, type RegistrationField } from "../registrationValidation";
import type { StepKey } from "../registrationOptions";

export const SERVER_FIELD_ALIASES: Record<string, RegistrationField> = {
  "address.cityMunicipality": "cityMunicipality",
  "address.province": "province",
  address: "houseNumberOrPurok",
  gender: "sex",
  phone: "contactNumber",
};

export const stepOwning = (field: RegistrationField): StepKey =>
  (Object.keys(STEP_FIELDS) as StepKey[]).find((step) =>
    STEP_FIELDS[step].includes(field)
  ) ?? "personal";
