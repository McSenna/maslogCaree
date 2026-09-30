import { useCallback, useState } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import {
  approveUserRequest,
  getUserRequestById,
  rejectUserRequest,
  type UserRequestDetail,
} from "../../services/userRequestsService";

type Options = {
  refresh: () => Promise<void>;
};

export const useRequestReview = ({ refresh }: Options) => {
  const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<UserRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const openReview = useCallback(async (requestId: string) => {
    setReviewRequestId(requestId);
    setSelectedDetail(null);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await getUserRequestById(requestId);
      setSelectedDetail(detail);
    } catch (err) {
      setDetailError(getApiErrorMessage(err, "Failed to load verification details."));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeReview = useCallback(() => {
    setReviewRequestId(null);
    setSelectedDetail(null);
    setDetailError(null);
  }, []);

  const handleApprove = useCallback(async () => {
    if (!reviewRequestId || approving) return;
    setApproving(true);
    try {
      const res = await approveUserRequest(reviewRequestId);
      toast.success("Registration approved", res.message || undefined);
      closeReview();
      await refresh();
    } catch (err) {
      toast.error(
        "Registration not approved",
        getApiErrorMessage(err, "Failed to approve resident registration.")
      );
    } finally {
      setApproving(false);
    }
  }, [reviewRequestId, approving, closeReview, refresh]);

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
        toast.error(
          "Registration not rejected",
          getApiErrorMessage(err, "Failed to reject resident registration.")
        );
      } finally {
        setRejecting(false);
      }
    },
    [reviewRequestId, rejecting, closeReview, refresh]
  );

  return {
    reviewRequestId,
    selectedDetail,
    detailLoading,
    detailError,
    openReview,
    closeReview,
    approving,
    rejecting,
    handleApprove,
    handleReject,
  };
};
