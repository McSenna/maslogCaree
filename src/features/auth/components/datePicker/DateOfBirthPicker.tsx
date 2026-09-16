import { useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

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
  const { width } = useWindowDimensions();
  const draft = useDateOfBirthDraft(value, visible);

  const handleConfirm = () => {
    if (!draft.selected) return;
    onConfirm(draft.selected);
    onClose();
  };

  const shared = { visible, draft, onCancel: onClose, onConfirm: handleConfirm };

  return width >= BREAKPOINTS.tablet ? (
    <DateOfBirthModal {...shared} />
  ) : (
    <DateOfBirthBottomSheet {...shared} />
  );
};

export default DateOfBirthPicker;
