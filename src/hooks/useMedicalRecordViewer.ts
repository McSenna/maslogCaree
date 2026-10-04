import { useCallback, useState } from "react";

import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";
import { fetchMedicalRecord, type MedicalRecord } from "@/services/medicalRecords";

/**
 * Owns the "view my medical details" dialog. The dialog opens as soon as a
 * record is requested so the resident sees a loading state, then resolves to
 * the record, an empty state (no record filed yet) or a retryable error. While
 * open, a health worker's edit to the record shows up without reopening it.
 */
export const useMedicalRecordViewer = () => {
  const [recordId, setRecordId] = useState<string | null>(null);
  const { item, loading, error, deleted, reload } = useRealtimeItem("myMedicalRecord", recordId, fetchMedicalRecord, {
    errorMessage: "Unable to load medical details.",
  });

  const openById = useCallback((id: string) => setRecordId(id), []);
  const open = useCallback((record: MedicalRecord) => setRecordId(record._id), []);
  const close = useCallback(() => setRecordId(null), []);

  // A missing record is an empty state, not a failure: the visit is closed but
  // the health worker has not filed the details yet.
  const shown = deleted ? null : item;

  return {
    isOpen: recordId !== null,
    record: shown?.medicalRecord ?? null,
    form: shown?.form ?? null,
    loading,
    error: deleted ? null : error,
    open,
    openById,
    retry: reload,
    close,
  };
};
