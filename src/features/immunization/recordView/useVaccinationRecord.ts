import { useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import { immunizationApi } from "../services/immunizationApi";
import type { Checklist } from "../types";
import { detailGroupsOf, doseCountsOf, entriesFromChecklist, nextDoseNote } from "./ledgerEntries";
import { babyIdOf, mayReadDoseLedger, scopeOf } from "./vaccinationScope";
import { entriesFromVisitRecord } from "./visitEntry";

const LOAD_FAILED = "Unable to load the vaccination record. Check your connection and try again.";

type Options = { record: MedicalRecord; form: CompletionForm | null; motherMasterResidentId?: string | null };
type LedgerRead = { checklist: Checklist | null; visit: { day: string; doseKeys: string[] } | null };

const NOTHING_READ: LedgerRead = { checklist: null, visit: null };

/**
 * The one vaccination read for a record. It sits above the tabs, so switching
 * tabs never refetches and both read the same entries. A saved dose updates the
 * program record, and the new `updatedAt` reloads the ledger while the old rows stay.
 */
export const useVaccinationRecord = ({ record, form, motherMasterResidentId }: Options) => {
  const { user } = useAuth();
  const scope = scopeOf(record);
  const babyId = babyIdOf(record);
  const allowed = mayReadDoseLedger(user?.role);
  const readsLedger = scope === "ledger" && babyId !== null && allowed;
  const readsVisit = scope === "ledger_visit" && allowed;
  const key = readsLedger
    ? `${babyId}:${motherMasterResidentId ?? ""}:${record.updatedAt ?? ""}`
    : readsVisit ? `visit:${record._id}:${record.updatedAt ?? ""}` : "no-ledger";

  const remote = useRemoteData<LedgerRead>({
    key,
    load: async () => {
      if (readsLedger) return { checklist: await immunizationApi.checklist(babyId, motherMasterResidentId ?? undefined), visit: null };
      if (!readsVisit) return NOTHING_READ;
      const found = await immunizationApi.visitLedger(record._id);
      return found.linked ? { checklist: found.checklist, visit: { day: found.visitDay, doseKeys: found.visitDoseKeys } } : NOTHING_READ;
    },
  });
  const reads = readsLedger || readsVisit;
  const checklist = reads ? (remote.data?.checklist ?? null) : null;
  const visit = reads ? (remote.data?.visit ?? null) : null;

  const entries = useMemo(() => {
    if (checklist) return entriesFromChecklist(checklist);
    return scope === "single_visit" ? entriesFromVisitRecord(record, form) : [];
  }, [scope, record, form, checklist]);
  const counts = checklist ? doseCountsOf(checklist) : (record.immunizationProgress ?? null);

  return {
    scope,
    /** The server would refuse this role, so the ledger is never requested. */
    restricted: scope !== "single_visit" && !allowed,
    checklist,
    entries,
    groups: detailGroupsOf(entries, visit?.doseKeys ?? null),
    /** Only this visit's care. The baby's complete history stays in `entries`. */
    visit: visit ? { day: visit.day, entries: entries.filter((entry) => visit.doseKeys.includes(entry.id)) } : null,
    /** A completed visit does not complete the program; only every scheduled dose does. */
    programOpen: counts ? counts.administered < counts.total : false,
    counts,
    nextDoseNote: checklist ? nextDoseNote(checklist) : undefined,
    loading: reads && remote.isLoading,
    error: reads && remote.error ? getApiErrorMessage(remote.error, LOAD_FAILED) : null,
    retry: remote.refetch,
  };
};

export type VaccinationRecordState = ReturnType<typeof useVaccinationRecord>;
