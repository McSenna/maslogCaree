import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Toast from "@/components/ui/Toast";
import type { UserManagementController } from "../hooks/useUserManagementScreen";
import { statusActionFor, type AdminUser } from "../services/userService";
import ResidentVerificationModal from "./requests/ResidentVerificationModal";
import ResidentVerificationSheet from "./requests/ResidentVerificationSheet";
import UserDetails from "./UserDetails";

type UsersOverlaysProps = {
  controller: UserManagementController;
};

const confirmTitle = (user: AdminUser): string => {
  const action = statusActionFor(user);
  return `${action.label.replace(/ (User|Account)$/, "")} ${user.fullname}?`;
};

const confirmMessage = (user: AdminUser): string => {
  return statusActionFor(user).destructive
    ? "This user will no longer be able to access their MaslogCare account until the account is reactivated."
    : `${user.fullname} will be able to sign in to MaslogCare again.`;
};

const UsersOverlays = ({ controller }: UsersOverlaysProps) => {
  const { statusChange, requests } = controller;
  const pending = statusChange.pendingUser;
  const reviewing = requests.reviewRequestId !== null;

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

      {controller.showTable ? (
        <ResidentVerificationModal
          visible={reviewing}
          request={requests.selectedDetail}
          loading={requests.detailLoading}
          error={requests.detailError}
          approving={requests.approving}
          rejecting={requests.rejecting}
          onApprove={requests.handleApprove}
          onReject={requests.handleReject}
          onClose={requests.closeReview}
        />
      ) : (
        <ResidentVerificationSheet
          visible={reviewing}
          request={requests.selectedDetail}
          loading={requests.detailLoading}
          error={requests.detailError}
          approving={requests.approving}
          rejecting={requests.rejecting}
          onApprove={requests.handleApprove}
          onReject={requests.handleReject}
          onClose={requests.closeReview}
          onRetry={() =>
            requests.reviewRequestId
              ? void requests.openReview(requests.reviewRequestId)
              : undefined
          }
        />
      )}

      <ConfirmationModal
        visible={pending !== null}
        title={pending ? confirmTitle(pending) : ""}
        message={pending ? confirmMessage(pending) : ""}
        confirmLabel={
          pending
            ? statusChange.saving
              ? statusActionFor(pending).pendingLabel
              : statusActionFor(pending).label
            : ""
        }
        destructive={pending ? statusActionFor(pending).destructive : false}
        loading={statusChange.saving}
        onConfirm={statusChange.confirm}
        onCancel={statusChange.cancel}
      />

      <Toast toast={controller.toast} onDismiss={controller.hideToast} />
    </>
  );
};

export default UsersOverlays;
