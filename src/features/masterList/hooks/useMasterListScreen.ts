import { useState } from "react";

import { toast } from "@/components/feedback";

import type { MasterResidentRecord } from "../masterList.types";
import { masterFullName } from "../masterResidentForm";
import { resolveMasterListView } from "../masterListView";
import { setMasterResidentActive } from "../services/masterListApi";
import { useMasterList } from "./useMasterList";
import { toastError } from "@/utils/errorToast/toastError";

/** Editor: null when closed, "new" to add, or the record being edited. */
type EditorTarget = "new" | MasterResidentRecord | null;

/** List, editor and activation state for the master list tab. */
export const useMasterListScreen = ({ isPhone }: { isPhone: boolean }) => {
  const list = useMasterList({ append: isPhone });
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [confirming, setConfirming] = useState<MasterResidentRecord | null>(null);
  const [toggling, setToggling] = useState(false);

  const view = resolveMasterListView({
    isLoading: list.isLoading,
    error: list.error,
    shown: list.records.length,
    filtered: list.filtered,
  });

  const toggleActive = async () => {
    if (!confirming || toggling) return;
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
      setToggling(false);
    }
  };

  const clearFilters = () => list.setQuery("");

  return {
    list,
    view,
    editor,
    openNew: () => setEditor("new"),
    openEdit: (record: MasterResidentRecord) => setEditor(record),
    closeEditor: () => setEditor(null),
    confirming,
    confirmName: confirming ? masterFullName(confirming) : "",
    askToggle: setConfirming,
    cancelToggle: () => setConfirming(null),
    toggleActive,
    toggling,
    clearFilters,
  };
};

export type MasterListScreenState = ReturnType<typeof useMasterListScreen>;
