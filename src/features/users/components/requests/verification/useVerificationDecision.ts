import { useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";

type Options = {
  visible: boolean;
  onApprove: () => void;
  onReject: (reason: string, remarks?: string) => void;
  /** Opens straight to the rejection reasons (the Users table's Reject button). */
  startWithReject?: boolean;
};

export const useVerificationDecision = ({ visible, onApprove, onReject, startWithReject = false }: Options) => {
  const [showFullIdNumber, setShowFullIdNumber] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useSyncOnChange([visible], () => {
    if (!visible) {
      setShowFullIdNumber(false);
      setShowApproveConfirm(false);
      setShowRejectModal(false);
    } else if (startWithReject) {
      setShowRejectModal(true);
    }
  });

  return {
    showFullIdNumber,
    toggleIdNumber: () => setShowFullIdNumber((shown) => !shown),
    showApproveConfirm,
    openApproveConfirm: () => setShowApproveConfirm(true),
    cancelApprove: () => setShowApproveConfirm(false),
    confirmApprove: () => {
      setShowApproveConfirm(false);
      onApprove();
    },
    showRejectModal,
    openRejectModal: () => setShowRejectModal(true),
    cancelReject: () => setShowRejectModal(false),
    confirmReject: (reason: string, remarks?: string) => {
      setShowRejectModal(false);
      onReject(reason, remarks);
    },
  };
};

export type VerificationDecision = ReturnType<typeof useVerificationDecision>;
