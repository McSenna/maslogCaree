export type AnnouncementDateTimeFieldsProps = {
  date: string;
  time: string;
  onChangeDate: (value: string) => void;
  onChangeTime: (value: string) => void;
  dateError?: string;
  timeError?: string;
  disabled?: boolean;
  /** Stack the two fields vertically (phone width). */
  stacked?: boolean;
};
