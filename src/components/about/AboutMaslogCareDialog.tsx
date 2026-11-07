import { Platform } from "react-native";

import { useDialogPresentation } from "@/hooks/useDialogPresentation";

import AboutMaslogCareBottomSheet from "./AboutMaslogCareBottomSheet";
import AboutMaslogCareModal from "./AboutMaslogCareModal";

type AboutMaslogCareDialogProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * A bottom sheet at phone width (the shared breakpoint every dialog uses, so a
 * phone browser gets the same sheet as the app) and a centred modal from
 * tablet width on web. The native app always uses the sheet, as before.
 */
const AboutMaslogCareDialog = ({ visible, onClose }: AboutMaslogCareDialogProps) => {
  const presentation = useDialogPresentation();
  const useSheet = Platform.OS !== "web" || presentation === "sheet";
  return useSheet ? (
    <AboutMaslogCareBottomSheet visible={visible} onClose={onClose} />
  ) : (
    <AboutMaslogCareModal visible={visible} onClose={onClose} />
  );
};

export default AboutMaslogCareDialog;
