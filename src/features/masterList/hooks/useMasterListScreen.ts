import { useRef, useState } from "react";

import { toast } from "@/components/feedback";

import type { MasterResidentRecord } from "../masterList.types";
import { resolveMasterListView } from "../masterListView";
import { deleteMasterResident } from "../services/masterListApi";
import { useMasterList } from "./useMasterList";
import { focusResidentTrigger } from "../residentDetails/returnFocus";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

/** Editor: null when closed, "new" to add, or the record being edited. */
type EditorTarget = "new" | MasterResidentRecord | null;

/** List, view, editor and deletion state for the master list tab. */
export const useMasterListScreen = ({ isPhone, onChanged }: { isPhone: boolean; onChanged?: () => void }) => {
  const list = useMasterList({ append: isPhone });
  const [editor, setEditor] = useState<EditorTarget>(null);
  // Only the id: the details view fetches the record itself and never trusts the list row.
  const [viewingId, setViewingId] = useState<string | null>(null);
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
    viewingId,
    openView: (record: MasterResidentRecord) => setViewingId(record._id),
    closeView: () => {
      if (viewingId) focusResidentTrigger(viewingId);
      setViewingId(null);
    },
    // Gets the freshly fetched record. The view closes first, so the two dialogs never stack.
    editFromView: (record: MasterResidentRecord) => {
      setViewingId(null);
      setEditor(record);
    },
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
    clearFilters,
  };
};

export type MasterListScreenState = ReturnType<typeof useMasterListScreen>;
