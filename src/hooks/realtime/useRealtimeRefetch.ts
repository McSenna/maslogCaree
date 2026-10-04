import { useEffect, useMemo } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { onResync, subscribeToResource } from "@/lib/realtime/realtimeBus";
import { createReloadScheduler } from "@/lib/realtime/reloadScheduler";
import type { RealtimeResource } from "@/types/realtime";

const DEFAULT_INTERVAL_MS = 300;

type Options = { enabled?: boolean; intervalMs?: number };

/**
 * For views the server computes (queues, dashboards, summary cards). Any change
 * to the listed resources reloads the view through its own REST call, so
 * order, counts and totals stay exactly right. The first change reloads at
 * once; while changes keep coming the view reloads at most once per
 * `intervalMs`, one reload at a time, and always once after the last change.
 * `refetch` should reload quietly, without a skeleton, and return its promise
 * so the next reload waits for it. Lists that can patch rows use
 * useRealtimeCollection or useRealtimePagedList instead.
 */
export const useRealtimeRefetch = (
  resources: readonly RealtimeResource[],
  refetch: () => Promise<unknown> | void,
  { enabled = true, intervalMs = DEFAULT_INTERVAL_MS }: Options = {}
): void => {
  const refetchRef = useLatestRef(refetch);
  const resourceKey = resources.join(",");
  const watched = useMemo(() => resourceKey.split(",") as RealtimeResource[], [resourceKey]);

  useEffect(() => {
    if (!enabled) return;
    const scheduler = createReloadScheduler(() => refetchRef.current(), { intervalMs });
    const unsubscribers = [
      ...watched.map((resource) => subscribeToResource(resource, scheduler.request)),
      onResync(scheduler.request),
    ];
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      scheduler.cancel();
    };
  }, [watched, enabled, intervalMs, refetchRef]);
};
