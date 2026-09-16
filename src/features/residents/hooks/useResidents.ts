import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import {
  EMPTY_RESIDENT_PAGE,
  getResidents,
  type ResidentPage,
} from "../services/residentService";
import type { ResidentSortKey, ResidentStatusFilter } from "../components/residentFilters";
import { RESIDENT_PAGE_SIZE } from "../components/residentsLayout";

const SEARCH_DEBOUNCE_MS = 350;

export const useResidents = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatusValue] = useState<ResidentStatusFilter>("all");
  const [sort, setSortValue] = useState<ResidentSortKey>("created_desc");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<ResidentPage>(EMPTY_RESIDENT_PAGE);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const isRefreshRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let ignored = false;

    const isRefresh = isRefreshRef.current;
    isRefreshRef.current = false;

    if (isRefresh) setRefreshing(true);
    else setBusy(true);

    (async () => {
      try {
        const result = await getResidents(
          { page, pageSize: RESIDENT_PAGE_SIZE, search, status, sort },
          controller.signal
        );
        if (ignored) return;
        setData(result);
        setError(null);
        if (result.page !== page) setPage(result.page);
      } catch (fetchError: unknown) {
        if (ignored) return;
        setError(getApiErrorMessage(fetchError, "Unable to load residents. Please try again."));
      } finally {
        if (!ignored) {
          setHasLoaded(true);
          setBusy(false);
          setRefreshing(false);
        }
      }
    })();

    return () => {
      ignored = true;
      controller.abort();
    };
  }, [search, status, sort, page, reloadToken]);

  const resetToFirstPage = useCallback(<T,>(apply: (value: T) => void) => (value: T) => {
    apply(value);
    setPage(1);
  }, []);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const refresh = useCallback(() => {
    isRefreshRef.current = true;
    reload();
  }, [reload]);

  return {
    searchInput,
    onSearchChange: setSearchInput,
    status,
    onStatusChange: resetToFirstPage(setStatusValue),
    sort,
    onSortChange: resetToFirstPage(setSortValue),

    page,
    setPage,
    totalPages: data.totalPages,
    total: data.total,
    pageSize: data.pageSize,
    residents: data.residents,
    summary: data.summary,

    loading: !hasLoaded && busy,
    busy,
    refreshing,
    error,
    refresh,
    retry: reload,

    hasActiveFilters: search.length > 0 || status !== "all",
  };
};

export type ResidentsController = ReturnType<typeof useResidents>;
