import { useMemo } from "react";

import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";
import type { NormalizedApiError } from "@/utils/apiErrorHandler";
import { ERROR_CODES } from "@/utils/errorCodes";

import type { AnnouncementRecord } from "../announcement.types";
import { fetchAnnouncement } from "../services/announcementService";

export type AnnouncementDetailState =
  | { status: "loading" }
  | { status: "ready"; announcement: AnnouncementRecord }
  /** Removed, never linked, or the id is not one the API accepts. */
  | { status: "missing" }
  | { status: "error"; message: string };

const isUsable = (value: unknown): value is AnnouncementRecord => {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<AnnouncementRecord>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.message === "string" &&
    typeof record.location === "string" &&
    typeof record.eventAt === "string"
  );
};

const isGone = (error: NormalizedApiError) =>
  error.status === 404 || error.code === ERROR_CODES.ANNOUNCEMENT_NOT_FOUND || error.code === ERROR_CODES.INVALID_ID;

const asRecord = (record: AnnouncementRecord) => record;

/**
 * Loads one announcement for the detail dialog and keeps it current: an edit
 * shows at once, and one withdrawn while open turns into the "missing" state.
 */
export const useAnnouncementDetail = (announcementId: string | null) => {
  const { item, loading, error, deleted, reload } = useRealtimeItem("announcement", announcementId, fetchAnnouncement, {
    toItem: asRecord,
    isGone,
  });

  const state = useMemo<AnnouncementDetailState>(() => {
    if (!announcementId || deleted) return { status: "missing" };
    if (loading && !item) return { status: "loading" };
    if (error && !item) return { status: "error", message: error };
    return isUsable(item) ? { status: "ready", announcement: item } : { status: "missing" };
  }, [announcementId, deleted, loading, item, error]);

  return { state, retry: reload };
};
