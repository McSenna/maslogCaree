import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppointmentRecord } from "@/services/appointments";
import {
  fetchCompletionForms,
  fetchMedicalRecord,
  type CompletionForm,
  type MedicalRecord,
} from "@/services/medicalRecords";

export const useAppointmentCompletion = ({
  onCompleted,
}: {
  onCompleted: (appointment: AppointmentRecord) => void | Promise<void>;
}) => {
  const [forms, setForms] = useState<CompletionForm[]>([]);
  const [formsError, setFormsError] = useState<string | null>(null);

  const [target, setTarget] = useState<AppointmentRecord | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const [viewing, setViewing] = useState<{ record: MedicalRecord; form: CompletionForm | null } | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await fetchCompletionForms();
        if (!cancelled) setForms(loaded);
      } catch {
        if (!cancelled)
          setFormsError(
            "The completion form could not be loaded. Check your connection and reopen this appointment."
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const formFor = useCallback(
    (categoryKey: string | undefined) => forms.find((f) => f.categoryKey === categoryKey) ?? null,
    [forms]
  );

  const targetForm = useMemo(() => formFor(target?.consultationType), [formFor, target]);

  const openComplete = useCallback((appointment: AppointmentRecord) => {
    setTarget(appointment);
  }, []);

  const closeComplete = useCallback(() => setTarget(null), []);

  const handleCompleted = useCallback(
    async (result: { appointment: AppointmentRecord; alreadyCompleted?: boolean }) => {
      setBusyId(result.appointment?._id ?? null);
      try {
        await onCompleted(result.appointment);
      } finally {
        if (mounted.current) setBusyId(null);
      }
    },
    [onCompleted]
  );

  const openRecord = useCallback(
    async (appointment: AppointmentRecord) => {
      const recordId = appointment.medicalRecord;
      if (!recordId) return;
      setViewLoading(true);
      try {
        const { medicalRecord, form } = await fetchMedicalRecord(String(recordId));
        if (mounted.current) setViewing({ record: medicalRecord, form });
      } catch {
        if (mounted.current) setViewing(null);
      } finally {
        if (mounted.current) setViewLoading(false);
      }
    },
    []
  );

  const closeRecord = useCallback(() => setViewing(null), []);

  return {
    forms,
    formsError,
    formFor,
    target,
    targetForm,
    busyId,
    openComplete,
    closeComplete,
    handleCompleted,
    viewing,
    viewLoading,
    openRecord,
    closeRecord,
  };
};
