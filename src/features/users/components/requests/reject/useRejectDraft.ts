import { useCallback, useState } from "react";

import { REJECTION_REASONS } from "@/config/idVerification";

const FIRST_REASON = REJECTION_REASONS[0] || "Invalid ID";

export type RejectDraft = ReturnType<typeof useRejectDraft>;

/**
 * Rejection reason + remarks, reset every time the sheet opens so a reopened
 * sheet never shows the previous resident's draft.
 */
export const useRejectDraft = (visible: boolean, onConfirm: (reason: string, remarks?: string) => void) => {
  const [reason, setReason] = useState(FIRST_REASON);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  // Reset during render rather than in an effect, so the sheet's first frame
  // already shows a blank draft instead of the previous resident's answers.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setReason(FIRST_REASON);
      setRemarks("");
      setError("");
    }
  }

  const selectReason = useCallback((next: string) => {
    setReason(next);
    setError("");
  }, []);

  const changeRemarks = useCallback((next: string) => {
    setRemarks(next);
    setError("");
  }, []);

  const submit = useCallback(() => {
    if (reason === "Other" && !remarks.trim()) {
      setError("Please provide specific remarks explaining the rejection.");
      return;
    }
    setError("");
    onConfirm(reason, remarks.trim());
  }, [onConfirm, reason, remarks]);

  return { reason, remarks, error, requiresRemarks: reason === "Other", selectReason, changeRemarks, submit };
};
