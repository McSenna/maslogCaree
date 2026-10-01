import ActionDialog from "@/components/feedback/dialog/ActionDialog";
import MaslogCareLogo from "@/components/landing/MaslogCareLogo";

type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

const LogoutConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  busy = false,
}: LogoutConfirmModalProps) => (
  <ActionDialog
    visible={visible}
    title="Log out of MaslogCare?"
    message="Are you sure you want to log out?"
    icon="log-out"
    media={<MaslogCareLogo size={36} />}
    destructive
    busy={busy}
    onClose={onCancel}
    actions={[
      { label: "Stay signed in", variant: "secondary", onPress: onCancel },
      { label: "Log out", variant: "danger", onPress: onConfirm, loading: busy },
    ]}
  />
);

export default LogoutConfirmModal;
