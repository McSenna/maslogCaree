import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { type CollectionOptions, defaultGetId, removeItem, upsertItem } from "@/lib/realtime/collectionReducer";
import type { RealtimeChange, RealtimeRecordMap, RealtimeResource } from "@/types/realtime";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import { useRealtimeEvents, useResyncSignal } from "./useRealtimeEvents";

type LoadMode = "initial" | "refresh" | "silent";

export type RealtimeCollectionOptions<T> = Partial<CollectionOptions<T>> & {
  enabled?: boolean;
  /** Shown when the first load fails; must say what failed in plain words. */
  errorMessage?: string;
};

const applyChange = <T,>(items: T[], change: RealtimeChange<T>, options: CollectionOptions<T>): T[] => {
  if (change.action === "deleted") return removeItem(items, change.id, options.getId);
  if (change.action === "resync") return items;
  return upsertItem(items, change.record, options);
};

/**
 * A list loaded from REST and kept current by `<resource>:created/updated/deleted`.
 * `fetchFn` must be stable (useCallback); a new one reloads the list.
 *
 * Events that land while a load is in flight are replayed onto its result, so
 * a change made between the server's read and the response is never lost. The
 * list reloads on reconnect, on return to the foreground, and on a server resync.
 */
export const useRealtimeCollection = <R extends RealtimeResource>(
  resource: R,
  fetchFn: () => Promise<RealtimeRecordMap[R][]>,
  options: RealtimeCollectionOptions<RealtimeRecordMap[R]> = {}
) => {
  type T = RealtimeRecordMap[R];
  const { enabled = true, errorMessage = "Unable to load this list.", getId = defaultGetId, accept, sort } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const reducerOptions = useLatestRef<CollectionOptions<T>>({ getId, accept, sort });
  const loadSequence = useRef(0);
  const loadStartedAt = useRef(0);
  const replayBuffer = useRef<RealtimeChange<T>[] | null>(null);
  const mounted = useRef(true);

  const load = useCallback(
    async (mode: LoadMode) => {
      const sequence = ++loadSequence.current;
      loadStartedAt.current = Date.now();
      replayBuffer.current = [];
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      try {
        const rows = await fetchFn();
        if (!mounted.current || sequence !== loadSequence.current) return;
        const pending = replayBuffer.current ?? [];
        const sorted = reducerOptions.current.sort ? [...rows].sort(reducerOptions.current.sort) : rows;
        setItems(pending.reduce((list, change) => applyChange(list, change, reducerOptions.current), sorted));
        setError(null);
        setLastSyncedAt(Date.now());
      } catch (caught: unknown) {
        if (!mounted.current || sequence !== loadSequence.current) return;
        setError(getApiErrorMessage(caught, errorMessage));
      } finally {
        if (mounted.current && sequence === loadSequence.current) {
          replayBuffer.current = null;
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [fetchFn, errorMessage, reducerOptions]
  );

  useEffect(() => {
    mounted.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    if (enabled) void load("initial");
    return () => {
      mounted.current = false;
    };
  }, [enabled, load]);

  useRealtimeEvents(
    resource,
    (change) => {
      if (change.action === "resync") return void load("silent");
      replayBuffer.current?.push(change);
      setItems((current) => applyChange(current, change, reducerOptions.current));
    },
    enabled
  );

  // Reload only if this list's last load began before the device (re)connected:
  // anything that changed in between was never delivered.
  useResyncSignal((at) => {
    if (loadStartedAt.current < at) void load("silent");
  }, enabled);

  /** Applies this device's own write at once; the server's echo is then ignored as a duplicate. */
  const applyLocal = useCallback(
    (record: T) => setItems((current) => upsertItem(current, record, reducerOptions.current)),
    [reducerOptions]
  );

  const removeLocal = useCallback(
    (id: string) => setItems((current) => removeItem(current, id, reducerOptions.current.getId)),
    [reducerOptions]
  );

  const refresh = useCallback(() => load("refresh"), [load]);
  const revalidate = useCallback(() => load("silent"), [load]);

  return useMemo(
    () => ({ items, loading, refreshing, error, lastSyncedAt, refresh, revalidate, applyLocal, removeLocal }),
    [items, loading, refreshing, error, lastSyncedAt, refresh, revalidate, applyLocal, removeLocal]
  );
};
