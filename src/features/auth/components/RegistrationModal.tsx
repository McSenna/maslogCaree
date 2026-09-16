import ResidentRegistrationDialog from "../registration/ResidentRegistrationDialog";

type RegistrationModalProps = {
  visible: boolean;
  onClose: () => void;
};

const RegistrationModal = ({ visible, onClose }: RegistrationModalProps) => (
  <ResidentRegistrationDialog visible={visible} onClose={onClose} />
);

export default RegistrationModal;
