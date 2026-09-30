import { Modal, type ModalProps } from "react-native";

import ToastViewport from "@/components/feedback/toast/ToastViewport";

/**
 * React Native's Modal with its own toast layer. A modal draws above the app
 * root, so without this an outcome toast (a failed save inside a form, say)
 * would be hidden behind the modal that caused it.
 */
const AppModal = ({ children, ...props }: ModalProps) => (
  <Modal {...props}>
    {children}
    <ToastViewport layer="overlay" />
  </Modal>
);

export default AppModal;
