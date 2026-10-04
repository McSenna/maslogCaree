import { Platform } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import DateOfBirthBottomSheet from "./DateOfBirthBottomSheet";
import DateOfBirthModal from "./DateOfBirthModal";
import type { DateBounds } from "./calendarBounds";
import { useDateOfBirthDraft, type CalendarStart } from "./useDateOfBirthDraft";

type DateOfBirthPickerProps = {
  visible: boolean;
  value: string;
  onConfirm: (isoDate: string) => void;
  onClose: () => void;
  opensAt?: CalendarStart;
  /** Heading for other dates, such as a visit date; birth dates keep the default. */
  title?: string;
  /** What the confirm button is announced as. */
  confirmLabel?: string;
  /** Days on offer; left out, today and earlier (a birth date). */
  bounds?: DateBounds;
};

const DateOfBirthPicker = ({
  visible,
  value,
  onConfirm,
  onClose,
  opensAt,
  title = "Select Date of Birth",
  confirmLabel = "Confirm date of birth",
  bounds,
}: DateOfBirthPickerProps) => {
  const { isMobile } = useResponsive();
  const draft = useDateOfBirthDraft(value, visible, opensAt, bounds);

  const handleConfirm = () => {
    if (!draft.selected) return;
    onConfirm(draft.selected);
    onClose();
  };

  const shared = { visible, draft, title, confirmLabel, onCancel: onClose, onConfirm: handleConfirm };

  const isWebOrDesktop = Platform.OS === "web" || !isMobile;

  return isWebOrDesktop ? (
    <DateOfBirthModal {...shared} />
  ) : (
    <DateOfBirthBottomSheet {...shared} />
  );
};

export default DateOfBirthPicker;
