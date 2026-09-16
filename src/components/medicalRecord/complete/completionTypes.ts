import type { AppointmentRecord } from "@/services/appointments";
import type { InventoryMovement, MedicalRecord } from "@/services/medicalRecords";

export type CompletionResult = {
  appointment: AppointmentRecord;
  medicalRecord: MedicalRecord | null;
  alreadyCompleted?: boolean;
  inventoryTransactions: InventoryMovement[];
};
