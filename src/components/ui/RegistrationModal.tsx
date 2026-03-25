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

/**
 * Wraps RegistrationScreen in a Modal so it can be launched
 * from LoginModal's "Register Now →" link.
 */
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