import api from "@/services/api";

import type {
  AnnouncementPage,
  AnnouncementRecord,
  CreateAnnouncementPayload,
} from "../announcement.types";

type AnnouncementPageResponse = {
  success: boolean;
  announcements?: AnnouncementRecord[];
  hasMore?: boolean;
  nextCursor?: string | null;
};

type AnnouncementResponse = {
  success: boolean;
  message?: string;
  announcement: AnnouncementRecord;
};

export type AnnouncementPageParams = { cursor?: string | null; limit?: number };

export type AnnouncementFetcher = (params?: AnnouncementPageParams) => Promise<AnnouncementPage>;

const fetchPage = async (path: string, params?: AnnouncementPageParams): Promise<AnnouncementPage> => {
  const { data } = await api.get<AnnouncementPageResponse>(path, {
    params: {
      ...(params?.cursor ? { cursor: params.cursor } : null),
      ...(params?.limit ? { limit: params.limit } : null),
    },
  });

  return {
    announcements: data.announcements ?? [],
    hasMore: Boolean(data.hasMore),
    nextCursor: data.nextCursor ?? null,
  };
};

/** Shared feed any signed-in account can read. */
export const fetchAnnouncements: AnnouncementFetcher = (params) => fetchPage("/announcements", params);

/** Same feed plus author and recipient count; admin only. */
export const fetchAdminAnnouncements: AnnouncementFetcher = (params) =>
  fetchPage("/admin/announcements", params);

/** One announcement from the shared feed; a removed one rejects with ANNOUNCEMENT_NOT_FOUND. */
export const fetchAnnouncement = async (id: string): Promise<AnnouncementRecord> => {
  const { data } = await api.get<AnnouncementResponse>(`/announcements/${encodeURIComponent(id)}`);
  return data.announcement;
};

export const createAnnouncement = async (
  payload: CreateAnnouncementPayload
): Promise<AnnouncementRecord> => {
  const { data } = await api.post<AnnouncementResponse>("/admin/announcements", payload);
  return data.announcement;
};

export const updateAnnouncement = async (
  id: string,
  payload: CreateAnnouncementPayload
): Promise<AnnouncementRecord> => {
  const { data } = await api.patch<AnnouncementResponse>(
    `/admin/announcements/${encodeURIComponent(id)}`,
    payload
  );
  return data.announcement;
};

/** Removes the announcement and the inbox alerts that point at it; admin only. */
export const deleteAnnouncement = async (id: string): Promise<void> => {
  await api.delete(`/admin/announcements/${encodeURIComponent(id)}`);
};

// A barangay posts a few announcements a week, so the admin screen loads every
// page up front: tab counts and search then cover the whole list, not one page.
const ADMIN_PAGE_LIMIT = 50;
const ADMIN_MAX_PAGES = 40;

export const fetchAllAdminAnnouncements = async (): Promise<AnnouncementRecord[]> => {
  const all: AnnouncementRecord[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < ADMIN_MAX_PAGES; page += 1) {
    const result = await fetchAdminAnnouncements({ cursor, limit: ADMIN_PAGE_LIMIT });
    all.push(...result.announcements);
    if (!result.hasMore || !result.nextCursor) break;
    cursor = result.nextCursor;
  }

  return all;
};
