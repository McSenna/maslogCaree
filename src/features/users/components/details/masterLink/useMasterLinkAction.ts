import { useRef, useState } from "react";

import { toast } from "@/components/feedback";
import { invalidateUsers } from "@/features/users/admin/hooks/usersVersion";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

import { linkMasterRecord, unlinkMasterRecord } from "../../../services/masterLinkService";

export type MasterLinkMode = "link" | "unlink";

/** Saves a link or unlink once (a double tap sends one request) and refreshes the users screen. */
export const useMasterLinkAction = ({ userId, onDone }: { userId: string; onDone: () => void }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const run = async (mode: MasterLinkMode, reason: string, masterResidentId?: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setError(null);
    try {
      if (mode === "link" && masterResidentId) await linkMasterRecord(userId, masterResidentId, reason.trim());
      else await unlinkMasterRecord(userId, reason.trim());
      toast.success(mode === "link" ? "Account linked" : "Account unlinked", mode === "link" ? `Master list record ${masterResidentId}` : "Its medical records are kept.");
      invalidateUsers();
      onDone();
    } catch (caught: unknown) {
      const normalized = normalizeApiError(caught);
      setError(normalized.isNetworkError ? "Connection lost. Your changes were not saved." : normalized.message);
      toastError(mode === "link" ? "Account not linked" : "Account not unlinked", caught, { inline: true });
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  return { saving, error, run };
};
