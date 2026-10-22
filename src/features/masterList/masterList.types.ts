// Barangay Master List: official resident records. These are not user
// accounts; `linkedAccount` only says whether some account points at a record.
import type { CivilStatus } from "../../config/civilStatus.ts";

export type MasterResidentRole = "resident" | "bhw" | "midwife";

export type MasterListSort = "name_asc" | "name_desc" | "newest" | "oldest";

export type MasterListRoleFilter = MasterResidentRole | "all";

export type MasterSex = "male" | "female";
export type MasterCivilStatus = CivilStatus;
export type MasterCivilStatusFilter = MasterCivilStatus | "all";
export type MasterListStatus = "active" | "inactive" | "all";

export interface MasterResidentRecord {
  _id: string;
  masterResidentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  /** Calendar date, YYYY-MM-DD. */
  dateOfBirth: string;
  sex: MasterSex;
  civilStatus: MasterCivilStatus;
  barangay: string;
  address: string;
  role?: MasterResidentRole | null;
  isActive: boolean;
  linkedAccount: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MasterListCounts {
  active: number;
  inactive: number;
  total: number;
}

export interface MasterListPage {
  records: MasterResidentRecord[];
  counts: MasterListCounts;
  total: number;
}

/** What an admin may send. The server ignores everything else. */
export interface MasterResidentInput {
  masterResidentId?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  sex: string;
  civilStatus: string;
  barangay: string;
  address: string;
  role: string;
}
