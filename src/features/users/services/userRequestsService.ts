import api from "@/services/api";
import type {
  GetIdTypesResponse,
  GetUserRequestDetailResponse,
  GetUserRequestsParams,
  GetUserRequestsResponse,
  IdTypeOption,
  UserRequestDetail,
  UserRequestsCounts,
  UserRequestSummary,
} from "./userRequestTypes";

export type {
  GetUserRequestsParams,
  IdTypeOption,
  UserRequestDetail,
  UserRequestResident,
  UserRequestsCounts,
  UserRequestSummary,
} from "./userRequestTypes";

export const getUserRequests = async (
  params: GetUserRequestsParams = {}
): Promise<{
  requests: UserRequestSummary[];
  counts: UserRequestsCounts;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const { data } = await api.get<GetUserRequestsResponse>("/admin/user-requests", { params });
  return {
    requests: data.requests ?? [],
    counts: data.counts ?? { pending: 0, approved: 0, rejected: 0, total: 0 },
    pagination: data.pagination ?? { page: 1, limit: 15, total: 0, totalPages: 1 },
  };
};

export const getUserRequestById = async (id: string): Promise<UserRequestDetail> => {
  const { data } = await api.get<GetUserRequestDetailResponse>(`/admin/user-requests/${id}`);
  return data.request;
};

// `masterResidentId`: a record ID to link, null to keep the account unlinked,
// or left out so the server links only a clean sign-up match.
export const approveUserRequest = async (
  id: string,
  masterResidentId?: string | null
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch<{ success: boolean; message: string }>(
    `/admin/user-requests/${id}/approve`,
    masterResidentId === undefined ? {} : { masterResidentId }
  );
  return data;
};

export const rejectUserRequest = async (
  id: string,
  reason: string,
  remarks: string = ""
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch<{ success: boolean; message: string }>(
    `/admin/user-requests/${id}/reject`,
    { reason, remarks }
  );
  return data;
};

export const getIdTypesAndReasons = async (): Promise<{
  idTypes: IdTypeOption[];
  rejectionReasons: string[];
}> => {
  const { data } = await api.get<GetIdTypesResponse>("/id-types");
  return {
    idTypes: data.idTypes ?? [],
    rejectionReasons: data.rejectionReasons ?? [],
  };
};

export const idDocumentPath = (id: string): string => `/admin/user-requests/${id}/document`;
