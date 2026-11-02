import { fetchMasterlistRecord } from "../services/masterlistRecordsApi";
import { useAuth } from "@/contexts/AuthContext";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import { clearImmunizationEditorRequest, getImmunizationEditorRequest, getChecklistRequestVersion, subscribeImmunizationSelection } from "@/features/immunization/selection";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";

import { toast } from "@/components/feedback";
import { resolveMasterListView } from "@/features/masterList/masterListView";

import { CARD_CRITERIA, EMPTY_CRITERIA, recordReference, type MasterlistCardKey } from "../masterlistLabels";
import type { MasterlistDetail, ResidentIdentity } from "../types";
import { mayWriteMedicalRecords } from "../recordWriteAccess";
import { useMasterlistRecords } from "./useMasterlistRecords";
import { useMasterlistSummary } from "./useMasterlistSummary";
import { useRecordDetail } from "./useRecordDetail";
import useRecordDeletion from "./useRecordDeletion";
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
  const { user } = useAuth();
  const canWriteRecords = mayWriteMedicalRecords(user);
  const deletion = useRecordDeletion(() => { detail.close(); list.refresh(); refreshSummary(); });
  const requestVersion = useSyncExternalStore(subscribeImmunizationSelection, getChecklistRequestVersion, () => 0);
  const [initialServiceType, setInitialServiceType] = useState("");
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const editLoading = useRef(false);
  const editImmunization = useCallback(async (id: string) => {
    if (user?.role !== "midwife" || editLoading.current) return;
    editLoading.current = true;
    setEditLoadingId(id);
    try {
      const target = await fetchMasterlistRecord(id);
      if (target.baby) { detail.close(); setEditor(target); }
    } catch { toast.error("Record could not be opened. Refresh the table and try again."); }
    finally { editLoading.current = false; setEditLoadingId(null); }
  }, [user?.role, detail]);
  useSyncOnChange([requestVersion, user?.role], () => {
    if (user?.role === "midwife" && getImmunizationEditorRequest()) {
      setInitialServiceType("immunization");
      setEditor("new");
    }
  });
  const closeEditor = () => {
    clearImmunizationEditorRequest();
    setEditor(null);
    list.refresh();
    refreshSummary();
  };
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
    initialServiceType,
    historyOf,
    openNew: () => {
      if (!canWriteRecords) return;
      setInitialServiceType("");
      setEditor("new");
    },
    openEdit: (target: MasterlistDetail) => {
      if (!canWriteRecords || !(target.editable || (target.baby && user?.role === "midwife"))) return;
      detail.close();
      setEditor(target);
    },
    closeEditor,
    onSaved,
    selectCard,
    showHistory,
    clearFilters,
    deletion,
    editLoadingId,
    editImmunization: user?.role === "midwife" ? editImmunization : undefined,
    canWriteRecords,
    canEncode: canWriteRecords && (summary?.services.length ?? 0) > 0,
  };
};

export type MasterlistScreenState = ReturnType<typeof useMasterlistScreen>;
