import {
  KeyboardAvoidingView,
  Modal,
  Platform,
} from "react-native";
import RegistrationScreen from "./RegistrationScreen";

type RegistrationModalProps = {
  visible: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
};


const RegistrationModal = ({
  visible,
  onClose,
  onOpenLogin,
}: RegistrationModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <RegistrationScreen
          onBackPress={onClose}
          onRegistrationSuccess={onClose}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RegistrationModal;