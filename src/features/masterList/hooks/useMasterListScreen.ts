import { useRef, useState } from "react";

import { toast } from "@/components/feedback";

import type { MasterResidentRecord } from "../masterList.types";
import { masterFullName } from "../masterResidentForm";
import { resolveMasterListView } from "../masterListView";
import { deleteMasterResident, setMasterResidentActive } from "../services/masterListApi";
import { useMasterList } from "./useMasterList";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

/** Editor: null when closed, "new" to add, or the record being edited. */
type EditorTarget = "new" | MasterResidentRecord | null;

/** List, editor and activation state for the master list tab. */
export const useMasterListScreen = ({ isPhone, onChanged }: { isPhone: boolean; onChanged?: () => void }) => {
  const list = useMasterList({ append: isPhone });
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [confirming, setConfirming] = useState<MasterResidentRecord | null>(null);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState<MasterResidentRecord | null>(null);
  const [removing, setRemoving] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const mutationLock = useRef(false);

  const remove = async () => {
    if (!deleting || mutationLock.current) return;
    mutationLock.current = true;
    setRemoving(true);
    setDeleteError("");
    try {
      await deleteMasterResident(deleting._id);
      setDeleting(null);
      list.refresh();
      onChanged?.();
      toast.success("Record deleted", `Master resident ID ${deleting.masterResidentId}`);
    } catch (caught: unknown) {
      setDeleteError(normalizeApiError(caught).message);
      toastError("Record not deleted", caught, { inline: true });
    } finally {
      mutationLock.current = false;
      setRemoving(false);
    }
  };

  const view = resolveMasterListView({
    isLoading: list.isLoading,
    error: list.error,
    shown: list.records.length,
    filtered: list.filtered,
  });

  const toggleActive = async () => {
    if (!confirming || mutationLock.current) return;
    mutationLock.current = true;
    const next = !confirming.isActive;
    setToggling(true);
    try {
      await setMasterResidentActive(confirming._id, next);
      toast.success(next ? "Record reactivated" : "Record deactivated", `Master resident ID ${confirming.masterResidentId}`);
      setConfirming(null);
      list.refresh();
    } catch (caught: unknown) {
      toastError(next ? "Record not reactivated" : "Record not deactivated", caught);
    } finally {
      mutationLock.current = false;
      setToggling(false);
    }
  };

  const clearFilters = list.clearFilters;

  return {
    list,
    view,
    editor,
    openNew: () => setEditor("new"),
    openEdit: (record: MasterResidentRecord) => setEditor(record),
    closeEditor: () => setEditor(null),
    saved: () => {
      list.refresh();
      onChanged?.();
    },
    confirming,
    confirmName: confirming ? masterFullName(confirming) : "",
    askToggle: (record: MasterResidentRecord) => { if (!mutationLock.current) setConfirming(record); },
    cancelToggle: () => { if (!mutationLock.current) setConfirming(null); },
    deleting,
    removing,
    deleteError,
    askDelete: (record: MasterResidentRecord) => {
      if (mutationLock.current) return;
      setDeleteError("");
      setDeleting(record);
    },
    cancelDelete: () => { if (!mutationLock.current) setDeleting(null); },
    remove,
    toggleActive,
    toggling,
    clearFilters,
  };
};

export type MasterListScreenState = ReturnType<typeof useMasterListScreen>;
