import type { RealtimeChange, RealtimeRecordMap, RealtimeResource } from "@/types/realtime";

import { useDebouncedCallback } from "./useDebouncedCallback";
import { useRealtimeEvents, useResyncSignal } from "./useRealtimeEvents";

const DEFAULT_DEBOUNCE_MS = 400;

type Options<R extends RealtimeResource> = {
  /** Applies the pushed record to rows already on screen, at once. */
  patch?: (change: Exclude<RealtimeChange<RealtimeRecordMap[R]>, { action: "resync" }>) => void;
  /** Reloads the page on screen without a skeleton; fixes counts, order and filter membership. */
  reload: () => void;
  enabled?: boolean;
  debounceMs?: number;
};

/**
 * For server-paged, filtered tables. A pushed record updates the matching row
 * immediately, then one quiet reload of the current page (per burst) brings
 * totals, tabs and ordering in line with the server, without moving the user
 * off the page they are on.
 */
export const useRealtimePagedList = <R extends RealtimeResource>(
  resource: R,
  { patch, reload, enabled = true, debounceMs = DEFAULT_DEBOUNCE_MS }: Options<R>
): void => {
  const schedule = useDebouncedCallback(reload, debounceMs);

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
