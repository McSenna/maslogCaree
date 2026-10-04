import { useCallback, useMemo, useState } from "react";

import type { Announcement, AudienceFilter, StatusFilter } from "../adminAnnouncement.types";
import {
  EMPTY_FILTERS,
  countByStatus,
  filterAnnouncements,
  hasActiveFilters,
  type AnnouncementFilters,
} from "../adminAnnouncementModel";
import { useAnnouncements } from "./useAnnouncements";
import { useUndoableAction } from "@/hooks/useUndoableAction";

/** Editor target: null is closed, "new" is create, an announcement is edit. */
export type EditorTarget = "new" | Announcement | null;

/** Which of the five screen states to draw. */
export type ScreenView = "loading" | "error" | "empty" | "noResults" | "list";

const resolveView = (isLoading: boolean, failed: boolean, total: number, shown: number): ScreenView => {
  if (isLoading) return "loading";
  if (failed) return "error";
  if (total === 0) return "empty";
  if (shown === 0) return "noResults";
  return "list";
};

const deletionFailedTitle = () => "Announcement not deleted";

/** Everything both layouts share; only the presentation differs between them. */
export const useAnnouncementsScreen = (openOnMount: boolean) => {
  const data = useAnnouncements();
  const { deleteAnnouncement } = data;
  const commitDelete = useCallback((item: Announcement) => deleteAnnouncement(item.id), [deleteAnnouncement]);
  const deletion = useUndoableAction(commitDelete, deletionFailedTitle);
  const [filters, setFilters] = useState<AnnouncementFilters>(EMPTY_FILTERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorTarget>(openOnMount ? "new" : null);

  const pendingId = deletion.pending?.id;
  // Status depends on the clock, so it is re-read whenever the list changes.
  const { present, visible, counts } = useMemo(() => {
    const now = new Date();
    const shown = pendingId ? data.items.filter((item) => item.id !== pendingId) : data.items;
    return {
      present: shown,
      visible: filterAnnouncements(shown, filters, now),
      counts: countByStatus(shown, now),
    };
  }, [data.items, pendingId, filters]);

  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), []);
  const setAudience = useCallback((audience: AudienceFilter) => setFilters((f) => ({ ...f, audience })), []);
  const setStatus = useCallback((status: StatusFilter) => setFilters((f) => ({ ...f, status })), []);
  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);
  const toggleExpanded = useCallback((id: string) => setExpandedId((current) => (current === id ? null : id)), []);

  const { request: requestDelete } = deletion;
  const remove = useCallback(
    (item: Announcement) => {
      setExpandedId((current) => (current === item.id ? null : current));
      requestDelete(item);
    },
    [requestDelete]
  );
  const toastMessage = deletion.toast ? "Announcement deleted." : null;

  const view = resolveView(data.isLoading, Boolean(data.error), present.length, visible.length);

  return {
    view,
    data,
    deletion,
    toastMessage,
    filters,
    setQuery,
    setAudience,
    setStatus,
    clearFilters,
    filtered: hasActiveFilters(filters),
    expandedId,
    toggleExpanded,
    remove,
    editor,
    openCreate: () => setEditor("new"),
    openEdit: (item: Announcement) => setEditor(item),
    closeEditor: () => setEditor(null),
    /** Items on screen before search and filters (minus a pending delete). */
    total: present.length,
    visible,
    counts,
  };
};

export type AnnouncementsScreenState = ReturnType<typeof useAnnouncementsScreen>;
