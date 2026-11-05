import type { Ref } from "react";

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
  /** Web only: the browser inputs can take focus and report leaving. Native pickers report on choosing. */
  dateInputRef?: Ref<HTMLInputElement>;
  timeInputRef?: Ref<HTMLInputElement>;
  onBlurDate?: () => void;
  onBlurTime?: () => void;
};
