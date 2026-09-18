import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchMedicalRecord,
  type CompletionForm,
  type MedicalRecord,
} from "@/services/medicalRecords";
import { getApiErrorMessage, isNotFoundError } from "@/utils/apiErrorHandler";

type ViewerState = {
  isOpen: boolean;
  record: MedicalRecord | null;
  form: CompletionForm | null;
  loading: boolean;
  error: string | null;
};

const CLOSED: ViewerState = {
  isOpen: false,
  record: null,
  form: null,
  loading: false,
  error: null,
};

/**
 * Owns the "view my medical details" dialog. The dialog opens as soon as a
 * record is requested so the resident sees a loading state, then resolves to
 * the record, an empty state (no record filed yet) or a retryable error.
 */
export const useMedicalRecordViewer = () => {
  const [state, setState] = useState<ViewerState>(CLOSED);
  const lastRequestedId = useRef<string | null>(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const openById = useCallback(async (recordId: string): Promise<boolean> => {
    lastRequestedId.current = recordId;
    setState({ isOpen: true, record: null, form: null, loading: true, error: null });

    try {
      const detail = await fetchMedicalRecord(recordId);
      if (!mounted.current || lastRequestedId.current !== recordId) return false;

      setState({
        isOpen: true,
        record: detail.medicalRecord,
        form: detail.form ?? null,
        loading: false,
        error: null,
      });
      return true;
    } catch (e: unknown) {
      if (!mounted.current || lastRequestedId.current !== recordId) return false;

      // A missing record is an empty state, not a failure: the visit is closed
      // but the health worker has not filed the details yet.
      setState({
        isOpen: true,
        record: null,
        form: null,
        loading: false,
        error: isNotFoundError(e)
          ? null
          : getApiErrorMessage(e, "Unable to load medical details."),
      });
      return false;
    }
  }, []);

  const open = useCallback(
    (record: MedicalRecord) => openById(record._id),
    [openById]
  );

  const retry = useCallback(() => {
    const id = lastRequestedId.current;
    if (id) void openById(id);
  }, [openById]);

  const close = useCallback(() => {
    lastRequestedId.current = null;
    setState(CLOSED);
  }, []);

  return { ...state, open, openById, retry, close };
};
