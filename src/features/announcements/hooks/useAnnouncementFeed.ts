import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import type { AnnouncementRecord } from "../announcement.types";
import type { AnnouncementFetcher } from "../services/announcementService";

const PAGE_SIZE = 20;

type LoadMode = "initial" | "refresh";

/**
 * Newest-first announcement list with pull-to-refresh and cursor paging.
 * `prepend` lets a just-created announcement appear without a refetch.
 */
export const useAnnouncementFeed = (fetcher: AnnouncementFetcher) => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const cursorRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  const load = useCallback(
    async (mode: LoadMode) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (mode === "initial") setLoading(true);
      else setRefreshing(true);

      try {
        const page = await fetcher({ limit: PAGE_SIZE });
        setAnnouncements(page.announcements);
        setHasMore(page.hasMore);
        cursorRef.current = page.nextCursor;
        setError(null);
        setLoaded(true);
      } catch (caught: unknown) {
        setError(getApiErrorMessage(caught, "Unable to load announcements."));
      } finally {
        inFlightRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetcher]
  );

  const loadMore = useCallback(async () => {
    const cursor = cursorRef.current;
    if (!cursor || inFlightRef.current) return;
    inFlightRef.current = true;
    setLoadingMore(true);

    try {
      const page = await fetcher({ cursor, limit: PAGE_SIZE });
      setAnnouncements((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...page.announcements.filter((item) => !seen.has(item.id))];
      });
      setHasMore(page.hasMore);
      cursorRef.current = page.nextCursor;
    } catch (caught: unknown) {
      setError(getApiErrorMessage(caught, "Unable to load more announcements."));
    } finally {
      inFlightRef.current = false;
      setLoadingMore(false);
    }
  }, [fetcher]);

  const prepend = useCallback((announcement: AnnouncementRecord) => {
    setAnnouncements((current) => [announcement, ...current.filter((item) => item.id !== announcement.id)]);
    setLoaded(true);
    setError(null);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load("initial");
  }, [load]);

  return {
    announcements,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    /** False until the first page has arrived, so errors can tell "never loaded" from "stale". */
    loaded,
    reload: () => load("initial"),
    refresh: () => load("refresh"),
    loadMore,
    prepend,
  };
};

export type AnnouncementFeed = ReturnType<typeof useAnnouncementFeed>;
