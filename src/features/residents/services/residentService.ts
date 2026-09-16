import api from "@/services/api";
import type { UserStatus } from "@/features/users/services/userService";

export type { UserStatus };

export interface ResidentAddressDetails {
  houseNumberOrPurok?: string;
  street?: string;
  barangay?: string;
  cityMunicipality?: string;
  province?: string;
}

export interface ResidentRecord {
  _id: string;
  reference: string;
  firstName: string;
  middleName: string;
  surname: string;
  suffix: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  addressDetails: ResidentAddressDetails | null;
  profilePhoto: string;
  status: UserStatus;
  createdAt: string;
}

export interface ResidentSummary {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
}

export interface ResidentQuery {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  sort: string;
}

export interface ResidentPage {
  residents: ResidentRecord[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  summary: ResidentSummary;
}

interface GetResidentsResponse extends ResidentPage {
  success: boolean;
  message: string;
}

export const EMPTY_RESIDENT_PAGE: ResidentPage = {
  residents: [],
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
  summary: { total: 0, active: 0, inactive: 0, pending: 0, suspended: 0 },
};

export const getResidents = async (
  query: ResidentQuery,
  signal?: AbortSignal
): Promise<ResidentPage> => {
  const { data } = await api.get<GetResidentsResponse>("/residents", {
    signal,
    params: {
      page: query.page,
      pageSize: query.pageSize,
      ...(query.search ? { search: query.search } : {}),
      ...(query.status !== "all" ? { status: query.status } : {}),
      sort: query.sort,
    },
  });

  return {
    residents: data.residents ?? [],
    page: data.page ?? 1,
    pageSize: data.pageSize ?? query.pageSize,
    total: data.total ?? 0,
    totalPages: data.totalPages ?? 1,
    summary: data.summary ?? EMPTY_RESIDENT_PAGE.summary,
  };
};
