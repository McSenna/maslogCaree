import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";

import type { Announcement } from "../adminAnnouncement.types";

export const UNDO_WINDOW_MS = 6000;

export type DeleteToast = "deleted" | "failed" | null;

type TimerRef = RefObject<ReturnType<typeof setTimeout> | null>;

const stopTimer = (timerRef: TimerRef) => {
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = null;
};

/**
 * Delete with undo: the row hides at once, and the request is only sent when
 * the toast is dismissed or its six seconds run out. A failed request brings
 * the row back and says so.
 */
export const useUndoDelete = (commit: (id: string) => Promise<void>) => {
  const [pendingDelete, setPendingDelete] = useState<Announcement | null>(null);
  const [toastKind, setToastKind] = useState<DeleteToast>(null);
  const pendingRef = useRef<Announcement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitRef = useLatestRef(commit);

  const send = useCallback(async () => {
    stopTimer(timerRef);
    const item = pendingRef.current;
    if (!item) return;
    pendingRef.current = null;
    setToastKind((kind) => (kind === "deleted" ? null : kind));

    try {
      await commitRef.current(item.id);
    } catch {
      setToastKind("failed");
    } finally {
      // Success removed it from the list; failure puts it back. Either way it is no longer pending.
      setPendingDelete((current) => (current?.id === item.id ? null : current));
    }
  }, [commitRef]);

  const requestDelete = useCallback(
    (item: Announcement) => {
      // Only one delete waits at a time; a second one sends the first.
      if (pendingRef.current) void send();
      pendingRef.current = item;
      setPendingDelete(item);
      setToastKind("deleted");
      timerRef.current = setTimeout(() => void send(), UNDO_WINDOW_MS);
    },
    [send]
  );

  const undo = useCallback(() => {
    stopTimer(timerRef);
    pendingRef.current = null;
    setPendingDelete(null);
    setToastKind(null);
  }, []);

  const dismiss = useCallback(() => {
    if (pendingRef.current) void send();
    else setToastKind(null);
  }, [send]);

  // The failure notice clears itself on the same clock.
  useEffect(() => {
    if (toastKind !== "failed") return;
    const timer = setTimeout(() => setToastKind(null), UNDO_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [toastKind]);

  // Leaving the screen is not an undo: send what is still waiting.
  useEffect(
    () => () => {
      stopTimer(timerRef);
      const item = pendingRef.current;
      pendingRef.current = null;
      if (item) void commitRef.current(item.id).catch(() => undefined);
    },
    [commitRef]
  );

  return { pendingDelete, toastKind, requestDelete, undo, dismiss };
};
