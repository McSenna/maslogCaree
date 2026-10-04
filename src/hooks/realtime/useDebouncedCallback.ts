import { useCallback, useEffect, useRef } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";

/**
 * A stable function that runs `callback` once, `delayMs` after the last call.
 * Realtime changes arrive in bursts (one mission edit re-slots many visits), and
 * a view needs one reload for the burst, not one per event.
 */
export const useDebouncedCallback = (callback: () => void, delayMs: number): (() => void) => {
  const callbackRef = useLatestRef(callback);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    },
    []
  );

  return useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      callbackRef.current();
    }, delayMs);
  }, [callbackRef, delayMs]);
};
