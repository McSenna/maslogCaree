import { Modal } from "react-native";
import Toast, { type ToastState } from "@/components/ui/Toast";

type ProfileToastLayerProps = {
  toast: ToastState;
  onDismiss: () => void;
};

const ProfileToastLayer = ({ toast, onDismiss }: ProfileToastLayerProps) => (
  <Modal visible={Boolean(toast)} transparent animationType="none" statusBarTranslucent>
    <Toast toast={toast} onDismiss={onDismiss} />
  </Modal>
);

export default ProfileToastLayer;
