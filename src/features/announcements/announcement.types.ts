// Kept in step with ANNOUNCEMENT_AUDIENCES in backend/config/announcements.js.
export const ANNOUNCEMENT_AUDIENCES = ["Patients", "Staff", "Everyone"] as const;

export type Audience = (typeof ANNOUNCEMENT_AUDIENCES)[number];

export type AnnouncementRecord = {
  id: string;
  title: string;
  message: string;
  /** ISO timestamp of the event being announced. */
  eventAt: string;
  location: string;
  /** Older API responses omit these two. */
  audience?: Audience;
  /** ISO timestamp after which the announcement leaves the feed; null means it never ends. */
  expiresAt?: string | null;
  createdAt: string | null;
  /** Admin list only. */
  isDraft?: boolean;
  recipientCount?: number;
  postedBy?: string | null;
};

export type AnnouncementPage = {
  announcements: AnnouncementRecord[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type AnnouncementFormValues = {
  title: string;
  message: string;
  /** YYYY-MM-DD in the device's local calendar. */
  date: string;
  /** HH:MM, 24-hour. */
  time: string;
  location: string;
  audience: Audience;
  /** YYYY-MM-DD, or "" when the announcement never ends. */
  endDate: string;
  /** Save without notifying anyone. */
  isDraft: boolean;
};

export type AnnouncementFormField = keyof AnnouncementFormValues;

export type AnnouncementFormErrors = Partial<Record<AnnouncementFormField, string>>;

export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  eventAt: string;
  location: string;
  audience: Audience;
  expiresAt: string | null;
  isDraft: boolean;
};
