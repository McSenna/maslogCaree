import type { ImmunizationProgramProgress } from "@/services/immunizationRecordProgress";
export type Mother = { masterResidentId: string; name: string };
export type Baby = {
  _id: string;
  name: string;
  dateOfBirth: string;
  motherMasterResidentId: string;
  temporaryName: boolean;
  /** Staff only: left out of a resident's response. */
  birthRecordId?: string;
  scheduleVersion: string;
  age: { months: number; days: number; weeks: number };
};
export type Administration = {
  administeredOn: string;
  administeredAt?: string;
  administeredBy?: string;
  facility?: string;
  lotNumber?: string;
  route?: string;
  site?: string;
  remarks?: string;
  immediateReaction?: string;
  aefi?: string;
  historical?: boolean;
};
export type DoseRecord = Partial<Administration> & {
  _id: string;
  babyId: string;
  doseKey: string;
  state: "administered" | "deferred" | "void" | "pending";
  workflowStatus?: "draft" | "completed";
  /** Staff only: absent from a resident's response, along with an empty history. */
  recordedBy?: string;
  followUpOn?: string;
  reason?: string;
  /** Staff only. Every save a midwife can make sends this back. */
  revision?: number;
  history: {
    action: string;
    reason: string;
    actor: string;
    at: string;
    previous: Record<string, unknown>;
  }[];
  createdAt: string;
  updatedAt: string;
};
export type DoseView = {
  key: string;
  vaccineKey: string;
  label: string;
  slot: string;
  targetOn: string;
  scheduledOn: string;
  proposedThursday?: string | null;
  appointmentId?: string;
  appointmentAt?: string;
  status:
    | "Upcoming"
    | "Due"
    | "Overdue"
    | "Administered"
    | "Deferred"
    | "Requires review";
  reviewRequired: boolean;
  record: DoseRecord | null;
};
export type Schedule = {
  version: string;
  title: string;
  source: string;
  effectiveOn: string;
  activationStatus: string;
  dueWindowDays: number;
  slots: { key: string; label: string }[];
  vaccines: {
    key: string;
    name: string;
    disease: string;
    route: string;
    doses: { key: string; label: string; slot: string }[];
  }[];
};
export type Checklist = {
  medicalRecord?: (ImmunizationProgramProgress & { _id: string }) | null;
  baby: Baby;
  mother: Mother;
  accountLinked: boolean;
  remindersEnabled: boolean;
  schedule: Schedule;
  doses: DoseView[];
  nextScheduledDate: string | null;
  nextProposedDate?: string | null;
  schedulingReviewRequired?: boolean;
  legacyReviewRequired: boolean;
  history: DoseRecord[];
};
/** A completed visit, resolved to its baby by the server. Older or ambiguous visits stay unlinked. */
export type VisitLedger =
  | { linked: false }
  | { linked: true; visitDay: string; visitDoseKeys: string[]; checklist: Checklist };
export type PatientDose = {
  motherMasterResidentId: string;
  babyId: string;
  doseKey: string;
};
export type Correction = PatientDose & {
  reason: string;
  action: "void" | "correct";
  expectedRevision: number;
  administration?: Partial<Administration> & Pick<Administration, "administeredOn">;
};
