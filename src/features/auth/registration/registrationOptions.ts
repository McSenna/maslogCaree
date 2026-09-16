import { RESIDENCY } from "@/config/residency";

export const REGISTRATION_STEPS = [
  { key: "personal", label: "Personal", title: "Personal Information" },
  { key: "identity", label: "ID Verify", title: "Identity Verification" },
  { key: "address", label: "Address", title: "Address Information" },
  { key: "account", label: "Account", title: "Account Information" },
  { key: "review", label: "Review", title: "Review & Confirm" },
] as const;

export type StepKey = (typeof REGISTRATION_STEPS)[number]["key"];

export const STEP_SUBTITLES: Record<StepKey, string> = {
  personal: "Tell us who you are, so the health centre can find your record.",
  identity: "Provide a valid government ID for Barangay Administrator verification.",
  address: "Where you live in the barangay, for home visits and outreach.",
  account: "Choose a password to secure your MaslogCare account.",
  review: "Check your details before we submit your registration.",
};

export const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export const CIVIL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
] as const;

export const DEFAULT_ID_TYPES = [
  { value: "philsys", label: "PhilSys National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "tin_id", label: "TIN ID" },
  { value: "passport", label: "Passport" },
  { value: "umid", label: "UMID" },
  { value: "postal_id", label: "Postal ID" },
  { value: "voters_id", label: "Voter-related identification document" },
  { value: "senior_citizen_id", label: "Senior Citizen ID" },
  { value: "pwd_id", label: "PWD ID" },
  { value: "school_id", label: "School ID" },
  { value: "employee_id", label: "Employee ID" },
  { value: "other_gov_id", label: "Other Government-Issued ID" },
] as const;

export const EMPTY_REGISTRATION = {
  firstName: "",
  middleName: "",
  surname: "",
  suffix: "",
  dateOfBirth: "",
  sex: "",
  civilStatus: "",
  contactNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  houseNumberOrPurok: "",
  street: "",
  barangay: RESIDENCY.barangay,
  cityMunicipality: RESIDENCY.cityMunicipality,
  province: RESIDENCY.province,
  idType: "",
  idNumber: "",
  idDocument: "",
  idFileName: "",
  idMimeType: "",
  idFileSize: "",
};

export const labelForOption = (
  options: readonly { value: string; label: string }[],
  value: string
) => options.find((option) => option.value === value)?.label ?? "";
