import { Platform, View } from "react-native";

import BottomSheet from "@/components/ui/BottomSheet";
import { formatDateTime } from "@/utils/dateFormatter";

import { useUserDetailsPalette } from "../details/detailsTheme";
import type { UserRequestDetail } from "../../services/userRequestsService";
import { choosableCandidates } from "./masterList/linkChoice";
import VerificationDecisionOverlays from "./verification/VerificationDecisionOverlays";
import VerificationSheetActions from "./verification/sheet/VerificationSheetActions";
import VerificationSheetBody from "./verification/sheet/VerificationSheetBody";
import VerificationSheetHeader from "./verification/sheet/VerificationSheetHeader";
import { useVerificationDecision } from "./verification/useVerificationDecision";
import { PALETTE, withAlpha } from "@/theme/palette";

const TITLE_ID = "resident-verification-sheet-title";

const dialogAccessibilityProps =
  Platform.OS === "web" ? ({ "aria-labelledby": TITLE_ID } as object) : {};

type ResidentVerificationSheetProps = {
  visible: boolean;
  request: UserRequestDetail | null;
  loading?: boolean;
  error?: string | null;
  approving?: boolean;
  rejecting?: boolean;
  onApprove: () => void;
  onReject: (reason: string, remarks?: string) => void;
  onClose: () => void;
  startWithReject?: boolean;
  onRetry?: () => void;
};

const ResidentVerificationSheet = ({
  visible,
  request,
  loading = false,
  error = null,
  approving = false,
  rejecting = false,
  onApprove,
  onReject,
  onClose,
  onRetry,
  startWithReject,
}: ResidentVerificationSheetProps) => {
  const palette = useUserDetailsPalette();
  const decision = useVerificationDecision({ visible, onApprove, onReject, startWithReject });

  const resident = request?.resident;
  const verification = request?.verification;
  const isPending = verification?.verificationStatus === "pending";
  const busy = approving || rejecting;
  const submitted = verification?.submittedAt ? formatDateTime(verification.submittedAt) : null;
  const showActions = Boolean(request) && !error && isPending;

  // An approval or rejection in flight must finish before the sheet can go.
  const handleClose = () => {
    if (busy) return;
    onClose();
  };

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={handleClose}
        accessibilityLabel="Identity verification"
        surface={palette.cardBg}
        handleColor={palette.divider}
        scrim={withAlpha(PALETTE.slate[800], 0.35)}
        maxHeightRatio={0.94}
        // VerificationSheetActions pads itself past the home indicator.
        applyBottomInset={!showActions}
        header={(requestClose) => (
          <View {...dialogAccessibilityProps}>
            <VerificationSheetHeader titleId={TITLE_ID} busy={busy} onClose={requestClose} />
          </View>
        )}
      >
        <VerificationSheetBody
          request={request}
          loading={loading}
          error={error}
          registeredLabel={submitted ? submitted.date : "Not set"}
          decision={decision}
          onRetry={onRetry}
        />

        {showActions ? (
          <VerificationSheetActions
            residentName={resident?.fullname}
            approving={approving}
            rejecting={rejecting}
            onApprove={decision.openApproveConfirm}
            onReject={decision.openRejectModal}
          />
        ) : null}
      </BottomSheet>

      <VerificationDecisionOverlays
        decision={decision}
        residentName={resident?.fullname}
        approving={approving}
        rejecting={rejecting}
        hasLinkChoices={choosableCandidates(request?.masterList, isPending).length > 0}
      />
    </>
  );
};

export default ResidentVerificationSheet;
