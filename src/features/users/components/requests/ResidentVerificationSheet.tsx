import { Animated, Modal, Platform, Pressable, View } from "react-native";

import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { formatDateTime } from "@/utils/dateFormatter";

import { useUserDetailsPalette } from "../details/detailsTheme";
import type { UserRequestDetail } from "../../services/userRequestsService";
import VerificationDecisionOverlays from "./verification/VerificationDecisionOverlays";
import VerificationSheetActions from "./verification/sheet/VerificationSheetActions";
import VerificationSheetBody from "./verification/sheet/VerificationSheetBody";
import VerificationSheetHeader from "./verification/sheet/VerificationSheetHeader";
import { useSheetDragDismiss } from "./verification/useSheetDragDismiss";
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
  const { dragY, panResponder, height } = useSheetDragDismiss(visible, onClose);

  useWebModalBehavior(visible, onClose);

  if (!visible) return null;

  const resident = request?.resident;
  const verification = request?.verification;
  const isPending = verification?.verificationStatus === "pending";
  const busy = approving || rejecting;
  const submitted = verification?.submittedAt ? formatDateTime(verification.submittedAt) : null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={busy ? undefined : onClose}
        statusBarTranslucent
        {...dialogAccessibilityProps}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,23,42,0.35)" }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close identity verification"
            onPress={busy ? undefined : onClose}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <Animated.View
            className="w-full overflow-hidden"
            style={{
              maxHeight: height * 0.94,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              backgroundColor: palette.cardBg,
              transform: [{ translateY: dragY }],
              shadowColor: "#0F2557",
              shadowOpacity: 0.2,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: -6 },
              elevation: 16,
            }}
          >
            <View {...panResponder.panHandlers}>
              <VerificationSheetHeader titleId={TITLE_ID} busy={busy} onClose={onClose} />
            </View>

            <VerificationSheetBody
              request={request}
              loading={loading}
              error={error}
              registeredLabel={submitted ? submitted.date : "—"}
              decision={decision}
              onRetry={onRetry}
            />

            {request && !error && isPending ? (
              <VerificationSheetActions
                residentName={resident?.fullname}
                approving={approving}
                rejecting={rejecting}
                onApprove={decision.openApproveConfirm}
                onReject={decision.openRejectModal}
              />
            ) : null}
          </Animated.View>
        </View>
      </Modal>

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
