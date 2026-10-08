import { useCallback, useEffect, useRef } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { createReloadScheduler, type ReloadScheduler } from "@/lib/realtime/reloadScheduler";
import type { RealtimeChange, RealtimeRecordMap, RealtimeResource } from "@/types/realtime";

import { useRealtimeEvents, useResyncSignal } from "./useRealtimeEvents";

const DEFAULT_INTERVAL_MS = 300;

type Options<R extends RealtimeResource> = {
  /** Applies the pushed record to rows already on screen, at once. */
  patch?: (change: Exclude<RealtimeChange<RealtimeRecordMap[R]>, { action: "resync" }>) => void;
  /**
   * Reloads the page on screen without a skeleton; fixes counts, order and
   * filter membership. Return its promise so the next reload waits for it.
   */
  reload: () => Promise<unknown> | void;
  enabled?: boolean;
  intervalMs?: number;
};

/**
 * For server-paged, filtered tables. A pushed record updates the matching row
 * immediately, then a quiet reload of the current page brings totals, tabs and
 * ordering in line with the server, without moving the user off the page they
 * are on. The reload starts on the first change and runs at most once per
 * `intervalMs` while changes keep coming (see reloadScheduler): a trailing
 * debounce here held counts and new rows back until the feed went quiet.
 */
export const useRealtimePagedList = <R extends RealtimeResource>(
  resource: R,
  { patch, reload, enabled = true, intervalMs = DEFAULT_INTERVAL_MS }: Options<R>
): void => {
  const reloadRef = useLatestRef(reload);
  const scheduler = useRef<ReloadScheduler | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const next = createReloadScheduler(() => reloadRef.current(), { intervalMs });
    scheduler.current = next;
    return () => {
      next.cancel();
      if (scheduler.current === next) scheduler.current = null;
    };
  }, [enabled, intervalMs, reloadRef]);

  const schedule = useCallback(() => scheduler.current?.request(), []);

  useRealtimeEvents(
    resource,
    (change) => {
      if (change.action !== "resync") patch?.(change);
      schedule();
    },
    enabled
  );

  useResyncSignal(schedule, enabled);
};
