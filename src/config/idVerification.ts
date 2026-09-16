export interface IdTypeConfig {
  id: string;
  label: string;
}

export const SUPPORTED_ID_TYPES: readonly IdTypeConfig[] = [
  { id: "philsys", label: "PhilSys National ID" },
  { id: "drivers_license", label: "Driver's License" },
  { id: "tin_id", label: "TIN ID" },
  { id: "passport", label: "Passport" },
  { id: "umid", label: "UMID" },
  { id: "postal_id", label: "Postal ID" },
  { id: "voters_id", label: "Voter-related identification document" },
  { id: "senior_citizen_id", label: "Senior Citizen ID" },
  { id: "pwd_id", label: "PWD ID" },
  { id: "school_id", label: "School ID" },
  { id: "employee_id", label: "Employee ID" },
  { id: "other_gov_id", label: "Other Government-Issued ID" },
] as const;

export const REJECTION_REASONS: readonly string[] = [
  "Information does not match the ID",
  "Invalid ID",
  "ID image is unreadable",
  "Incomplete registration information",
  "Duplicate account",
  "Resident verification failed",
  "Other",
] as const;

export const maskIdNumber = (idNumber: string): string => {
  if (!idNumber) return "";
  const cleaned = String(idNumber).trim();
  if (cleaned.length <= 4) return cleaned;
  const visible = cleaned.slice(-4);
  const maskedCount = Math.min(12, cleaned.length - 4);
  const mask = "*".repeat(maskedCount);
  return `${mask} ${visible}`;
};
