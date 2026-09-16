import type { MedicalRecord } from "@/services/medicalRecords";
import { monthsAgo, type DateRangeKey } from "./recordFilterOptions";
import { providerNameOf, providerRoleLabelOf, serviceLabelOf } from "./recordLabels";

export const patientIdOf = (residentId: string | undefined): string => {
  const id = String(residentId ?? "").trim();
  if (!id) return "—";
  return `RES-${id.slice(-8).toUpperCase()}`;
};

export const ageFrom = (dateOfBirth: string | null | undefined): number | null => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) age -= 1;

  return age >= 0 && age < 130 ? age : null;
};

export const formatSex = (gender: string | null | undefined): string => {
  const key = String(gender ?? "").trim().toLowerCase();
  if (!key) return "";
  return key.charAt(0).toUpperCase() + key.slice(1);
};

export const filterRecords = (
  records: MedicalRecord[],
  options: { query: string; service: string; range: DateRangeKey }
): MedicalRecord[] => {
  const needle = options.query.trim().toLowerCase();
  const floor = options.range === "6m" ? monthsAgo(6) : options.range === "12m" ? monthsAgo(12) : null;

  return records.filter((record) => {
    if (options.service !== "all" && record.serviceType !== options.service) return false;

    if (floor !== null) {
      const at = new Date(record.completedAt).getTime();
      if (Number.isNaN(at) || at < floor) return false;
    }

    if (!needle) return true;

    const haystack = [
      serviceLabelOf(record),
      providerNameOf(record),
      providerRoleLabelOf(record),
      record.completedAt
        ? new Date(record.completedAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
};
