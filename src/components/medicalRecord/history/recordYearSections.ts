// Import-free (types only) so `node --test` can load it.
import type { MedicalRecord } from "@/services/medicalRecordTypes";

export type RecordYearSection = { title: string; data: MedicalRecord[] };

/** Newest first, grouped by the year of care, for the history list's year headings. */
export const groupRecordsByYear = (records: MedicalRecord[]): RecordYearSection[] => {
  const sections: RecordYearSection[] = [];
  for (const record of records) {
    const date = new Date(record.completedAt);
    const title = Number.isNaN(date.getTime()) ? "Date not recorded" : String(date.getFullYear());
    const last = sections[sections.length - 1];
    if (last && last.title === title) last.data.push(record);
    else sections.push({ title, data: [record] });
  }
  return sections;
};
