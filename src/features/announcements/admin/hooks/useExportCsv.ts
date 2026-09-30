import { useCallback } from "react";

import { toast } from "@/components/feedback";

import type { Announcement } from "../adminAnnouncement.types";
import { buildAnnouncementsCsv, csvFileName } from "../announcementCsv";
import { exportAnnouncementsCsv } from "../services/exportAnnouncementsCsv";

/** Exports the rows currently shown, so the file matches the search and filters on screen. */
export const useExportCsv = (rows: readonly Announcement[]) =>
  useCallback(async () => {
    try {
      await exportAnnouncementsCsv(buildAnnouncementsCsv(rows), csvFileName());
    } catch {
      toast.error("Could not export announcements.", "Try again in a moment.");
    }
  }, [rows]);
