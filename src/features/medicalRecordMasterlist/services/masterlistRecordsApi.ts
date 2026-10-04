import api from "@/services/api";
import type { MedicalRecordInput } from "@/services/medicalRecords";

import type {
  EncodableSource,
  MasterlistCriteria,
  MasterlistDetail,
  MasterlistPage,
  MasterlistRow,
  MasterlistSummary,
  ResidentIdentity,
  StaffRole,
} from "../types";

// Staff-only. Searches are POSTs so names and references never sit in a URL.
const BASE = "/medical-record-masterlist";

type SearchResponse = {
  records?: MasterlistRow[];
  pagination?: { total: number };
  serviceCounts?: Record<string, number>;
};

export type MasterlistQuery = MasterlistCriteria & { page: number; limit: number };

const withoutBlanks = (criteria: MasterlistQuery) =>
  Object.fromEntries(Object.entries(criteria).filter(([, value]) => value !== "" && value !== null));

export const searchMasterlist = async (query: MasterlistQuery): Promise<MasterlistPage> => {
  const { data } = await api.post<SearchResponse>(`${BASE}/search`, withoutBlanks(query));
  return {
    records: data.records ?? [],
    total: data.pagination?.total ?? 0,
    serviceCounts: data.serviceCounts ?? null,
  };
};

export const fetchMasterlistSummary = async (): Promise<MasterlistSummary> => {
  const { data } = await api.get<{ summary: MasterlistSummary }>(`${BASE}/summary`);
  return data.summary;
};

export const searchResidentIdentities = async (query: string): Promise<ResidentIdentity[]> => {
  const { data } = await api.post<{ identities?: ResidentIdentity[] }>(`${BASE}/identities/search`, { query });
  return data.identities ?? [];
};

export const fetchMasterlistRecord = async (id: string): Promise<MasterlistDetail> => {
  const { data } = await api.get<{ detail: MasterlistDetail }>(`${BASE}/${id}`);
  return data.detail;
};

export type EncodeRecordBody = {
  masterResidentId: string;
  serviceType: string;
  source: EncodableSource;
  visitDate: string;
  providerName: string;
  providerRole: StaffRole | "";
  visitReason: string;
  record: MedicalRecordInput;
  requestKey: string;
  confirmDuplicate?: boolean;
};

export const encodeMedicalRecord = async (body: EncodeRecordBody): Promise<MasterlistDetail> => {
  const { data } = await api.post<{ detail: MasterlistDetail }>(BASE, body);
  return data.detail;
};

export type EditRecordBody = Omit<EncodeRecordBody, "masterResidentId" | "serviceType" | "source" | "requestKey" | "confirmDuplicate"> & {
  reason: string;
};

export const editMedicalRecord = async (id: string, body: EditRecordBody): Promise<MasterlistDetail> => {
  const { data } = await api.patch<{ detail: MasterlistDetail }>(`${BASE}/${id}`, body);
  return data.detail;
};
