import { Platform } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import DateOfBirthBottomSheet from "./DateOfBirthBottomSheet";
import DateOfBirthModal from "./DateOfBirthModal";
import { useDateOfBirthDraft, type CalendarStart } from "./useDateOfBirthDraft";

type DateOfBirthPickerProps = {
  visible: boolean;
  value: string;
  onConfirm: (isoDate: string) => void;
  onClose: () => void;
  opensAt?: CalendarStart;
};

const DateOfBirthPicker = ({ visible, value, onConfirm, onClose, opensAt }: DateOfBirthPickerProps) => {
  const { isMobile } = useResponsive();
  const draft = useDateOfBirthDraft(value, visible, opensAt);

  const handleConfirm = () => {
    if (!draft.selected) return;
    onConfirm(draft.selected);
    onClose();
  };

  const shared = { visible, draft, onCancel: onClose, onConfirm: handleConfirm };

  const isWebOrDesktop = Platform.OS === "web" || !isMobile;

  return isWebOrDesktop ? (
    <DateOfBirthModal {...shared} />
  ) : (
    <DateOfBirthBottomSheet {...shared} />
  );
};

export default DateOfBirthPicker;
