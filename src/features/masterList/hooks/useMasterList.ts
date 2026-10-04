import { useEffect, useState } from "react";

import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { SEARCH_DEBOUNCE_MS } from "@/features/users/admin/hooks/useUserFilterState";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import type { ListSchema } from "@/lib/listState/listStateCodec";

import { replaceKnown } from "@/lib/realtime/collectionReducer";

import type { MasterListPage } from "../masterList.types";
import { fetchMasterResidents } from "../services/masterListApi";

export const MASTER_PAGE_SIZE = 20;

const MASTER_LIST_SOURCES = ["masterResident"] as const;

/** Only the page is kept in the URL, under its own name: it shares the Users route with the account list. */
const MASTER_LIST_SCHEMA: ListSchema<Record<string, never>> = { fields: {}, limits: [MASTER_PAGE_SIZE], pageParam: "mpage" };

const appendPage = (previous: MasterListPage | null, next: MasterListPage): MasterListPage => {
  if (!previous) return next;
  const seen = new Set(previous.records.map((record) => record._id));
  return { ...next, records: [...previous.records, ...next.records.filter((record) => !seen.has(record._id))] };
};

/** A quiet realtime reload of a deeper page: swap in updated rows, keep the rest. */
const refreshPage = (previous: MasterListPage | null, next: MasterListPage): MasterListPage =>
  previous ? { ...next, records: replaceKnown(previous.records, next.records, (record) => record._id) } : next;

/**
 * Search and paging for the master list. Every record shows, active or not,
 * so a deactivated one can still be found and reactivated; each row carries its
 * own status. Phones append pages (infinite scroll); wide layouts replace them.
 */
export const useMasterList = ({ append }: { append: boolean }) => {
  // The count from the last load lets a page past the end move back onto the last page.
  const [listTotal, setListTotal] = useState<number | null>(null);
  const list = usePersistedPagination({
    key: "master-list",
    schema: MASTER_LIST_SCHEMA,
    total: listTotal,
    persistPage: !append,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
  });
  const { page, setPage, search } = list;

  const query = { search, status: "all" as const, page, limit: MASTER_PAGE_SIZE };
  const result = useRemoteData({
    key: `master:${JSON.stringify(query)}`,
    load: () => fetchMasterResidents(query),
    merge: append && page > 1 ? appendPage : undefined,
    live: MASTER_LIST_SOURCES,
    liveMerge: refreshPage,
  });

  const records = result.data?.records ?? [];
  const total = result.data?.total ?? 0;
  const settled = !result.isFetching && result.data !== null;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    if (settled) setListTotal(total);
  }, [settled, total]);
  // A page past the end reads as loading until it moves to the new last page, never as an empty list.
  const pastEnd = !append && settled && total > 0 && page > Math.ceil(total / MASTER_PAGE_SIZE);

  const loadMore = () => {
    if (!result.isFetching && records.length < total) setPage(page + 1);
  };

  const refresh = () => {
    if (append) setPage(1);
    result.refetch();
  };

  return {
    queryInput: list.searchInput,
    setQuery: list.setSearchInput,
    page,
    setPage,
    filtered: Boolean(search),
    records,
    total,
    counts: result.data?.counts ?? null,
    isLoading: result.isLoading || pastEnd,
    isFetching: result.isFetching,
    isRefreshing: result.isRefreshing,
    error: result.error,
    loadMore,
    refresh,
  };
};

export type MasterListState = ReturnType<typeof useMasterList>;
