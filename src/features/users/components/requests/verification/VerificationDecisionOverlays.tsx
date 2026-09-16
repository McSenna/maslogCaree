import ConfirmationModal from "@/components/ui/ConfirmationModal";

import RejectRequestModal from "../RejectRequestModal";
import type { VerificationDecision } from "./useVerificationDecision";

type Props = {
  decision: VerificationDecision;
  residentName?: string;
  approving: boolean;
  rejecting: boolean;
  approveMessage?: string;
};

const VerificationDecisionOverlays = ({
  decision,
  residentName,
  approving,
  rejecting,
  approveMessage,
}: Props) => {
  const name = residentName || "Resident";

  return (
    <>
      <ConfirmationModal
        visible={decision.showApproveConfirm}
        title={`Approve ${name}?`}
        message={
          approveMessage ??
          `This approves the registration and lets ${
            residentName || "the resident"
          } sign in to MaslogCare immediately.`
        }
        confirmLabel="Approve Resident"
        loading={approving}
        onConfirm={decision.confirmApprove}
        onCancel={decision.cancelApprove}
      />

      <RejectRequestModal
        visible={decision.showRejectModal}
        residentName={name}
        loading={rejecting}
        onConfirm={decision.confirmReject}
        onCancel={decision.cancelReject}
      />
    </>
  );
};

export default VerificationDecisionOverlays;
