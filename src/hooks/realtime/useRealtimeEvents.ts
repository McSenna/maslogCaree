import { useEffect } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { onResync, subscribeToResource } from "@/lib/realtime/realtimeBus";
import type { RealtimeChange, RealtimeRecordMap, RealtimeResource } from "@/types/realtime";

/**
 * Calls `handler` for every change to `resource` while mounted. The handler can
 * change on every render without re-subscribing; listeners are removed on unmount.
 */
export const useRealtimeEvents = <R extends RealtimeResource>(
  resource: R,
  handler: (change: RealtimeChange<RealtimeRecordMap[R]>) => void,
  enabled = true
): void => {
  const handlerRef = useLatestRef(handler);

  useEffect(() => {
    if (!enabled) return;
    return subscribeToResource(resource, (change) => handlerRef.current(change));
  }, [resource, enabled, handlerRef]);
};

/** Calls `handler(at)` when the device should reload what it shows (reconnect, foreground, server request). */
export const useResyncSignal = (handler: (at: number) => void, enabled = true): void => {
  const handlerRef = useLatestRef(handler);

  useEffect(() => {
    if (!enabled) return;
    return onResync((at) => handlerRef.current(at));
  }, [enabled, handlerRef]);
};
