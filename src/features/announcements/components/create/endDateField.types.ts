export type AnnouncementEndDateFieldProps = {
  /** YYYY-MM-DD, or "" for no end date. */
  value: string;
  /** The event's YYYY-MM-DD; the end date cannot fall before it. */
  eventDate: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export const END_DATE_LABEL = "Show until (optional)";
export const END_DATE_HELPER = "Leave empty to keep it up until you delete it.";
