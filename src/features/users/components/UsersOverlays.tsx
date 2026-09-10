import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Toast from "@/components/ui/Toast";
import type { UserManagementController } from "../hooks/useUserManagementScreen";
import { STATUS_ACTIONS, type AdminUser } from "../services/userService";
import UserDetails from "./UserDetails";

type UsersOverlaysProps = {
  controller: UserManagementController;
};

/**
 * The dialog title names the account.
 *
 * The confirmation can be reached from a row menu as well as from the details
 * panel, and the admin has to be able to check whose account this is without
 * dismissing it first — so it reads "Suspend Maria Santos?", not
 * "Deactivate User?".
 */
function confirmTitle(user: AdminUser): string {
  const action = STATUS_ACTIONS[user.status];
  return `${action.label.replace(/ (User|Account)$/, "")} ${user.fullname}?`;
}

function confirmMessage(user: AdminUser): string {
  return STATUS_ACTIONS[user.status].destructive
    ? "This user will no longer be able to access their MaslogCare account until the account is reactivated."
    : `${user.fullname} will be able to sign in to MaslogCare again.`;
}

/** The details panel, the status confirmation and the toast. */
export default function UsersOverlays({ controller }: UsersOverlaysProps) {
  const { statusChange } = controller;
  const pending = statusChange.pendingUser;

  return (
    <>
      <UserDetails
        visible={controller.detailsUserId !== null}
        user={controller.detailsUser}
        loading={controller.loading}
        error={controller.detailsError}
        onRetry={controller.fetchUsers}
        onClose={controller.closeDetails}
        onChangeStatus={statusChange.requestChange}
        onViewActivity={controller.viewActivity}
        busy={statusChange.saving}
      />

      <ConfirmationModal
        visible={pending !== null}
        title={pending ? confirmTitle(pending) : ""}
        message={pending ? confirmMessage(pending) : ""}
        confirmLabel={
          pending
            ? statusChange.saving
              ? STATUS_ACTIONS[pending.status].pendingLabel
              : STATUS_ACTIONS[pending.status].label
            : ""
        }
        destructive={pending ? STATUS_ACTIONS[pending.status].destructive : false}
        loading={statusChange.saving}
        onConfirm={statusChange.confirm}
        onCancel={statusChange.cancel}
      />

      <Toast toast={controller.toast} onDismiss={controller.hideToast} />
    </>
  );
}
