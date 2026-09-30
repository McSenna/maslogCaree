/**
 * Starting values for the announcement form. Import-free so `node --test`
 * can load it.
 */
import type { AnnouncementFormValues, Audience } from "./announcement.types.ts";
import type { AnnouncementBaseline } from "./announcementRules.ts";
import { toClock, toDateKey } from "./announcementDates.ts";

export const EMPTY_FORM_VALUES: AnnouncementFormValues = {
  title: "",
  message: "",
  date: "",
  time: "",
  location: "",
  audience: "Everyone",
  endDate: "",
  isDraft: false,
};

/** The stored fields an edit needs, whichever screen shape they arrive in. */
export type EditableAnnouncement = {
  id: string;
  title: string;
  body: string;
  eventAt: string;
  location: string;
  audience: Audience;
  expiresAt: string | null;
  isDraft: boolean;
};

export const toFormValues = (item: EditableAnnouncement): AnnouncementFormValues => {
  const event = new Date(item.eventAt);
  const end = item.expiresAt ? new Date(item.expiresAt) : null;
  return {
    title: item.title,
    message: item.body,
    date: toDateKey(event),
    time: toClock(event),
    location: item.location,
    audience: item.audience,
    endDate: end ? toDateKey(end) : "",
    isDraft: item.isDraft,
  };
};

export const toBaseline = (values: AnnouncementFormValues): AnnouncementBaseline => ({
  date: values.date,
  time: values.time,
  endDate: values.endDate,
});
