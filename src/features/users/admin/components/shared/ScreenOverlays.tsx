import ResidentVerificationModal from "../../../components/requests/ResidentVerificationModal";
import ResidentVerificationSheet from "../../../components/requests/ResidentVerificationSheet";
import UserDetails from "../../../components/UserDetails";
import type { UsersScreenState } from "../../hooks/useUsersScreen";
import type { User } from "../../userAdmin.types";
import RowActionMenu from "./RowActionMenu";

type ScreenOverlaysProps = { screen: UsersScreenState; phone: boolean };

const toggleAction = (user: User) => (user.status === "deactivated" ? "reactivate" : "deactivate");

/** The row menu, the profile panel and the ID review, shared by both layouts. */
const ScreenOverlays = ({ screen, phone }: ScreenOverlaysProps) => {
  const { details, review, reviewTarget } = screen;
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

  const toggleStatus = (user: User) => screen.changeStatus([user], toggleAction(user));

  return (
    <>
      <RowActionMenu
        user={screen.menuUser}
        isSelf={screen.menuUser?.id === screen.selfId}
        anchor={screen.menu?.anchor ?? null}
        onClose={screen.closeMenu}
        onViewProfile={(user) => {
          screen.closeMenu();
          details.openDetails(user.id);
        }}
        onToggleStatus={toggleStatus}
      />

      <UserDetails
        visible={details.detailsUserId !== null}
        user={details.detailsUser}
        loading={screen.users.isLoading}
        error={details.detailsError}
        onRetry={screen.retry}
        onClose={details.closeDetails}
        onChangeStatus={(record) => {
          details.closeDetails();
          const row = screen.rows.find((user) => user.id === record._id);
          if (row) toggleStatus(row);
        }}
        onViewActivity={details.viewActivity}
      />

      {phone ? (
        <ResidentVerificationSheet
          {...verification}
          onRetry={() => (reviewTarget ? screen.openReview(reviewTarget.id, reviewTarget.reject) : undefined)}
        />
      ) : (
        <ResidentVerificationModal {...verification} />
      )}
    </>
  );
};

export default ScreenOverlays;
