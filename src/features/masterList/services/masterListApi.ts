import api from "@/services/api";

import type {
  MasterListCounts,
  MasterListPage,
  MasterListStatus,
  MasterResidentInput,
  MasterResidentRecord,
} from "../masterList.types";

// Admin-only endpoints, separate from every user-account endpoint.
const BASE = "/admin/master-residents";

type ListResponse = {
  records?: MasterResidentRecord[];
  counts?: MasterListCounts;
  pagination?: { total: number };
};

type RecordResponse = { record: MasterResidentRecord; message?: string };

export type MasterListParams = {
  search: string;
  status: MasterListStatus;
  page: number;
  limit: number;
};

const EMPTY_COUNTS: MasterListCounts = { active: 0, inactive: 0, total: 0 };

export const fetchMasterResidents = async (params: MasterListParams): Promise<MasterListPage> => {
  const { data } = await api.get<ListResponse>(BASE, {
    params: { search: params.search || undefined, status: params.status, page: params.page, limit: params.limit },
  });
  return {
    records: data.records ?? [],
    counts: data.counts ?? EMPTY_COUNTS,
    total: data.pagination?.total ?? 0,
  };
};

export const createMasterResident = async (input: MasterResidentInput): Promise<MasterResidentRecord> => {
  const { data } = await api.post<RecordResponse>(BASE, input);
  return data.record;
};

export const updateMasterResident = async (id: string, input: MasterResidentInput): Promise<MasterResidentRecord> => {
  const { data } = await api.patch<RecordResponse>(`${BASE}/${id}`, input);
  return data.record;
};

export const setMasterResidentActive = async (id: string, active: boolean): Promise<MasterResidentRecord> => {
  const { data } = await api.patch<RecordResponse>(`${BASE}/${id}/status`, { active });
  return data.record;
};
