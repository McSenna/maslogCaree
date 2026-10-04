import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRealtimePagedList } from "@/hooks/realtime/useRealtimePagedList";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import type { ListSchema } from "@/lib/listState/listStateCodec";
import { removeItem, replaceKnown } from "@/lib/realtime/collectionReducer";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { SUPPORT_CATEGORIES, SUPPORT_STATUS_ORDER } from "../constants/support.constants";
import { fetchAdminSupportTickets, type AdminTicketQuery } from "../services/adminSupportService";
import type { SupportStatus, SupportTicketSummary } from "../types/support.types";

const PAGE_SIZE = 20;

const ticketId = (ticket: SupportTicketSummary) => ticket.id;

type TicketFilters = { status: string; category: string; sort: string };

/** What the support inbox keeps in its URL; the search box is kept apart (it can hold a name). */
const TICKET_LIST_SCHEMA: ListSchema<TicketFilters> = {
  fields: {
    status: { kind: "enum", values: ["all", ...SUPPORT_STATUS_ORDER], fallback: "all" },
    category: { kind: "enum", values: ["all", ...SUPPORT_CATEGORIES.map((entry) => entry.id)], fallback: "all" },
    sort: { kind: "enum", values: ["recent", "oldest", "created"], fallback: "recent" },
  },
  limits: [PAGE_SIZE],
};

/**
 * The admin support inbox. Status, category, sort and page live in the URL
 * (and on phones, the last view); `appendPages` lists (phones) add pages as
 * the user scrolls, so their page is not restored.
 */
export const useAdminSupportTickets = ({ appendPages }: { appendPages: boolean }) => {
  const [settledTotal, setSettledTotal] = useState<number | null>(null);
  const list = usePersistedPagination({
    key: "admin-support",
    schema: TICKET_LIST_SCHEMA,
    total: settledTotal,
    persistPage: !appendPages,
  });
  const { page, filters, search, searchInput, setFilters, setSearchInput, setPage, reset } = list;
  const status = filters.status as AdminTicketQuery["status"];
  const category = filters.category as AdminTicketQuery["category"];
  const sort = filters.sort as AdminTicketQuery["sort"];
  // What the toolbar shows (the text as typed) and what is fetched (the settled text).
  const query = useMemo<AdminTicketQuery>(() => ({ status, category, sort, search: searchInput, page }), [status, category, sort, searchInput, page]);
  const fetchQuery = useMemo<AdminTicketQuery>(() => ({ status, category, sort, search, page }), [status, category, sort, search, page]);

  const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
  const [pageTickets, setPageTickets] = useState<SupportTicketSummary[]>([]);
  const [statusCounts, setStatusCounts] = useState<Partial<Record<SupportStatus, number>>>({});
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  // Set for a realtime reload: same page, no skeleton, loaded rows kept.
  const quietReload = useRef(false);

  const queryKey = useMemo(() => JSON.stringify(fetchQuery), [fetchQuery]);

  useEffect(() => {
    let active = true;
    const current = JSON.parse(queryKey) as AdminTicketQuery;
    const isFirstPage = (current.page ?? 1) === 1;
    const quiet = quietReload.current;
    quietReload.current = false;

    void (async () => {
      if (!quiet && isFirstPage) setLoading(true);
      else if (!quiet) setLoadingMore(true);

      try {
        const result = await fetchAdminSupportTickets(current);
        if (!active) return;

        setPageTickets(result.tickets);
        setTickets((existing) => {
          if (isFirstPage) return result.tickets;
          return quiet ? replaceKnown(existing, result.tickets, ticketId) : [...existing, ...result.tickets];
        });
        setStatusCounts(result.statusCounts ?? {});
        setTotal(result.total);
        setHasMore(result.hasMore);
        setError(null);
      } catch (caught: unknown) {
        if (active) setError(getApiErrorMessage(caught));
      } finally {
        if (!active) return;
        setLoading(false);
        setLoadingMore(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [queryKey, reloadToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    if (!loading && !loadingMore && !error) setSettledTotal(total);
  }, [loading, loadingMore, error, total]);

  const updateQuery = useCallback(
    (patch: Partial<AdminTicketQuery>) => {
      if (patch.search !== undefined) setSearchInput(patch.search);
      const { status: nextStatus, category: nextCategory, sort: nextSort } = patch;
      setFilters(
        Object.fromEntries(
          Object.entries({ status: nextStatus, category: nextCategory, sort: nextSort }).filter(([, value]) => value !== undefined)
        ) as Partial<TicketFilters>
      );
    },
    [setFilters, setSearchInput]
  );

  const loadMore = useCallback(() => setPage(page + 1), [page, setPage]);

  const refresh = useCallback(() => {
    setPage(1);
    setReloadToken((token) => token + 1);
  }, [setPage]);

  // A new ticket, a requester's reply or another admin's change shows at once on
  // the rows in view; the quiet reload then corrects tab counts and order.
  useRealtimePagedList("adminSupportTicket", {
    patch: (change) => {
      const apply = (rows: SupportTicketSummary[]) =>
        change.action === "deleted" ? removeItem(rows, change.id, ticketId) : replaceKnown(rows, [change.record], ticketId);
      setTickets(apply);
      setPageTickets(apply);
    },
    reload: () => {
      quietReload.current = true;
      setReloadToken((token) => token + 1);
    },
  });

  const clearFilters = useCallback(() => {
    reset();
    setReloadToken((token) => token + 1);
  }, [reset]);

  const hasActiveFilters = Boolean(searchInput.trim() || status !== "all" || category !== "all" || sort !== "recent");

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // A page past the end reads as loading until it moves to the new last page, never as an empty inbox.
  const pastEnd = !appendPages && !loading && !loadingMore && total > 0 && page > totalPages;

  return {
    query,
    tickets,
    pageTickets,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    statusCounts,
    total,
    hasMore,
    loading: loading || pastEnd,
    loadingMore,
    refreshing: loading && tickets.length > 0,
    error,
    hasActiveFilters,
    updateQuery,
    setPage,
    loadMore,
    refresh,
    clearFilters,
  };
};

export type AdminSupportTicketsState = ReturnType<typeof useAdminSupportTickets>;
