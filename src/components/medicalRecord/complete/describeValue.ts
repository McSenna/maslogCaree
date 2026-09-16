import type { MedicalField } from "@/services/medicalRecords";

export const describeFieldValue = (field: MedicalField | undefined, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";

  if (field?.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value);
  }

  if (field?.type === "boolean") return value ? "Yes" : "No";

  if (field?.type === "date") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime())
      ? String(value)
      : d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  if (field?.unit) return `${value} ${field.unit}`;

  return String(value);
};

export const hasValue = (value: unknown): boolean => {
  return value !== null && value !== undefined && value !== "" && value !== false;
};
