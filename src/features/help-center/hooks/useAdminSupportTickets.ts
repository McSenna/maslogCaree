import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { fetchAdminSupportTickets, type AdminTicketQuery } from "../services/adminSupportService";
import type { SupportStatus, SupportTicketSummary } from "../types/support.types";

const PAGE_SIZE = 20;

const initialQuery: AdminTicketQuery = {
  status: "all",
  category: "all",
  search: "",
  sort: "recent",
  page: 1,
};

export const useAdminSupportTickets = () => {
  const [query, setQuery] = useState<AdminTicketQuery>(initialQuery);
  const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
  const [pageTickets, setPageTickets] = useState<SupportTicketSummary[]>([]);
  const [statusCounts, setStatusCounts] = useState<Partial<Record<SupportStatus, number>>>({});
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const queryKey = useMemo(() => JSON.stringify(query), [query]);

  useEffect(() => {
    let active = true;
    const current = JSON.parse(queryKey) as AdminTicketQuery;
    const isFirstPage = (current.page ?? 1) === 1;

    void (async () => {
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);

      try {
        const result = await fetchAdminSupportTickets(current);
        if (!active) return;

        setPageTickets(result.tickets);
        setTickets((existing) =>
          isFirstPage ? result.tickets : [...existing, ...result.tickets]
        );
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

  const updateQuery = useCallback((patch: Partial<AdminTicketQuery>) => {
    setQuery((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery((current) => ({ ...current, page }));
  }, []);

  const loadMore = useCallback(() => {
    setQuery((current) => ({ ...current, page: (current.page ?? 1) + 1 }));
  }, []);

  const refresh = useCallback(() => {
    setQuery((current) => ({ ...current, page: 1 }));
    setReloadToken((token) => token + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setQuery(initialQuery);
    setReloadToken((token) => token + 1);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        query.search?.trim() ||
          (query.status && query.status !== "all") ||
          (query.category && query.category !== "all") ||
          (query.sort && query.sort !== "recent")
      ),
    [query]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    query,
    tickets,
    pageTickets,
    page: query.page ?? 1,
    pageSize: PAGE_SIZE,
    totalPages,
    statusCounts,
    total,
    hasMore,
    loading,
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
