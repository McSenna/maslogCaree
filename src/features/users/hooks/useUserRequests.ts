import { useCallback } from "react";

import { useRequestReview } from "./requests/useRequestReview";
import { useRequestsList, type RequestStatusFilter } from "./requests/useRequestsList";

export type { RequestStatusFilter };

export const useUserRequests = (onToast?: (message: string) => void) => {
  const list = useRequestsList();

  const refresh = useCallback(() => list.load("refresh"), [list]);
  const review = useRequestReview({ onToast, refresh });

  return {
    requests: list.requests,
    counts: list.counts,
    loading: list.loading,
    refreshing: list.refreshing,
    error: list.error,
    fetchRequests: list.fetchRequests,
    refreshRequests: list.refreshRequests,

    status: list.status,
    setStatus: list.setStatus,
    search: list.search,
    setSearch: list.setSearch,
    idType: list.idType,
    setIdType: list.setIdType,
    datePreset: list.datePreset,
    setDatePreset: list.setDatePreset,
    page: list.page,
    setPage: list.setPage,
    total: list.total,
    totalPages: list.totalPages,

    ...review,
  };
};

export type UserRequestsController = ReturnType<typeof useUserRequests>;
