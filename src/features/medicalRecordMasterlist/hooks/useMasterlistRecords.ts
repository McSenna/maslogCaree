import { useCallback, useEffect, useState } from "react";

import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { SEARCH_DEBOUNCE_MS } from "@/features/users/admin/hooks/useUserFilterState";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import type { ListSchema } from "@/lib/listState/listStateCodec";

import { replaceKnown } from "@/lib/realtime/collectionReducer";

import { searchMasterlist } from "../services/masterlistRecordsApi";
import type { Linkage, MasterlistCriteria, MasterlistPage, MasterlistSource } from "../types";

export const MASTERLIST_PAGE_SIZE = 20;

// New visits filed from the queue, encoded records and account links all change this list.
const MASTERLIST_SOURCES = ["medicalRecord"] as const;

const SOURCES: readonly string[] = ["", "appointment", "historical_masterlist", "walk_in", "medical_mission", "manual_entry"];
const LINKAGES: readonly string[] = ["", "linked", "pending_review", "unlinked"];

type UrlCriteria = Pick<MasterlistCriteria, "serviceType" | "source" | "linkage" | "from" | "to">;

/**
 * What the masterlist keeps in its URL: page, service, source, linkage and
 * year range. The search box (it can hold a resident's name) and the master
 * list ID (a record ID) never go in the URL: the search lasts for the browser
 * tab or app session, the ID only while the screen is open.
 */
const MASTERLIST_SCHEMA: ListSchema<UrlCriteria> = {
  fields: {
    serviceType: { kind: "code", param: "service" },
    source: { kind: "enum", values: SOURCES, fallback: "" },
    linkage: { kind: "enum", values: LINKAGES, fallback: "" },
    from: { kind: "date" },
    to: { kind: "date" },
  },
  limits: [MASTERLIST_PAGE_SIZE],
};

const appendPage = (previous: MasterlistPage | null, next: MasterlistPage): MasterlistPage => {
  if (!previous) return next;
  const seen = new Set(previous.records.map((record) => record._id));
  return { ...next, records: [...previous.records, ...next.records.filter((record) => !seen.has(record._id))] };
};

/** A quiet realtime reload of a deeper page: swap in updated rows, keep the rest. */
const refreshPage = (previous: MasterlistPage | null, next: MasterlistPage): MasterlistPage =>
  previous ? { ...next, records: replaceKnown(previous.records, next.records, (record) => record._id) } : next;

const urlPart = ({ serviceType, source, linkage, from, to }: Partial<MasterlistCriteria>): Partial<UrlCriteria> =>
  Object.fromEntries(
    Object.entries({ serviceType, source, linkage, from, to }).filter(([, value]) => value !== undefined)
  ) as Partial<UrlCriteria>;

/**
 * Server-side search, filters and paging for the masterlist. Phones append
 * pages (the page is then not restored); wide layouts replace them.
 */
export const useMasterlistRecords = ({ append }: { append: boolean }) => {
  // The count from the last load lets a page past the end move back onto the last page.
  const [listTotal, setListTotal] = useState<number | null>(null);
  const [masterResidentId, setMasterResidentId] = useState("");
  const list = usePersistedPagination({
    key: "medical-masterlist",
    schema: MASTERLIST_SCHEMA,
    total: listTotal,
    persistPage: !append,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
  });
  const { page, setPage, search, filters, setFilters, replaceSearch, setSearchInput } = list;

  const criteria: MasterlistCriteria = {
    ...filters,
    source: filters.source as MasterlistSource | "",
    linkage: filters.linkage as Linkage | "",
    search: list.searchInput,
    masterResidentId,
  };

  const query = { ...criteria, search, page, limit: MASTERLIST_PAGE_SIZE };
  const result = useRemoteData({
    key: `medical-masterlist:${JSON.stringify(query)}`,
    load: () => searchMasterlist(query),
    merge: append && page > 1 ? appendPage : undefined,
    live: MASTERLIST_SOURCES,
    liveMerge: refreshPage,
  });

  const changeResidentId = useCallback(
    (next: string) => {
      if (next === masterResidentId) return;
      setMasterResidentId(next);
      setPage(1);
    },
    [masterResidentId, setPage]
  );

  const update = useCallback(
    (patch: Partial<MasterlistCriteria>) => {
      if (patch.search !== undefined) setSearchInput(patch.search);
      if (patch.masterResidentId !== undefined) changeResidentId(patch.masterResidentId);
      setFilters(urlPart(patch));
    },
    [changeResidentId, setFilters, setSearchInput]
  );

  const replace = useCallback(
    (next: MasterlistCriteria) => {
      replaceSearch(next.search);
      setMasterResidentId(next.masterResidentId);
      setFilters(urlPart(next));
      setPage(1);
    },
    [replaceSearch, setFilters, setPage]
  );

  const records = result.data?.records ?? [];
  const total = result.data?.total ?? 0;
  const settled = !result.isFetching && result.data !== null;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    if (settled) setListTotal(total);
  }, [settled, total]);
  // A page past the end reads as loading until it moves to the new last page, never as "no records".
  const pastEnd = !append && settled && total > 0 && page > Math.ceil(total / MASTERLIST_PAGE_SIZE);

  const loadMore = () => {
    if (!result.isFetching && records.length < total) setPage(page + 1);
  };

  const refresh = () => {
    if (append) setPage(1);
    result.refetch();
  };

  const filtered = Object.values(criteria).some(Boolean);

  return {
    criteria,
    update,
    replace,
    page,
    setPage,
    filtered,
    records,
    total,
    serviceCounts: result.data?.serviceCounts ?? null,
    isLoading: result.isLoading || pastEnd,
    isFetching: result.isFetching,
    isRefreshing: result.isRefreshing,
    error: result.error,
    loadMore,
    refresh,
  };
};

export type MasterlistRecordsState = ReturnType<typeof useMasterlistRecords>;
