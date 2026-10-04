import { useCallback, useEffect, useRef, useState } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { toastError } from "@/utils/errorToast/toastError";

export const UNDO_WINDOW_MS = 6000;

export type UndoToastState<T> = { kind: "pending"; item: T } | null;

export const useUndoableAction = <T,>(commit: (item: T) => Promise<void>, failureTitle: (item: T) => string) => {
  const [pending, setPending] = useState<T | null>(null);
  const [toast, setToast] = useState<UndoToastState<T>>(null);
  const pendingRef = useRef<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitRef = useLatestRef(commit);
  const failureTitleRef = useLatestRef(failureTitle);

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
    setToast(null);

    try {
      await commitRef.current(item);
    } catch (error: unknown) {
      toastError(failureTitleRef.current(item), error);
    } finally {
      setPending((current) => (current === item ? null : current));
    }
  }, [commitRef, failureTitleRef]);

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

  useEffect(
    () => () => {
      stopTimer();
      const item = pendingRef.current;
      pendingRef.current = null;
      if (item !== null) void commitRef.current(item).catch((error: unknown) => toastError(failureTitleRef.current(item), error));
    },
    [commitRef, failureTitleRef]
  );

  return { pending, toast, request, undo, dismiss };
};
