export type AnnouncementRecord = {
  id: string;
  title: string;
  message: string;
  /** ISO timestamp of the event being announced. */
  eventAt: string;
  location: string;
  createdAt: string | null;
  /** Admin list only. */
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
};

export type AnnouncementFormField = keyof AnnouncementFormValues;

export type AnnouncementFormErrors = Partial<Record<AnnouncementFormField, string>>;

export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  eventAt: string;
  location: string;
};
