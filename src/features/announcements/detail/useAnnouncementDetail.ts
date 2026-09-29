import { useCallback, useEffect, useState } from "react";

import { ERROR_CODES } from "@/utils/errorCodes";
import { normalizeApiError } from "@/utils/apiErrorHandler";

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

/** Loads one announcement for the detail dialog; the dialog remounts per request. */
export const useAnnouncementDetail = (announcementId: string | null) => {
  const [state, setState] = useState<AnnouncementDetailState>(
    announcementId ? { status: "loading" } : { status: "missing" }
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!announcementId) return;
    let active = true;

    fetchAnnouncement(announcementId)
      .then((announcement) => {
        if (!active) return;
        setState(isUsable(announcement) ? { status: "ready", announcement } : { status: "missing" });
      })
      .catch((caught: unknown) => {
        if (!active) return;
        const error = normalizeApiError(caught);
        const gone =
          error.status === 404 ||
          error.code === ERROR_CODES.ANNOUNCEMENT_NOT_FOUND ||
          error.code === ERROR_CODES.INVALID_ID;
        setState(gone ? { status: "missing" } : { status: "error", message: error.message });
      });

    return () => {
      active = false;
    };
  }, [announcementId, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  return { state, retry };
};
