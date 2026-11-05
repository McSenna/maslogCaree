export type DoseStatus = "completed" | "pending" | "not_scheduled";

export type AgeSlot = "birth" | "6w" | "10w" | "14w" | "9m" | "12m";

export type Dose = {
  slot: AgeSlot;
  label: string;
  status: DoseStatus;
  /** Calendar date, YYYY-MM-DD. */
  administeredOn?: string;
};

/** Age slots with no dose here render as not scheduled. */
export type Vaccine = {
  id: string;
  name: string;
  doses: Dose[];
};

export type Baby = {
  name: string;
  dob: string;
  id: string;
  isSampleName: boolean;
  sex?: string;
};

export type Mother = {
  name: string;
  dob: string;
  sex: string;
  purok: string;
  masterListId: string;
  hasLinkedAccount: boolean;
};

export type Visit = {
  date: string;
  provider: string;
  type: string;
  source: string;
};

export type ImmunizationRecord = {
  recordId: string;
  baby: Baby;
  mother: Mother;
  visit: Visit;
  vaccines: Vaccine[];
};

export type RecordTab = "vaccinations" | "visit" | "notes" | "history";

export type ProgressStatus = "not_started" | "in_progress" | "complete";

export type RecordProgress = {
  completed: number;
  total: number;
  status: ProgressStatus;
  statusLabel: string;
  summary: string;
};
