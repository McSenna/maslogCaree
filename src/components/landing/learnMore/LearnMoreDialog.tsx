import { useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

import LearnMoreBottomSheet from "./LearnMoreBottomSheet";
import LearnMoreModal from "./LearnMoreModal";

type LearnMoreDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const LearnMoreDialog = ({ visible, onClose }: LearnMoreDialogProps) => {
  const { width } = useWindowDimensions();

  return width >= BREAKPOINTS.tablet ? (
    <LearnMoreModal visible={visible} onClose={onClose} />
  ) : (
    <LearnMoreBottomSheet visible={visible} onClose={onClose} />
  );
};

export default LearnMoreDialog;
