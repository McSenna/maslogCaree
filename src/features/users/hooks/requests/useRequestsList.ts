import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import {
  getUserRequests,
  type UserRequestSummary,
  type UserRequestsCounts,
} from "../../services/userRequestsService";
import {
  REQUESTS_PAGE_SIZE,
  REQUESTS_SEARCH_DEBOUNCE_MS,
  buildRequestDateRange,
  type RequestDatePreset,
  type RequestStatusFilter,
} from "../../components/requests/userRequestsColumns";

export type { RequestStatusFilter };

const EMPTY_COUNTS: UserRequestsCounts = { pending: 0, approved: 0, rejected: 0, total: 0 };

export const useRequestsList = () => {
  const [requests, setRequests] = useState<UserRequestSummary[]>([]);
  const [counts, setCounts] = useState<UserRequestsCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatusState] = useState<RequestStatusFilter>("pending");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [idType, setIdTypeState] = useState("");
  const [datePreset, setDatePresetState] = useState<RequestDatePreset>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, REQUESTS_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const requestSeq = useRef(0);

  const load = useCallback(
    async (mode: "load" | "refresh") => {
      const seq = ++requestSeq.current;
      if (mode === "load") setLoading(true);
      else setRefreshing(true);
      setError(null);

      const { dateFrom, dateTo } = buildRequestDateRange(datePreset);

      try {
        const data = await getUserRequests({
          status,
          search,
          idType,
          dateFrom,
          dateTo,
          page,
          limit: REQUESTS_PAGE_SIZE,
        });
        if (seq !== requestSeq.current) return;

        setRequests(data.requests);
        setCounts(data.counts);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        if (seq !== requestSeq.current) return;
        setError(getApiErrorMessage(err, "Failed to load verification requests."));
        setRequests([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (seq === requestSeq.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [status, search, idType, datePreset, page]
  );

  const fetchRequests = useCallback(() => load("load"), [load]);
  const refreshRequests = useCallback(() => load("refresh"), [load]);

  useEffect(() => {
    void load("load");
  }, [load]);

  const withPageReset =
    <T,>(apply: (value: T) => void) =>
    (value: T) => {
      apply(value);
      setPage(1);
    };

  return {
    requests,
    counts,
    loading,
    refreshing,
    error,
    fetchRequests,
    refreshRequests,
    load,

    status,
    setStatus: withPageReset(setStatusState),
    search: searchInput,
    setSearch: setSearchInput,
    idType,
    setIdType: withPageReset(setIdTypeState),
    datePreset,
    setDatePreset: withPageReset(setDatePresetState),
    page,
    setPage,
    total,
    totalPages,
  };
};
