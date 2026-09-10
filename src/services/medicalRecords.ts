import api from "@/services/api";
import type { AppointmentRecord } from "@/services/appointments";

/**
 * Completing a service, and everything completion produces.
 *
 * Kept apart from `appointments.ts` on purpose: that module is about
 * scheduling a visit, this one is about what the visit produced. They share
 * the appointment type and nothing else.
 */

/** One control on the completion form, as the server's catalogue describes it. */
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
  /** Rendered only while the named boolean field is on. */
  dependsOn?: string;
};

/**
 * The whole form for one service.
 *
 * Sent by the server rather than declared here, so a field added to the
 * catalogue appears on web and on Android without either app being rebuilt —
 * and so the form a health worker fills in is always the one the server will
 * validate against.
 */
export type CompletionForm = {
  categoryKey: string;
  label: string;
  common: MedicalField[];
  service: MedicalField[];
  followUp: MedicalField[];
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
  /** The health worker's own column. Absent from the resident's own view. */
  notes?: string;
  serviceDetails?: Record<string, string | number | boolean>;
  followUpRequired?: boolean;
  followUpDate?: string | null;
  appointmentDate?: string | null;
  completedAt: string;
  createdAt?: string;
};

/** What the completion form submits. Shape mirrors the server's validator. */
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

/** Every service's form, in one call. Cached by the caller for the session. */
export async function fetchCompletionForms(): Promise<CompletionForm[]> {
  const { data } = await api.get<{ success: boolean; forms: CompletionForm[] }>(
    "/appointments/completion-forms"
  );
  return data.forms ?? [];
}

/**
 * Marks an appointment as being served.
 *
 * Optional in the flow — a five-minute BP check goes straight to Complete.
 * Safe to call twice: the server treats "already serving" as success.
 */
export async function startProcessing(appointmentId: string): Promise<AppointmentRecord> {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${appointmentId}/processing`
  );
  return data.appointment;
}

/**
 * Completes an appointment and files its medical record, in one call.
 *
 * One request, not two: the server writes the record, the status and the
 * resident's notification inside a single transaction. Splitting this in the
 * client would put a half-completed visit one dropped connection away.
 *
 * `alreadyCompleted` comes back when a second submit lost the race — the
 * caller should treat that as success, not as an error to show.
 */
export async function completeAppointment(
  appointmentId: string,
  medicalRecord: MedicalRecordInput
): Promise<{
  appointment: AppointmentRecord;
  medicalRecord: MedicalRecord | null;
  alreadyCompleted?: boolean;
}> {
  const { data } = await api.post<{
    success: boolean;
    appointment: AppointmentRecord;
    medicalRecord: MedicalRecord | null;
    alreadyCompleted?: boolean;
  }>(`/appointments/${appointmentId}/complete`, { medicalRecord });

  return {
    appointment: data.appointment,
    medicalRecord: data.medicalRecord ?? null,
    alreadyCompleted: data.alreadyCompleted,
  };
}

/** Completed appointments in the caller's own service scope, newest first. */
export async function fetchCompletedAppointments(
  options?: { categoryKey?: string }
): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/completed",
    { params: options?.categoryKey ? { categoryKey: options.categoryKey } : undefined }
  );
  return data.appointments ?? [];
}

/** One record, with the form that produced it so unknown keys stay labelled. */
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

/** The signed-in resident's own history. Server-pinned to their own id. */
export async function fetchMyMedicalRecords(): Promise<MedicalRecord[]> {
  const { data } = await api.get<{ success: boolean; medicalRecords: MedicalRecord[] }>(
    "/medical-records/me"
  );
  return data.medicalRecords ?? [];
}
