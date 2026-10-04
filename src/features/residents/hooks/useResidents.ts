import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { toastBackgroundError } from "@/utils/errorToast/toastError";
import { useRealtimePagedList } from "@/hooks/realtime/useRealtimePagedList";
import { useLatestRef } from "@/hooks/useLatestRef";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import type { ListSchema } from "@/lib/listState/listStateCodec";
import { removeItem, replaceKnown } from "@/lib/realtime/collectionReducer";
import {
  EMPTY_RESIDENT_PAGE,
  getResidents,
  type ResidentPage,
} from "../services/residentService";
import type { ResidentSortKey, ResidentStatusFilter } from "../components/residentFilters";
import { RESIDENT_PAGE_SIZE } from "../components/residentsLayout";

const SEARCH_DEBOUNCE_MS = 350;

const STATUSES: readonly ResidentStatusFilter[] = ["all", "active", "inactive", "pending", "suspended", "restricted"];
const SORTS: readonly ResidentSortKey[] = ["created_desc", "created_asc", "name_asc", "name_desc"];

/** What the residents table keeps in its URL; the search box is kept apart (it can hold a name). */
const RESIDENT_LIST_SCHEMA: ListSchema<{ status: ResidentStatusFilter; sort: ResidentSortKey }> = {
  fields: {
    status: { kind: "enum", values: STATUSES, fallback: "all" },
    sort: { kind: "enum", values: SORTS, fallback: "created_desc" },
  },
  limits: [RESIDENT_PAGE_SIZE],
};

export const useResidents = () => {
  const [data, setData] = useState<ResidentPage>(EMPTY_RESIDENT_PAGE);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Page, status and sort live in the URL (and on phones, the last view), so a refresh lands on the same page.
  const list = usePersistedPagination({
    key: "residents",
    schema: RESIDENT_LIST_SCHEMA,
    total: hasLoaded ? data.total : null,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
  });
  const { page, setPage, search, setFilters, replaceSearch } = list;
  // Read inside the fetch effect without re-running it each time the page count changes.
  const setPageRef = useLatestRef(setPage);
  const { status, sort } = list.filters;

  const isRefreshRef = useRef(false);
  // Set for a realtime reload: same page, no busy state, and a failure keeps the table.
  const isQuietRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let ignored = false;

    const isRefresh = isRefreshRef.current;
    const isQuiet = isQuietRef.current;
    isRefreshRef.current = false;
    isQuietRef.current = false;

    if (isRefresh) setRefreshing(true);
    else if (!isQuiet) setBusy(true);

    (async () => {
      try {
        const result = await getResidents(
          { page, pageSize: RESIDENT_PAGE_SIZE, search, status, sort },
          controller.signal
        );
        if (ignored) return;
        setData(result);
        setError(null);
        if (result.page !== page) setPageRef.current(result.page);
      } catch (fetchError: unknown) {
        if (ignored) return;
        // A failed quiet reload keeps the table on screen and says it may be behind.
        if (isQuiet) return toastBackgroundError("Residents list not updated", fetchError);
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
  }, [search, status, sort, page, reloadToken, setPageRef]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const refresh = useCallback(() => {
    isRefreshRef.current = true;
    reload();
  }, [reload]);

  // A new registration or a status change shows on its row at once; the quiet
  // reload then fixes the summary cards, filters and order.
  useRealtimePagedList("resident", {
    patch: (change) =>
      setData((current) => ({
        ...current,
        residents:
          change.action === "deleted"
            ? removeItem(current.residents, change.id, (resident) => resident._id)
            : replaceKnown(current.residents, [change.record], (resident) => resident._id),
      })),
    reload: () => {
      isQuietRef.current = true;
      reload();
    },
  });

  // A summary card counts every resident, so it clears the search as well.
  const showStatus = useCallback(
    (next: ResidentStatusFilter) => {
      replaceSearch("");
      setFilters({ status: next });
    },
    [replaceSearch, setFilters]
  );

  return {
    showStatus,
    searchInput: list.searchInput,
    onSearchChange: list.setSearchInput,
    status,
    onStatusChange: (next: ResidentStatusFilter) => setFilters({ status: next }),
    sort,
    onSortChange: (next: ResidentSortKey) => setFilters({ sort: next }),

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
