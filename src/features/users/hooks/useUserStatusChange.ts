import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import {
  STATUS_ACTIONS,
  updateUserStatus,
  USER_STATUS_LABELS,
  type AdminUser,
} from "../services/userService";

type UserStatusChangeInput = {
  /** Patches the list row so the details panel shows the new standing at once. */
  applyUserUpdate: (user: AdminUser) => void;
  onResult: (message: string, tone: "success" | "error") => void;
};

/**
 * Suspending or reactivating an account, behind a confirmation.
 *
 * The dialog is held open on failure so the admin can retry without hunting
 * for the row again; it closes only once the server confirms.
 */
export function useUserStatusChange({ applyUserUpdate, onResult }: UserStatusChangeInput) {
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const confirm = useCallback(async () => {
    if (!pendingUser) return;

    const action = STATUS_ACTIONS[pendingUser.status];
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
}
