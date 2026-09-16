import type { AppointmentRecord } from "@/services/appointments";

export type PatientFacts = {
  name: string;
  age: string | null;
  sex: string | null;
  contact: string | null;
  email: string | null;
};

export const ageInYears = (dateOfBirth: string | null | undefined): number | null => {
  if (!dateOfBirth) return null;
  const born = new Date(dateOfBirth);
  if (Number.isNaN(born.getTime())) return null;

  const today = new Date();
  let years = today.getFullYear() - born.getFullYear();
  const monthDelta = today.getMonth() - born.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < born.getDate())) years -= 1;

  if (years < 0 || years > 130) return null;
  return years;
};

const SEX_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export const sexLabel = (gender: string | null | undefined): string | null => {
  const key = String(gender ?? "").trim().toLowerCase();
  if (!key) return null;
  return SEX_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
};

export const patientFactsOf = (appointment: AppointmentRecord): PatientFacts => {
  const resident = appointment.resident;
  const years = ageInYears(resident?.dateOfBirth);

  return {
    name: resident?.fullname?.trim() || "Unnamed patient",
    age: years === null ? null : `${years} yr${years === 1 ? "" : "s"}`,
    sex: sexLabel(resident?.gender),
    contact: resident?.phone?.trim() || null,
    email: resident?.email?.trim() || null,
  };
};
