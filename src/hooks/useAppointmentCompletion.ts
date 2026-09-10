import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppointmentRecord } from "@/services/appointments";
import {
  fetchCompletionForms,
  fetchMedicalRecord,
  type CompletionForm,
  type MedicalRecord,
} from "@/services/medicalRecords";

/**
 * Everything the Complete flow needs, kept out of the screens.
 *
 * Both provider screens run the same sequence — open a card, fill the record,
 * save, refresh — so it lives here once and they stay layout. The screens
 * supply `onCompleted`, which is the only part that differs: what to reload
 * afterwards.
 */
export function useAppointmentCompletion({
  onCompleted,
}: {
  /** Called after a successful save, to revalidate whatever the screen shows. */
  onCompleted: (appointment: AppointmentRecord) => void | Promise<void>;
}) {
  const [forms, setForms] = useState<CompletionForm[]>([]);
  const [formsError, setFormsError] = useState<string | null>(null);

  /** The appointment being completed, or null when the modal is closed. */
  const [target, setTarget] = useState<AppointmentRecord | null>(null);

  /** The row whose request is in flight — disables just that row's button. */
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

  /**
   * The catalogue, once per mount.
   *
   * A failure here is not surfaced as a blocking error: the queue still lists
   * patients and everything else on the screen works. The modal shows its own
   * loading state, and the Save button stays disabled until a form arrives —
   * so the worst case is a completion that cannot start, not a broken page.
   */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await fetchCompletionForms();
        if (!cancelled) setForms(loaded);
      } catch {
        if (!cancelled) setFormsError("The completion form could not be loaded.");
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

  /** Opens the form. Writes nothing — the server sees no request until Confirm. */
  const openComplete = useCallback((appointment: AppointmentRecord) => {
    setTarget(appointment);
  }, []);

  const closeComplete = useCallback(() => setTarget(null), []);

  /**
   * Called by the modal after the server confirms.
   *
   * `alreadyCompleted` arrives when a second submit lost the race. It is not
   * an error — the visit is on file and the patient has left the queue — so it
   * closes and refreshes exactly like a first success.
   */
  const handleCompleted = useCallback(
    async (result: { appointment: AppointmentRecord; alreadyCompleted?: boolean }) => {
      setBusyId(result.appointment?._id ?? null);
      setTarget(null);
      try {
        await onCompleted(result.appointment);
      } finally {
        if (mounted.current) setBusyId(null);
      }
    },
    [onCompleted]
  );

  /** Opens a completed appointment's record, fetching it by id. */
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
}
