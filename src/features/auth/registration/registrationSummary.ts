import { formatBirthDate } from "../utils/dateOfBirth";
import {
  CIVIL_STATUS_OPTIONS,
  DEFAULT_ID_TYPES,
  SEX_OPTIONS,
  labelForOption,
} from "./registrationOptions";
import type { RegistrationValues } from "./registrationValidation";

const maskNumber = (num: string): string => {
  if (!num) return "";
  const clean = num.trim();
  if (clean.length <= 4) return clean;
  return `•••• •••• •••• ${clean.slice(-4)}`;
};

export const composeFullName = (values: RegistrationValues) =>
  [values.firstName, values.middleName, values.surname, values.suffix]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

export const composeAddress = (values: RegistrationValues) =>
  [
    values.houseNumberOrPurok,
    values.street,
    values.barangay ? `Barangay ${values.barangay.trim()}` : "",
    values.cityMunicipality,
    values.province,
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

export const summarizeRegistration = (values: RegistrationValues) => {
  const matchedType = DEFAULT_ID_TYPES.find((opt) => opt.value === values.idType);
  const idTypeLabel = matchedType ? matchedType.label : values.idType || "Not specified";
  const idDocumentLabel = values.idDocument
    ? values.idFileName || (values.idMimeType?.includes("pdf") ? "PDF Document" : "Valid ID Image Attached")
    : "No document attached";

  return {
    fullName: composeFullName(values),
    dateOfBirth: formatBirthDate(values.dateOfBirth),
    sex: labelForOption(SEX_OPTIONS, values.sex),
    civilStatus: labelForOption(CIVIL_STATUS_OPTIONS, values.civilStatus) || "Not specified",
    contactNumber: values.contactNumber,
    email: values.email.trim(),
    address: composeAddress(values),
    idType: idTypeLabel,
    maskedIdNumber: maskNumber(values.idNumber),
    idDocumentLabel,
  };
};
