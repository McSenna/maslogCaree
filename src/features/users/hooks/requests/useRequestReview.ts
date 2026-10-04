import { useCallback, useState } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";

import type { LinkChoice } from "../../components/requests/masterList/linkChoice";

import {
  approveUserRequest,
  getUserRequestById,
  rejectUserRequest,
  type UserRequestDetail,
} from "../../services/userRequestsService";
import { toastError } from "@/utils/errorToast/toastError";

type Options = {
  refresh: () => Promise<void>;
};

export const useRequestReview = ({ refresh }: Options) => {
  const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);
  // If another admin decides this request while it is open, the review reloads
  // and shows the decision instead of offering a second one.
  const review = useRealtimeItem<"userRequest", UserRequestDetail>("userRequest", reviewRequestId, getUserRequestById, {
    errorMessage: "Failed to load verification details.",
  });

  const [approving, setApproving] = useState(false);
  // Reset with every request so one person's link choice never carries to the next.
  const [linkChoice, setLinkChoice] = useState<LinkChoice>(undefined);
  const [rejecting, setRejecting] = useState(false);

  const openReview = useCallback((requestId: string) => {
    setReviewRequestId(requestId);
    setLinkChoice(undefined);
  }, []);

  const closeReview = useCallback(() => {
    setReviewRequestId(null);
    setLinkChoice(undefined);
  }, []);

  const handleApprove = useCallback(async () => {
    if (!reviewRequestId || approving) return;
    setApproving(true);
    try {
      const res = await approveUserRequest(reviewRequestId, linkChoice);
      toast.success("Registration approved", res.message || undefined);
      closeReview();
      await refresh();
    } catch (err) {
      toastError("Registration not approved", err, { fallback: "Failed to approve resident registration." });
    } finally {
      setApproving(false);
    }
  }, [reviewRequestId, approving, linkChoice, closeReview, refresh]);

  const handleReject = useCallback(
    async (reason: string, remarks: string = "") => {
      if (!reviewRequestId || rejecting) return;
      setRejecting(true);
      try {
        const res = await rejectUserRequest(reviewRequestId, reason, remarks);
        toast.success("Registration rejected", res.message || undefined);
        closeReview();
        await refresh();
      } catch (err) {
        toastError("Registration not rejected", err, { fallback: "Failed to reject resident registration." });
      } finally {
        setRejecting(false);
      }
    },
    [reviewRequestId, rejecting, closeReview, refresh]
  );

  return {
    reviewRequestId,
    selectedDetail: review.item,
    detailLoading: review.loading,
    detailError: review.deleted ? "This registration request is no longer available." : review.error,
    openReview,
    closeReview,
    approving,
    rejecting,
    handleApprove,
    handleReject,
    linkChoice,
    setLinkChoice,
  };
};
