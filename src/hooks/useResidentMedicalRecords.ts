import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchMyMedicalRecords, type MedicalRecord } from "@/services/medicalRecords";
import { useMedicalRecordViewer } from "@/hooks/useMedicalRecordViewer";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useResidentMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const viewer = useMedicalRecordViewer();

  const everLoaded = useRef(false);
  const mounted = useRef(true);

  const load = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    try {
      const rows = await fetchMyMedicalRecords();
      if (!mounted.current) return;
      setRecords(rows);
      setError(null);
      everLoaded.current = true;
    } catch (e: unknown) {
      if (!mounted.current) return;
      setError(getApiErrorMessage(e, "Unable to load your medical records."));
      if (showSpinner) setRecords([]);
    } finally {
      if (mounted.current && showSpinner) setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    void load(true);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      mounted.current = true;
      void load(!everLoaded.current);

      return () => {
        mounted.current = false;
      };
    }, [load])
  );

  return {
    records,
    loading,
    error,
    refetch,
    viewing: viewer.viewing,
    viewLoading: viewer.loading,
    openRecord: viewer.open,
    closeRecord: viewer.close,
  };
};
