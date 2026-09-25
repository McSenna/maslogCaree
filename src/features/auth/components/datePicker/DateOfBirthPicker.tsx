import { Platform } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import DateOfBirthBottomSheet from "./DateOfBirthBottomSheet";
import DateOfBirthModal from "./DateOfBirthModal";
import { useDateOfBirthDraft } from "./useDateOfBirthDraft";

type DateOfBirthPickerProps = {
  visible: boolean;
  value: string;
  onConfirm: (isoDate: string) => void;
  onClose: () => void;
};

const DateOfBirthPicker = ({ visible, value, onConfirm, onClose }: DateOfBirthPickerProps) => {
  const { isMobile } = useResponsive();
  const draft = useDateOfBirthDraft(value, visible);

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
