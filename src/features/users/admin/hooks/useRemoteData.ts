import { useCallback, useEffect, useRef, useState } from "react";

import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";
import { useLatestRef } from "@/hooks/useLatestRef";
import { toastBackgroundError } from "@/utils/errorToast/toastError";
import type { RealtimeResource } from "@/types/realtime";

import { useUsersVersion } from "./usersVersion";

const NO_LIVE_RESOURCES: readonly RealtimeResource[] = [];

type RemoteDataOptions<T> = {
  /** Changing the key starts a new request; the newest request always wins. */
  key: string;
  load: () => Promise<T>;
  /** Combines the previous data with a new response (infinite scroll appends pages). */
  merge?: (previous: T | null, next: T) => T;
  /** Realtime resources this view is built from: a change to any reloads it quietly, keeping the page. */
  live?: readonly RealtimeResource[];
  /**
   * How a quiet reload combines with appended pages. Appending would skip rows
   * already loaded, so updated copies would never show; this swaps them in.
   */
  liveMerge?: (previous: T | null, next: T) => T;
};

/** One server read with loading, refreshing and error states. Refetches when the users version changes. */
export const useRemoteData = <T,>({ key, load, merge, live = NO_LIVE_RESOURCES, liveMerge }: RemoteDataOptions<T>) => {
  const version = useUsersVersion();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retry, setRetry] = useState(0);
  const [liveTick, setLiveTick] = useState(0);
  const sequence = useRef(0);
  const liveReload = useRef(false);
  const loadRef = useLatestRef(load);
  const mergeRef = useLatestRef(merge);
  const liveMergeRef = useLatestRef(liveMerge);

  useEffect(() => {
    const id = ++sequence.current;
    const quiet = liveReload.current;
    liveReload.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    setIsFetching(true);
    loadRef
      .current()
      .then((next) => {
        if (id !== sequence.current) return;
        const append = mergeRef.current;
        const combine = append && quiet ? (liveMergeRef.current ?? append) : append;
        setData((previous) => (combine ? combine(previous, next) : next));
        setError(null);
      })
      .catch((caught: unknown) => {
        if (id !== sequence.current) return;
        // A failed quiet reload keeps what is on screen and says it may be behind; the next change or reconnect retries.
        if (quiet) toastBackgroundError("Page not updated", caught);
        else setError(caught);
      })
      .finally(() => {
        if (id !== sequence.current) return;
        setIsFetching(false);
        setIsRefreshing(false);
      });
  }, [key, version, retry, liveTick, loadRef, mergeRef, liveMergeRef]);

  useRealtimeRefetch(
    live,
    () => {
      liveReload.current = true;
      setLiveTick((tick) => tick + 1);
    },
    { enabled: live.length > 0 }
  );

  const refetch = useCallback(() => {
    setIsRefreshing(true);
    setRetry((count) => count + 1);
  }, []);

  return {
    data,
    error,
    /** First load only: nothing to show yet. */
    isLoading: isFetching && data === null,
    isFetching,
    isRefreshing,
    refetch,
  };
};
