import { useCallback, useEffect, useRef, useState } from "react";

import { toastError } from "@/utils/errorToast/toastError";
import { useRealtimeEvents, useResyncSignal } from "@/hooks/realtime/useRealtimeEvents";

import type { AnnouncementRecord } from "../../announcement.types";
import {
  deleteAnnouncement as deleteAnnouncementRequest,
  fetchAllAdminAnnouncements,
} from "../../services/announcementService";
import type { Announcement } from "../adminAnnouncement.types";
import { toAdminAnnouncement } from "../adminAnnouncementModel";

type LoadMode = "initial" | "refresh" | "silent";

/** Every announcement for the admin screen, newest first. */
export const useAnnouncements = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const inFlightRef = useRef(false);
  const loadedRef = useRef(false);

  const load = useCallback(async (mode: LoadMode) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (mode === "initial") setIsLoading(true);
    else if (mode === "refresh") setIsRefreshing(true);

    try {
      const records = await fetchAllAdminAnnouncements();
      setItems(records.map(toAdminAnnouncement));
      setLastUpdatedAt(new Date().toISOString());
      setError(null);
      loadedRef.current = true;
    } catch (caught: unknown) {
      // A failed refresh keeps the list already on screen and says so.
      if (loadedRef.current) toastError("Could not refresh announcements.", caught, { reason: "Check your connection and try again." });
      else setError(caught);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refetch = useCallback(() => load(loadedRef.current ? "refresh" : "initial"), [load]);

  const deleteAnnouncement = useCallback(async (id: string) => {
    await deleteAnnouncementRequest(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  /** Puts a just-created or just-edited announcement in place without a refetch. */
  const upsert = useCallback((record: AnnouncementRecord) => {
    const next = toAdminAnnouncement(record);
    setItems((current) =>
      current.some((item) => item.id === next.id)
        ? current.map((item) => (item.id === next.id ? next : item))
        : [next, ...current]
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load("initial");
  }, [load]);

  // Another admin's post, edit or delete appears here without a refresh.
  useRealtimeEvents("adminAnnouncement", (change) => {
    if (change.action === "resync") return void load("silent");
    if (change.action === "deleted") setItems((current) => current.filter((item) => item.id !== change.id));
    else upsert(change.record);
  });
  useResyncSignal(() => void load(loadedRef.current ? "silent" : "initial"));

  return {
    items,
    isLoading,
    isRefreshing,
    /** Set only when the first load failed; a failed refresh keeps the old list. */
    error,
    refetch,
    deleteAnnouncement,
    lastUpdatedAt,
    upsert,
  };
};
