import { useCallback, useEffect, useRef, useState } from "react";

import { dismissToast, showToast } from "@/components/feedback";
import { useLatestRef } from "@/hooks/useLatestRef";
import { toastError } from "@/utils/errorToast/toastError";

export const UNDO_WINDOW_MS = 6000;

type UndoableOptions<T> = {
  /** What the toast says while the action can be taken back, e.g. "Announcement deleted." */
  message: (item: T) => string;
  /** The error toast's title when the commit fails. */
  failureTitle: (item: T) => string;
  /** Screen-reader name for Undo, e.g. "Undo delete". */
  undoLabel?: string;
};

/**
 * Holds an action back for the undo window, announced through the app toast
 * with an Undo button. The toast closes the moment the action is sent, so Undo
 * is never offered once it can no longer take anything back.
 */
export const useUndoableAction = <T,>(commit: (item: T) => Promise<void>, options: UndoableOptions<T>) => {
  const [pending, setPending] = useState<T | null>(null);
  const pendingRef = useRef<T | null>(null);
  const toastIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitRef = useLatestRef(commit);
  const optionsRef = useLatestRef(options);

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const closeToast = () => {
    if (toastIdRef.current !== null) dismissToast(toastIdRef.current);
    toastIdRef.current = null;
  };

  const send = useCallback(async () => {
    stopTimer();
    const item = pendingRef.current;
    if (item === null) return;
    // Cleared before awaiting, so the timer or a newer action cannot send it twice.
    pendingRef.current = null;
    closeToast();

    try {
      await commitRef.current(item);
    } catch (error: unknown) {
      toastError(optionsRef.current.failureTitle(item), error);
    } finally {
      setPending((current) => (current === item ? null : current));
    }
  }, [commitRef, optionsRef]);

  const undo = useCallback(() => {
    stopTimer();
    pendingRef.current = null;
    closeToast();
    setPending(null);
  }, []);

  const request = useCallback(
    (item: T) => {
      // One action waits at a time; starting another sends the first (and closes its toast) before the new toast shows.
      if (pendingRef.current !== null) void send();
      pendingRef.current = item;
      setPending(item);
      const { message, undoLabel = "Undo" } = optionsRef.current;
      toastIdRef.current = showToast("success", message(item), {
        action: { label: "Undo", accessibilityLabel: undoLabel, onPress: undo },
        durationMs: UNDO_WINDOW_MS,
      });
      timerRef.current = setTimeout(() => void send(), UNDO_WINDOW_MS);
    },
    [send, undo, optionsRef]
  );

  // Leaving the screen sends a waiting action; its Undo must not follow the user elsewhere.
  useEffect(
    () => () => {
      stopTimer();
      closeToast();
      const item = pendingRef.current;
      pendingRef.current = null;
      if (item !== null) void commitRef.current(item).catch((error: unknown) => toastError(optionsRef.current.failureTitle(item), error));
    },
    [commitRef, optionsRef]
  );

  return { pending, request, undo };
};
