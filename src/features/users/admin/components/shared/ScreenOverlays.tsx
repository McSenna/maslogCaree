import ConfirmationModal from "@/components/ui/ConfirmationModal";
import WebAccessConfirmDialog from "@/features/webAccess/WebAccessConfirmDialog";

import { LinkChoiceProvider } from "../../../components/requests/masterList/LinkChoiceContext";
import RejectRequestModal from "../../../components/requests/RejectRequestModal";
import ResidentVerificationModal from "../../../components/requests/ResidentVerificationModal";
import ResidentVerificationSheet from "../../../components/requests/ResidentVerificationSheet";
import UserDetails from "../../../components/UserDetails";
import type { UsersScreenState } from "../../hooks/useUsersScreen";
import { invalidateUsers } from "../../hooks/usersVersion";
import EditUserDialog from "./EditUserDialog";

type ScreenOverlaysProps = { screen: UsersScreenState; phone: boolean };

/** The View drawer, ID review and action dialogs, shared by both layouts. */
const ScreenOverlays = ({ screen, phone }: ScreenOverlaysProps) => {
  const { details, review, reviewTarget, actions } = screen;
  // The review hook closes itself after a decision, so both must agree it is open.
  const reviewing = reviewTarget !== null && review.reviewRequestId !== null;
  const verification = {
    visible: reviewing,
    startWithReject: reviewTarget?.reject ?? false,
    request: review.selectedDetail,
    loading: review.detailLoading,
    error: review.detailError,
    approving: review.approving,
    rejecting: review.rejecting,
    onApprove: review.handleApprove,
    onReject: review.handleReject,
    onClose: screen.closeReview,
  };

  return (
    <>
      <UserDetails
        visible={details.detailsUserId !== null}
        user={details.detailsUser}
        loading={details.detailsLoading}
        error={details.detailsError}
        onRetry={details.retryDetails}
        onClose={details.closeDetails}
        onChangeStatus={screen.changeStatusFromDrawer}
        onViewActivity={details.viewActivity}
      />

      <LinkChoiceProvider value={{ choice: review.linkChoice, setChoice: review.setLinkChoice }}>
        {phone ? (
          <ResidentVerificationSheet
            {...verification}
            onRetry={() => (reviewTarget ? screen.openReview(reviewTarget.id, reviewTarget.reject) : undefined)}
          />
        ) : (
          <ResidentVerificationModal {...verification} />
        )}
      </LinkChoiceProvider>

      <ConfirmationModal
        visible={actions.confirming !== null}
        title={actions.confirmWords?.title ?? ""}
        message={actions.confirmWords?.body ?? ""}
        confirmLabel={actions.confirmWords?.confirmLabel ?? ""}
        destructive={actions.confirmWords?.destructive}
        loading={actions.busy}
        onConfirm={() => void actions.confirm()}
        onCancel={actions.cancelConfirm}
      />
      <WebAccessConfirmDialog
        visible={actions.webChangeWords !== null}
        copy={actions.webChangeWords}
        saving={actions.savingOverrideId !== null}
        onConfirm={(reason) => void actions.confirmWebChange(reason)}
        onCancel={actions.cancelWebChange}
      />
      <RejectRequestModal
        visible={actions.rejecting !== null}
        residentName={actions.rejecting?.fullName ?? ""}
        loading={actions.busy}
        onConfirm={(reason, remarks) => void actions.reject(reason, remarks)}
        onCancel={actions.cancelReject}
      />
      <EditUserDialog
        target={actions.editing}
        selfId={screen.selfId}
        onClose={actions.closeEdit}
        onSaved={() => {
          actions.closeEdit();
          invalidateUsers();
        }}
      />
    </>
  );
};

export default ScreenOverlays;
