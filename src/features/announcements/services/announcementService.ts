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
