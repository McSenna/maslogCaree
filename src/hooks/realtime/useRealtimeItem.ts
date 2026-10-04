import { useCallback, useEffect, useRef, useState } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { defaultGetId, isStale } from "@/lib/realtime/collectionReducer";
import type { RealtimeRecordMap, RealtimeResource } from "@/types/realtime";
import { getApiErrorMessage, normalizeApiError, type NormalizedApiError } from "@/utils/apiErrorHandler";

import { useRealtimeEvents, useResyncSignal } from "./useRealtimeEvents";

export type RealtimeItemOptions<R extends RealtimeResource, T> = {
  /**
   * Turns a pushed row into this screen's shape. Give it only when the event
   * carries everything the screen shows (`(record) => record` when the shapes
   * match); without it, a change to this record reloads it through `fetchFn`,
   * which is right for detail views richer than their list row.
   */
  toItem?: (record: RealtimeRecordMap[R]) => T;
  enabled?: boolean;
  errorMessage?: string;
  /** Which load failures mean "this record no longer exists". Default: HTTP 404. */
  isGone?: (error: NormalizedApiError) => boolean;
};

const isNotFound = (error: NormalizedApiError) => error.status === 404;

// Everything is stored against the id it belongs to, so switching records can
// never show the previous one's data, not even for a frame.
type Slot<T> = { id: string; item: T | null; error: string | null; deleted: boolean; settled: boolean };

const emptySlot = <T,>(id: string): Slot<T> => ({ id, item: null, error: null, deleted: false, settled: false });

/**
 * One record for a detail view, kept current. When the record is deleted, or a
 * reload finds it gone (404), `deleted` turns true and the last copy stays in
 * `item`, so the screen can say so instead of going blank mid-read.
 */
export const useRealtimeItem = <R extends RealtimeResource, T>(
  resource: R,
  id: string | null,
  fetchFn: (id: string) => Promise<T>,
  { toItem, enabled = true, errorMessage = "Unable to load this record.", isGone = isNotFound }: RealtimeItemOptions<R, T> = {}
) => {
  const [slot, setSlot] = useState<Slot<T> | null>(null);
  const [reloading, setReloading] = useState(false);
  const fetchRef = useLatestRef(fetchFn);
  const toItemRef = useLatestRef(toItem);
  const isGoneRef = useLatestRef(isGone);
  const sequence = useRef(0);
  const loadStartedAt = useRef(0);
  const active = enabled && id !== null;

  const update = useCallback(
    (forId: string, patch: Partial<Slot<T>>) =>
      setSlot((current) => ({ ...(current?.id === forId ? current : emptySlot<T>(forId)), ...patch })),
    []
  );

  const load = useCallback(
    async (forId: string, showSpinner: boolean) => {
      const current = ++sequence.current;
      loadStartedAt.current = Date.now();
      if (showSpinner) setReloading(true);
      try {
        const next = await fetchRef.current(forId);
        if (current === sequence.current) update(forId, { item: next, error: null, deleted: false, settled: true });
      } catch (caught: unknown) {
        if (current !== sequence.current) return;
        if (isGoneRef.current(normalizeApiError(caught))) update(forId, { deleted: true, settled: true });
        else update(forId, { error: getApiErrorMessage(caught, errorMessage), settled: true });
      } finally {
        if (current === sequence.current) setReloading(false);
      }
    },
    [errorMessage, fetchRef, isGoneRef, update]
  );

  useEffect(() => {
    if (!active || id === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load(id, false);
    // A late answer for this id must not land after the screen moved on.
    return () => {
      sequence.current += 1;
    };
  }, [active, id, load]);

  useRealtimeEvents(
    resource,
    (change) => {
      if (id === null) return;
      if (change.action === "resync") return void load(id, false);
      if (change.action === "deleted") {
        if (change.id === id) update(id, { deleted: true, settled: true });
        return;
      }
      if (defaultGetId(change.record) !== id) return;
      const convert = toItemRef.current;
      if (!convert) return void load(id, false);
      const next = convert(change.record);
      setSlot((current) =>
        current?.id === id && current.item !== null && isStale(current.item, next) ? current : { ...emptySlot<T>(id), item: next, settled: true }
      );
    },
    active
  );

  useResyncSignal((at) => {
    if (id !== null && loadStartedAt.current < at) void load(id, false);
  }, active);

  const reload = useCallback(() => {
    if (id !== null) void load(id, true);
  }, [id, load]);

  /** Applies this device's own change at once (a sent reply); the server's newer echo then replaces it. */
  const mutate = useCallback(
    (change: (current: T) => T) => {
      if (id === null) return;
      setSlot((current) => (current?.id === id && current.item !== null ? { ...current, item: change(current.item) } : current));
    },
    [id]
  );

  const own = active && slot?.id === id ? slot : null;
  return {
    item: own?.item ?? null,
    error: own?.error ?? null,
    deleted: own?.deleted ?? false,
    loading: active && (!own?.settled || reloading),
    reload,
    mutate,
  };
};
