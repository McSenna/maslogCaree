import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  fetchMedicalRecord,
  fetchMyMedicalRecords,
  type CompletionForm,
  type MedicalRecord,
} from "@/services/medicalRecords";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

/**
 * The signed-in resident's own clinical history.
 *
 * Refetched on focus rather than polled: a record appears when a health worker
 * closes a visit, which is not something the resident is watching for in real
 * time, and coming back to the screen is the moment they want it current.
 */
export function useResidentMedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** The record being read, with the form that labels its service fields. */
  const [viewing, setViewing] = useState<{ record: MedicalRecord; form: CompletionForm | null } | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const everLoaded = useRef(false);
  const mounted = useRef(true);

  useFocusEffect(
    useCallback(() => {
      mounted.current = true;
      let cancelled = false;
      const full = !everLoaded.current;

      (async () => {
        if (full) setLoading(true);
        try {
          const rows = await fetchMyMedicalRecords();
          if (cancelled) return;
          setRecords(rows);
          setError(null);
          everLoaded.current = true;
        } catch (e: unknown) {
          if (cancelled) return;
          setError(getApiErrorMessage(e, "Unable to load your medical records."));
          if (full) setRecords([]);
        } finally {
          if (!cancelled && full) setLoading(false);
        }
      })();

      return () => {
        cancelled = true;
        mounted.current = false;
      };
    }, [])
  );

  /**
   * Opens one record in full.
   *
   * The list arrives without `notes` — the server withholds the health
   * worker's own column from a resident — and this re-reads by id for the
   * form that labels the service fields, not for anything extra.
   */
  const openRecord = useCallback(async (record: MedicalRecord) => {
    setViewLoading(true);
    // Shown immediately from the list copy so the sheet is never empty while
    // the labelled form is still on its way.
    setViewing({ record, form: null });
    try {
      const detail = await fetchMedicalRecord(record._id);
      if (mounted.current) setViewing({ record: detail.medicalRecord, form: detail.form });
    } catch {
      // The list copy is already on screen and is enough to read.
    } finally {
      if (mounted.current) setViewLoading(false);
    }
  }, []);

  const closeRecord = useCallback(() => setViewing(null), []);

  return { records, loading, error, viewing, viewLoading, openRecord, closeRecord };
}
