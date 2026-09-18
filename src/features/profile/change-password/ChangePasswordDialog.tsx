import { Platform } from "react-native";

import { ChangePasswordBottomSheet } from "./ChangePasswordBottomSheet";
import { ChangePasswordModal } from "./ChangePasswordModal";

export type ChangePasswordDialogProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const ChangePasswordDialog = ({
  visible,
  onClose,
  onSuccess,
}: ChangePasswordDialogProps) =>
  Platform.OS === "web" ? (
    <ChangePasswordModal visible={visible} onClose={onClose} onSuccess={onSuccess} />
  ) : (
    <ChangePasswordBottomSheet visible={visible} onClose={onClose} onSuccess={onSuccess} />
  );

export default ChangePasswordDialog;
