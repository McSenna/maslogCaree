import { Platform } from "react-native";

import { useResponsive } from "@/hooks/useResponsive";

import { ChangePasswordModal } from "./ChangePasswordModal";
import { ChangePasswordScreen } from "./ChangePasswordScreen";
import { useChangePasswordFlow } from "./useChangePasswordFlow";

export type ChangePasswordDialogProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

/**
 * One flow, two presentations: the centred modal on tablet and desktop web,
 * a full screen on phones and in the app. The flow lives here, so resizing a
 * browser across the breakpoint keeps what was typed.
 */
export const ChangePasswordDialog = ({ visible, onClose, onSuccess }: ChangePasswordDialogProps) => {
  const { isMobile } = useResponsive();
  const flow = useChangePasswordFlow({ onClose, onSuccess });

  return Platform.OS === "web" && !isMobile ? (
    <ChangePasswordModal visible={visible} flow={flow} />
  ) : (
    <ChangePasswordScreen visible={visible} flow={flow} />
  );
};

export default ChangePasswordDialog;
