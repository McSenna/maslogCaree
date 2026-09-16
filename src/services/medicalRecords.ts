import api from "@/services/api";
import type { AppointmentRecord } from "@/services/appointments";
import type {
  CompletionForm,
  DispenseInput,
  InventoryMovement,
  MedicalRecord,
  MedicalRecordInput,
} from "./medicalRecordTypes";

export type {
  CompletionForm,
  DispensedItem,
  DispenseInput,
  InventoryMovement,
  MedicalField,
  MedicalFieldType,
  MedicalRecord,
  MedicalRecordInput,
} from "./medicalRecordTypes";

export async function fetchCompletionForms(): Promise<CompletionForm[]> {
  const { data } = await api.get<{ success: boolean; forms: CompletionForm[] }>(
    "/appointments/completion-forms"
  );
  return data.forms ?? [];
}

export async function startProcessing(appointmentId: string): Promise<AppointmentRecord> {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${appointmentId}/processing`
  );
  return data.appointment;
}

export async function completeAppointment(
  appointmentId: string,
  medicalRecord: MedicalRecordInput,
  inventoryItems: DispenseInput[] = []
): Promise<{
  appointment: AppointmentRecord;
  medicalRecord: MedicalRecord | null;
  alreadyCompleted?: boolean;
  inventoryTransactions: InventoryMovement[];
}> {
  const { data } = await api.post<{
    success: boolean;
    appointment: AppointmentRecord;
    medicalRecord: MedicalRecord | null;
    alreadyCompleted?: boolean;
    inventoryTransactions?: InventoryMovement[];
  }>(`/appointments/${appointmentId}/complete`, {
    medicalRecord,
    ...(inventoryItems.length ? { inventoryItems } : {}),
  });

  return {
    appointment: data.appointment,
    medicalRecord: data.medicalRecord ?? null,
    alreadyCompleted: data.alreadyCompleted,
    inventoryTransactions: data.inventoryTransactions ?? [],
  };
}

export async function fetchCompletedAppointments(
  options?: { categoryKey?: string }
): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/completed",
    { params: options?.categoryKey ? { categoryKey: options.categoryKey } : undefined }
  );
  return data.appointments ?? [];
}

export async function fetchMedicalRecord(
  recordId: string
): Promise<{ medicalRecord: MedicalRecord; form: CompletionForm }> {
  const { data } = await api.get<{
    success: boolean;
    medicalRecord: MedicalRecord;
    form: CompletionForm;
  }>(`/medical-records/${recordId}`);
  return { medicalRecord: data.medicalRecord, form: data.form };
}

export async function fetchMyMedicalRecords(): Promise<MedicalRecord[]> {
  const { data } = await api.get<{ success: boolean; medicalRecords: MedicalRecord[] }>(
    "/medical-records/me"
  );
  return data.medicalRecords ?? [];
}
