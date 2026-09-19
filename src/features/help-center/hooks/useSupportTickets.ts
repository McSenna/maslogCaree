import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { fetchMySupportTickets } from "../services/supportService";
import type { SupportTicketSummary } from "../types/support.types";

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number, isActive: () => boolean) => {
    try {
      const result = await fetchMySupportTickets(targetPage);
      if (!isActive()) return;

      setTickets((current) =>
        targetPage === 1 ? result.tickets : [...current, ...result.tickets]
      );
      setHasMore(result.hasMore);
      setPage(result.page);
      setError(null);
    } catch (caught: unknown) {
      if (isActive()) setError(getApiErrorMessage(caught));
    } finally {
      if (!isActive()) return;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const result = await fetchMySupportTickets(1);
        if (!active) return;

        setTickets(result.tickets);
        setHasMore(result.hasMore);
        setPage(result.page);
        setError(null);
      } catch (caught: unknown) {
        if (active) setError(getApiErrorMessage(caught));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await load(1, () => true);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;
    setLoadingMore(true);
    await load(page + 1, () => true);
  }, [hasMore, loadingMore, loading, page, load]);

  return { tickets, loading, loadingMore, hasMore, error, refresh, loadMore };
};
