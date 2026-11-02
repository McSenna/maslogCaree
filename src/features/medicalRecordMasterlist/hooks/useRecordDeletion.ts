import { useCallback, useRef, useState } from "react";

import { toast } from "@/components/feedback";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { mayDeleteRecord } from "../recordDeletionAccess";
import { deleteMedicalRecord, fetchMasterlistRecord } from "../services/masterlistRecordsApi";
import type { MasterlistDetail, MasterlistRow } from "../types";

const useRecordDeletion = (onDeleted: () => void) => {
  const { user } = useAuth();
  const lock = useRef(false);
  const [target, setTarget] = useState<MasterlistDetail | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const open = useCallback(async (row: MasterlistRow) => {
    if (lock.current || !mayDeleteRecord(row, user)) return;
    lock.current = true;
    setOpeningId(row._id);
    try {
      const detail = await fetchMasterlistRecord(row._id);
      if (!mayDeleteRecord(detail, user)) {
        toast.error("You no longer have permission to delete this record.");
        return;
      }
      setReason("");
      setError("");
      setTarget(detail);
    } catch { toast.error("The record could not be loaded. Refresh the table and try again."); }
    finally { lock.current = false; setOpeningId(null); }
  }, [user]);

  const close = () => {
    if (lock.current) return;
    setTarget(null);
    setReason("");
    setError("");
  };
  const remove = async () => {
    if (!target || lock.current) return;
    if (!mayDeleteRecord(target, user)) { setError("You no longer have permission to delete this record."); return; }
    if (!reason.trim()) { setError("Enter the reason for deleting this medical record."); return; }
    lock.current = true;
    setSaving(true);
    setError("");
    try {
      await deleteMedicalRecord({recordId:target._id,reason:reason.trim(),expectedUpdatedAt:target.audit.updatedAt});
      setTarget(null);
      setReason("");
      onDeleted();
      toast.success("Medical record deleted");
    } catch (caught) {
      const problem = normalizeApiError(caught);
      setError(problem.status === 409
        ? "This record changed. Cancel, refresh the table, and review it before deleting."
        : problem.message || "The record could not be deleted. Check your connection and try again.");
    } finally { lock.current = false; setSaving(false); }
  };
  return {
    target, reason, error, saving, open, close, remove,
    loadingId: openingId || (saving ? target?._id : null),
    setReason: (value: string) => { setReason(value); setError(""); },
  };
};
export default useRecordDeletion;
export type RecordDeletionState = ReturnType<typeof useRecordDeletion>;
