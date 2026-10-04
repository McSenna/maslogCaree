import { useRef, useState } from "react";

import { toMedicalRecordInput, type FormValues } from "@/components/medicalRecord/MedicalRecordForm";
import type { CompletionForm } from "@/services/medicalRecords";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

import { hasMedicalDetail, type VisitValues } from "../recordEditorForm";
import { editMedicalRecord, encodeMedicalRecord, searchMasterlist } from "../services/masterlistRecordsApi";
import { EMPTY_CRITERIA } from "../masterlistLabels";
import type { MasterlistDetail, ResidentIdentity } from "../types";

type SubmitInput = {
  form: CompletionForm;
  resident: ResidentIdentity;
  serviceType: string;
  visit: VisitValues;
  values: FormValues;
  reason: string;
  requestKey: string;
  confirmDuplicate: boolean;
};

/** A possible duplicate: the record it may repeat, when this role can open it. */
export type DuplicateWarning = { existingId: string | null };

const NETWORK_MESSAGE = "Connection lost. Your changes were not saved.";

// The same-day record the server warned about, found through the staff search
// so it only ever names a record this role may open.
const findExisting = async (input: SubmitInput): Promise<string | null> => {
  try {
    const page = await searchMasterlist({
      ...EMPTY_CRITERIA,
      masterResidentId: input.resident.masterResidentId ?? "",
      serviceType: input.serviceType,
      from: input.visit.visitDate,
      to: input.visit.visitDate,
      page: 1,
      limit: 1,
    });
    return page.records[0]?._id ?? null;
  } catch {
    return null;
  }
};

export const useRecordSave = ({ editing, onSaved }: { editing: MasterlistDetail | null; onSaved: (detail: MasterlistDetail) => void }) => {
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateWarning | null>(null);
  const inFlight = useRef(false);

  const submit = async (input: SubmitInput) => {
    if (inFlight.current) return;
    const record = toMedicalRecordInput(input.form, input.values);
    if (!hasMedicalDetail(record)) {
      setSubmitError("Enter at least one medical detail from the record.");
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setSubmitError(null);
    setDuplicate(null);
    const visit = { ...input.visit, visitDate: input.visit.visitDate.trim(), record };
    try {
      const detail = editing
        ? await editMedicalRecord(editing._id, { ...visit, reason: input.reason.trim() })
        : await encodeMedicalRecord({
            ...visit,
            masterResidentId: input.resident.masterResidentId ?? "",
            serviceType: input.serviceType,
            requestKey: input.requestKey,
            confirmDuplicate: input.confirmDuplicate,
          });
      onSaved(detail);
    } catch (caught: unknown) {
      const error = normalizeApiError(caught);
      // A possible duplicate is a question for the user (its own dialog), not a failure.
      if (error.code === "POSSIBLE_DUPLICATE") setDuplicate({ existingId: await findExisting(input) });
      else {
        setSubmitError(error.isNetworkError ? NETWORK_MESSAGE : error.message);
        toastError("Medical record not saved", caught, { inline: true });
      }
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  return {
    submit,
    clear: () => {
      setSubmitError(null);
      setDuplicate(null);
    },
    dismissDuplicate: () => setDuplicate(null),
    state: { saving, submitError, duplicate },
  };
};
