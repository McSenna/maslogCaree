import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import {
  statusActionFor,
  updateUserStatus,
  USER_STATUS_LABELS,
  type AdminUser,
} from "../services/userService";

type UserStatusChangeInput = {
  applyUserUpdate: (user: AdminUser) => void;
  onResult: (message: string, tone: "success" | "error") => void;
};

export const useUserStatusChange = ({ applyUserUpdate, onResult }: UserStatusChangeInput) => {
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const confirm = useCallback(async () => {
    if (!pendingUser) return;

    const action = statusActionFor(pendingUser);
    setSaving(true);
    try {
      const { user: updated, message } = await updateUserStatus(pendingUser._id, action.next);
      applyUserUpdate(updated);
      setPendingUser(null);
      onResult(
        message || `User ${USER_STATUS_LABELS[action.next].toLowerCase()}.`,
        "success"
      );
    } catch (error: unknown) {
      onResult(
        getApiErrorMessage(error, "Unable to update this user. Please try again."),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }, [pendingUser, applyUserUpdate, onResult]);

  return {
    pendingUser,
    requestChange: setPendingUser,
    cancel: () => setPendingUser(null),
    saving,
    confirm,
  };
};
