import type { MasterlistRow } from "./types";
import { mayWriteMedicalRecords } from "./recordWriteAccess.ts";

type Viewer = { id: string | number; role: string } | null;

// Rows are already service-scoped by the server. The API repeats these checks.
export const mayDeleteRecord = (row: MasterlistRow, user: Viewer): boolean => {
  if (!user || !mayWriteMedicalRecords(user)) return false;
  if (row.serviceType === "immunization" && user.role !== "midwife") return false;
  if (row.baby) return user.role === "midwife";
  const owner = row.source === "appointment" ? row.providerId : row.createdById;
  return Boolean(owner) && owner === String(user.id);
};
