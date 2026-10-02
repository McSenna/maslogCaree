import { useCallback, useEffect, useRef, useState } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";

export const UNDO_WINDOW_MS = 6000;

export type UndoToastState<T> = { kind: "pending"; item: T } | { kind: "failed" } | null;

/**
 * An action the user can take back. The screen applies it at once (hiding a
 * row, changing a status); `commit` is only called when the toast is
 * dismissed or its six seconds run out, and a rejected commit shows the
 * failure notice so the screen can put things back.
 *
 * Knows nothing about what `T` is: the caller owns the API call and how the
 * pending item changes what is on screen.
 */
export const useUndoableAction = <T,>(commit: (item: T) => Promise<void>) => {
  const [pending, setPending] = useState<T | null>(null);
  const [toast, setToast] = useState<UndoToastState<T>>(null);
  const pendingRef = useRef<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitRef = useLatestRef(commit);

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const send = useCallback(async () => {
    stopTimer();
    const item = pendingRef.current;
    if (item === null) return;
    // Cleared before awaiting, so a second dismiss or the timer cannot send it twice.
    pendingRef.current = null;
    setToast((current) => (current?.kind === "pending" ? null : current));

    try {
      await commitRef.current(item);
    } catch {
      setToast({ kind: "failed" });
    } finally {
      setPending((current) => (current === item ? null : current));
    }
  }, [commitRef]);

  const request = useCallback(
    (item: T) => {
      // One action waits at a time; starting another sends the first.
      if (pendingRef.current !== null) void send();
      pendingRef.current = item;
      setPending(item);
      setToast({ kind: "pending", item });
      timerRef.current = setTimeout(() => void send(), UNDO_WINDOW_MS);
    },
    [send]
  );

  const undo = useCallback(() => {
    stopTimer();
    pendingRef.current = null;
    setPending(null);
    setToast(null);
  }, []);

  const dismiss = useCallback(() => {
    if (pendingRef.current !== null) void send();
    else setToast(null);
  }, [send]);

  // The failure notice clears itself on the same clock.
  useEffect(() => {
    if (toast?.kind !== "failed") return;
    const timer = setTimeout(() => setToast(null), UNDO_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  // Leaving the screen is not an undo: send what is still waiting, without touching state.
  useEffect(
    () => () => {
      stopTimer();
      const item = pendingRef.current;
      pendingRef.current = null;
      if (item !== null) void commitRef.current(item).catch(() => undefined);
    },
    [commitRef]
  );

  return { pending, toast, request, undo, dismiss };
};
