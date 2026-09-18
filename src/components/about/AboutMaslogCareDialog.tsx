import { Platform } from "react-native";

import AboutMaslogCareBottomSheet from "./AboutMaslogCareBottomSheet";
import AboutMaslogCareModal from "./AboutMaslogCareModal";

type AboutMaslogCareDialogProps = {
  visible: boolean;
  onClose: () => void;
};

const AboutMaslogCareDialog = ({ visible, onClose }: AboutMaslogCareDialogProps) =>
  Platform.OS === "web" ? (
    <AboutMaslogCareModal visible={visible} onClose={onClose} />
  ) : (
    <AboutMaslogCareBottomSheet visible={visible} onClose={onClose} />
  );

export default AboutMaslogCareDialog;
