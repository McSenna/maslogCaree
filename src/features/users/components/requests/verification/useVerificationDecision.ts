import { useEffect, useState } from "react";

type Options = {
  visible: boolean;
  onApprove: () => void;
  onReject: (reason: string, remarks?: string) => void;
};

export const useVerificationDecision = ({ visible, onApprove, onReject }: Options) => {
  const [showFullIdNumber, setShowFullIdNumber] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowFullIdNumber(false);
      setShowApproveConfirm(false);
      setShowRejectModal(false);
    }
  }, [visible]);

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
