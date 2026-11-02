import ActionDialog from "@/components/feedback/dialog/ActionDialog";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  focusCancel?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  focusCancel = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => (
  <ActionDialog
    visible={visible}
    title={title}
    message={message}
    destructive={destructive}
    busy={loading}
    error={error}
    onClose={onCancel}
    actions={[
      { label: cancelLabel, variant: "secondary", onPress: onCancel, initialFocus: focusCancel },
      { label: confirmLabel, variant: destructive ? "danger" : "primary", onPress: onConfirm, loading },
    ]}
  />
);

export default ConfirmationModal;
