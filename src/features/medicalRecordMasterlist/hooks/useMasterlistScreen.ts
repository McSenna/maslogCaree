import { useState } from "react";

import { toast } from "@/components/feedback";
import { resolveMasterListView } from "@/features/masterList/masterListView";

import { CARD_CRITERIA, EMPTY_CRITERIA, recordReference, type MasterlistCardKey } from "../masterlistLabels";
import type { MasterlistDetail, ResidentIdentity } from "../types";
import { useMasterlistRecords } from "./useMasterlistRecords";
import { useMasterlistSummary } from "./useMasterlistSummary";
import { useRecordDetail } from "./useRecordDetail";
import { useServiceForms } from "./useServiceForms";

/** Editor: null when closed, "new" to add, or the record being edited. */
type EditorTarget = "new" | MasterlistDetail | null;

const NO_SERVICES: readonly string[] = [];

/** List, cards, detail and editor state for the Medical Records Masterlist. */
export const useMasterlistScreen = ({ isPhone }: { isPhone: boolean }) => {
  const list = useMasterlistRecords({ append: isPhone });
  const { summary, refresh: refreshSummary } = useMasterlistSummary();
  const serviceForms = useServiceForms(summary?.services ?? NO_SERVICES);
  const detail = useRecordDetail();
  const [editor, setEditor] = useState<EditorTarget>(null);
  // The person whose history the list is narrowed to, for the banner above it.
  const [historyOf, setHistoryOf] = useState<ResidentIdentity | null>(null);

  const view = resolveMasterListView({
    isLoading: list.isLoading,
    error: list.error,
    shown: list.records.length,
    filtered: list.filtered,
  });

  const onSaved = (saved: MasterlistDetail) => {
    toast.success(editor === "new" ? "Medical record saved" : "Medical record updated", recordReference(saved._id));
    list.refresh();
    refreshSummary();
    // An edit goes straight back to the record, so its new history entry is in view.
    if (editor !== "new") {
      setEditor(null);
      detail.open(saved._id);
    }
  };

  const selectCard = (key: MasterlistCardKey) => {
    setHistoryOf(null);
    list.replace({ ...EMPTY_CRITERIA, ...CARD_CRITERIA[key] });
  };

  const showHistory = (resident: ResidentIdentity) => {
    if (!resident.masterResidentId) return;
    detail.close();
    setEditor(null);
    setHistoryOf(resident);
    list.replace({ ...EMPTY_CRITERIA, masterResidentId: resident.masterResidentId });
  };

  const clearFilters = () => {
    setHistoryOf(null);
    list.replace(EMPTY_CRITERIA);
  };

  return {
    list,
    view,
    summary,
    serviceForms,
    detail,
    editor,
    historyOf,
    openNew: () => setEditor("new"),
    openEdit: (target: MasterlistDetail) => {
      detail.close();
      setEditor(target);
    },
    closeEditor: () => setEditor(null),
    onSaved,
    selectCard,
    showHistory,
    clearFilters,
    canEncode: (summary?.services.length ?? 0) > 0,
  };
};

export type MasterlistScreenState = ReturnType<typeof useMasterlistScreen>;
