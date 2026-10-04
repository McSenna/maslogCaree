import type { AppointmentRecord } from "@/services/appointments";

export type MedicalFieldType = "text" | "textarea" | "number" | "date" | "select" | "boolean";

export type MedicalField = {
  key: string;
  label: string;
  type: MedicalFieldType;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  helper?: string;
  options?: { value: string; label: string }[];
  dependsOn?: string;
  group?: string;
  unit?: string;
  inventoryCategory?: string;
  /** Date fields only: "past" (today or earlier) or "after_visit" (the visit day or later). */
  when?: "past" | "after_visit";
};

export type CompletionForm = {
  categoryKey: string;
  label: string;
  common: MedicalField[];
  service: MedicalField[];
  followUp: MedicalField[];
};

export type DispensedItem = {
  item: string;
  itemName: string;
  specification?: string;
  category?: string;
  unit: string;
  quantity: number;
  batchNumbers?: string[];
  expiryDate?: string | null;
  transactions?: string[];
};

export type DispenseInput = {
  inventoryItemId: string;
  quantity: number;
};

export type InventoryMovement = {
  _id: string;
  item: string;
  itemName: string;
  unit: string;
  batchNumber: string;
  quantity: number;
  previousStock: number;
  newStock: number;
};

export type MedicalRecord = {
  _id: string;
  resident?: { _id?: string; fullname?: string; email?: string; dateOfBirth?: string } | string;
  appointment?: (Partial<AppointmentRecord> & { _id: string }) | string;
  provider?: { _id?: string; fullname?: string; role?: string } | string;
  providerRole?: string;
  serviceType: string;
  assessment: string;
  findings?: string;
  diagnosis?: string;
  recommendations?: string;
  notes?: string;
  serviceDetails?: Record<string, string | number | boolean>;
  itemsGiven?: DispensedItem[];
  followUpRequired?: boolean;
  followUpDate?: string | null;
  appointmentDate?: string | null;
  completedAt: string;
  createdAt?: string;
  /** Missing on records from before sources existed; those are appointments. */
  source?: "appointment" | "historical_masterlist" | "walk_in" | "medical_mission" | "manual_entry";
  /** Encoded records: the provider as written on the paper record. */
  providerName?: string;
  visitReason?: string;
};

/** True for records staff encoded from the health center's files rather than a completed appointment. */
export const isEncodedRecord = (record: Pick<MedicalRecord, "source">): boolean =>
  Boolean(record.source && record.source !== "appointment");

export type MedicalRecordInput = {
  assessment: string;
  findings?: string;
  diagnosis?: string;
  recommendations?: string;
  notes?: string;
  serviceDetails?: Record<string, string | number | boolean>;
  followUpRequired?: boolean;
  followUpDate?: string | null;
};
