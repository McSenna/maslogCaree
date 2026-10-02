import { useCallback, useEffect, useRef, useState } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";

import { useUsersVersion } from "./usersVersion";

type RemoteDataOptions<T> = {
  /** Changing the key starts a new request; the newest request always wins. */
  key: string;
  load: () => Promise<T>;
  /** Combines the previous data with a new response (infinite scroll appends pages). */
  merge?: (previous: T | null, next: T) => T;
};

/** One server read with loading, refreshing and error states. Refetches when the users version changes. */
export const useRemoteData = <T,>({ key, load, merge }: RemoteDataOptions<T>) => {
  const version = useUsersVersion();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retry, setRetry] = useState(0);
  const sequence = useRef(0);
  const loadRef = useLatestRef(load);
  const mergeRef = useLatestRef(merge);

  useEffect(() => {
    const id = ++sequence.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    setIsFetching(true);
    loadRef
      .current()
      .then((next) => {
        if (id !== sequence.current) return;
        const combine = mergeRef.current;
        setData((previous) => (combine ? combine(previous, next) : next));
        setError(null);
      })
      .catch((caught: unknown) => {
        if (id === sequence.current) setError(caught);
      })
      .finally(() => {
        if (id !== sequence.current) return;
        setIsFetching(false);
        setIsRefreshing(false);
      });
  }, [key, version, retry, loadRef, mergeRef]);

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
