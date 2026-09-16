import type { MedicalField } from "@/services/medicalRecords";

export const groupFields = (fields: MedicalField[]): { title?: string; fields: MedicalField[] }[] => {
  const groups: { title?: string; fields: MedicalField[] }[] = [];
  const index = new Map<string, number>();

  for (const field of fields) {
    const title = field.group;
    const key = title ?? "";
    const at = index.get(key);
    if (at === undefined) {
      index.set(key, groups.length);
      groups.push({ title, fields: [field] });
    } else {
      groups[at].fields.push(field);
    }
  }

  return groups;
};
