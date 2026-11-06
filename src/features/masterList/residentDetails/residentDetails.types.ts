// Import-free so `node --test` can load the model and its tests.
import type { MasterResidentRecord, MasterResidentRole } from "../masterList.types.ts";

/** The server stores only active or inactive; residents who moved or died are marked inactive. */
export type ResidentStatus = "active" | "inactive";

/** The server says whether an app account points at the record; it never sends the account's id. */
export type AppAccountState = "linked" | "not_linked";

/** One resident as the details view shows it, built only from a record fetched by id. */
export interface ResidentDetails {
  id: string;
  recordId: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix?: string;
  /** Calendar date, YYYY-MM-DD. */
  birthDate: string;
  sex: string;
  civilStatus: string;
  role: MasterResidentRole;
  /** Purok and street, as entered on the record. */
  purok: string;
  barangay: string;
  status: ResidentStatus;
  appAccount: AppAccountState;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ResidentField = {
  key: string;
  label: string;
  value: string;
  /** False when the value is the "Not recorded" placeholder, so it can be styled as such. */
  recorded: boolean;
};

export type ResidentFieldGroup = {
  id: "personal" | "record" | "history";
  title: string;
  fields: ResidentField[];
};

export type ResidentDetailsState =
  | { status: "loading" }
  | { status: "ready"; record: MasterResidentRecord }
  | { status: "error"; message: string }
  | { status: "notFound" };
