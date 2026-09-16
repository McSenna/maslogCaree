import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchMedicalRecord,
  type CompletionForm,
  type MedicalRecord,
} from "@/services/medicalRecords";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useMedicalRecordViewer = () => {
  const [viewing, setViewing] = useState<{
    record: MedicalRecord;
    form: CompletionForm | null;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const open = useCallback(async (record: MedicalRecord) => {
    setError(null);
    setLoading(true);
    setViewing({ record, form: null });

    try {
      const detail = await fetchMedicalRecord(record._id);
      if (mounted.current) setViewing({ record: detail.medicalRecord, form: detail.form });
    } catch {
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const openById = useCallback(async (recordId: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const detail = await fetchMedicalRecord(recordId);
      if (!mounted.current) return false;
      setViewing({ record: detail.medicalRecord, form: detail.form });
      return true;
    } catch (e: unknown) {
      if (mounted.current) {
        setError(getApiErrorMessage(e, "Unable to open this medical record."));
      }
      return false;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    setViewing(null);
    setError(null);
  }, []);

  return { viewing, loading, error, open, openById, close };
};
