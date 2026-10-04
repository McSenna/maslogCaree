import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

export type MasterlistSource = "appointment" | "historical_masterlist" | "walk_in" | "medical_mission" | "manual_entry";
export type EncodableSource = Exclude<MasterlistSource, "appointment">;
export type Linkage = "linked" | "pending_review" | "unlinked";
export type StaffRole = "admin" | "doctor" | "midwife" | "bhw";

/** A master list identity as staff see it: enough to tell two people apart, nothing more. */
export type ResidentIdentity = {
  masterResidentId: string | null;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  purok: string;
  hasAccount: boolean;
  isActive?: boolean;
  missing?: boolean;
};

export type MasterlistRow = {
  _id: string;
  source: MasterlistSource;
  serviceType: string;
  serviceLabel: string;
  visitDate: string;
  providerName: string;
  providerRole: StaffRole | null;
  resident: ResidentIdentity;
  linkage: Linkage;
  createdAt: string;
};

type Person = { _id: string | null; fullname: string; role: string } | null;

export type RecordRevision = {
  editedBy: Person;
  editedByRole: StaffRole;
  editedAt: string;
  reason: string;
  changes: { field: string; previous: string | number | boolean | null }[];
};

export type EncodedRecord = MedicalRecord & {
  source?: MasterlistSource;
  providerName?: string;
  visitReason?: string;
  masterResidentId?: string;
};

export type MasterlistDetail = MasterlistRow & {
  record: EncodedRecord;
  form: CompletionForm;
  audit: {
    createdBy: Person;
    createdByRole: StaffRole | null;
    createdAt: string;
    updatedBy: Person;
    updatedByRole: StaffRole | null;
    updatedAt: string;
    duplicateAcknowledged: boolean;
  };
  revisions: RecordRevision[];
  editable: boolean;
};

export type MasterlistSummary = {
  total: number;
  historical: number;
  linked: number;
  pendingReview: number;
  unlinked: number;
  services: string[];
};

export type MasterlistCriteria = {
  search: string;
  serviceType: string;
  source: MasterlistSource | "";
  linkage: Linkage | "";
  from: string;
  to: string;
  masterResidentId: string;
};

export type MasterlistPage = {
  records: MasterlistRow[];
  total: number;
  serviceCounts: Record<string, number> | null;
};
