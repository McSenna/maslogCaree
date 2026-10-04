import ConfirmationModal from "@/components/ui/ConfirmationModal";

import RejectRequestModal from "../RejectRequestModal";
import { linkChoiceSentence } from "../masterList/linkChoice";
import { useLinkChoice } from "../masterList/LinkChoiceContext";
import type { VerificationDecision } from "./useVerificationDecision";

type Props = {
  decision: VerificationDecision;
  residentName?: string;
  approving: boolean;
  rejecting: boolean;
  approveMessage?: string;
  /** True when the admin was offered master list records to link. */
  hasLinkChoices?: boolean;
};

const VerificationDecisionOverlays = ({
  decision,
  residentName,
  approving,
  rejecting,
  approveMessage,
  hasLinkChoices = false,
}: Props) => {
  const name = residentName || "Resident";
  const link = useLinkChoice();
  const linkSentence = linkChoiceSentence(link?.choice, hasLinkChoices);

  return (
    <>
      <ConfirmationModal
        visible={decision.showApproveConfirm}
        title={`Approve ${name}?`}
        message={`${
          approveMessage ??
          `This approves the registration and lets ${residentName || "the resident"} sign in to MaslogCare immediately.`
        }${linkSentence}`}
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
