import { Modal, Pressable, ScrollView, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import type { UserRequestDetail } from "../../services/userRequestsService";
import { formatFileSize } from "./IdDocumentViewer";
import VerificationDecisionOverlays from "./verification/VerificationDecisionOverlays";
import IdentityDocumentColumn from "./verification/modal/IdentityDocumentColumn";
import ResidentInfoColumn from "./verification/modal/ResidentInfoColumn";
import VerificationModalFooter from "./verification/modal/VerificationModalFooter";
import {
  VerificationModalError,
  VerificationModalHeader,
  VerificationModalLoading,
} from "./verification/modal/VerificationModalChrome";
import { useVerificationDecision } from "./verification/useVerificationDecision";

type ResidentVerificationModalProps = {
  visible: boolean;
  request: UserRequestDetail | null;
  loading?: boolean;
  error?: string | null;
  approving?: boolean;
  rejecting?: boolean;
  onApprove: () => void;
  onReject: (reason: string, remarks?: string) => void;
  onClose: () => void;
};

const ResidentVerificationModal = ({
  visible,
  request,
  loading = false,
  error = null,
  approving = false,
  rejecting = false,
  onApprove,
  onReject,
  onClose,
}: ResidentVerificationModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const decision = useVerificationDecision({ visible, onApprove, onReject });

  if (!visible) return null;

  const resident = request?.resident;
  const verification = request?.verification;
  const isPending = verification?.verificationStatus === "pending";

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View
          className="flex-1 items-center justify-center p-4 md:p-6"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.7)" }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close verification modal"
            onPress={onClose}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <View
            accessibilityViewIsModal
            className={[
              "w-full max-w-[960px] rounded-2xl border overflow-hidden flex flex-col",
              isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
            ].join(" ")}
            style={{ maxHeight: "92%", boxShadow: "0px 24px 48px rgba(0,0,0,0.28)" }}
          >
            <VerificationModalHeader onClose={onClose} />

            {loading ? (
              <VerificationModalLoading />
            ) : error || !request ? (
              <VerificationModalError message={error} />
            ) : (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-col md:flex-row gap-6">
                  <ResidentInfoColumn resident={resident} verification={verification} />
                  <IdentityDocumentColumn
                    verificationId={request?._id ?? null}
                    verification={verification}
                    formattedFileSize={formatFileSize(verification?.idFileSize)}
                    showFullIdNumber={decision.showFullIdNumber}
                    onToggleIdNumber={decision.toggleIdNumber}
                  />
                </View>
              </ScrollView>
            )}

            <VerificationModalFooter
              isPending={Boolean(isPending)}
              approving={approving}
              rejecting={rejecting}
              onClose={onClose}
              onApprove={decision.openApproveConfirm}
              onReject={decision.openRejectModal}
            />
          </View>
        </View>
      </Modal>

      <VerificationDecisionOverlays
        decision={decision}
        residentName={resident?.fullname}
        approving={approving}
        rejecting={rejecting}
        approveMessage={`This will approve the registration, set the account status to Approved, and immediately allow ${
          resident?.fullname || "the resident"
        } to log in to MaslogCare.`}
      />
    </>
  );
};

export default ResidentVerificationModal;
