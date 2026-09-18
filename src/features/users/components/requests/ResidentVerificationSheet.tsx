import { Platform, View } from "react-native";

import BottomSheet from "@/components/ui/BottomSheet";
import { formatDateTime } from "@/utils/dateFormatter";

import { useUserDetailsPalette } from "../details/detailsTheme";
import type { UserRequestDetail } from "../../services/userRequestsService";
import VerificationDecisionOverlays from "./verification/VerificationDecisionOverlays";
import VerificationSheetActions from "./verification/sheet/VerificationSheetActions";
import VerificationSheetBody from "./verification/sheet/VerificationSheetBody";
import VerificationSheetHeader from "./verification/sheet/VerificationSheetHeader";
import { useVerificationDecision } from "./verification/useVerificationDecision";

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
}: ResidentVerificationSheetProps) => {
  const palette = useUserDetailsPalette();
  const decision = useVerificationDecision({ visible, onApprove, onReject });

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
        scrim="rgba(15,23,42,0.35)"
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
          registeredLabel={submitted ? submitted.date : "—"}
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
      />
    </>
  );
};

export default ResidentVerificationSheet;
