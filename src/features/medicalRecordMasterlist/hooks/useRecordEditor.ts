import { useCallback, useMemo, useRef, useState } from "react";

import { emptyValues, useMedicalRecordForm } from "@/components/medicalRecord/MedicalRecordForm";
import type { FieldValue } from "@/components/medicalRecord/MedicalFieldInput";
import type { CompletionForm } from "@/services/medicalRecords";

import {
  EMPTY_VISIT,
  newRequestKey,
  relaxForEncoding,
  residentProblem,
  sectionsNeedingFixes,
  validateVisit,
  valuesFromRecord,
  visitFromRecord,
  type VisitValues,
} from "../recordEditorForm";
import type { MasterlistDetail, ResidentIdentity } from "../types";
import { useRecordSave } from "./useRecordSave";

type Options = {
  editing: MasterlistDetail | null;
  forms: CompletionForm[];
  onSaved: (detail: MasterlistDetail) => void;
  /** Closes the form after a save, unless it is kept open for the next record. */
  onDone: () => void;
};

/**
 * One form for adding or editing an encoded record: resident, visit, medical
 * details. Save checks everything at once. With "keep open" on, a saved record
 * clears the visit and readings but keeps the confirmed resident, service and
 * provider, so a stack of paper records is confirmed once.
 */
export const useRecordEditor = ({ editing, forms, onSaved, onDone }: Options) => {
  const editForm = useMemo(() => (editing ? relaxForEncoding(editing.form) : null), [editing]);
  const [resident, setResident] = useState<ResidentIdentity | null>(editing?.resident ?? null);
  const [confirmed, setConfirmed] = useState(Boolean(editing));
  const [residentError, setResidentError] = useState("");
  const [serviceType, setServiceType] = useState(editing?.serviceType ?? (forms.length === 1 ? forms[0].categoryKey : ""));
  const [visit, setVisit] = useState<VisitValues>(editing ? visitFromRecord(editing.record) : EMPTY_VISIT);
  const [visitErrors, setVisitErrors] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [keepOpen, setKeepOpen] = useState(false);
  const [nextCount, setNextCount] = useState(0);
  const requestKey = useRef(newRequestKey());

  const form = useMemo(
    () => editForm ?? forms.find((candidate) => candidate.categoryKey === serviceType) ?? null,
    [editForm, forms, serviceType]
  );
  const medical = useMedicalRecordForm(form, editing && editForm ? valuesFromRecord(editForm, editing.record) : undefined);
  const snapshot = JSON.stringify({ visit, values: medical.values, reason, resident: resident?.masterResidentId });
  // What the form opened with, so closing an untouched form never asks to discard.
  const [opened, setOpened] = useState(snapshot);

  // Same person, service and provider; a fresh visit, readings and request key.
  const startNext = () => {
    const nextVisit = { ...visit, visitDate: "", visitReason: "" };
    requestKey.current = newRequestKey();
    medical.reset(form);
    setVisit(nextVisit);
    setOpened(JSON.stringify({ visit: nextVisit, values: emptyValues(form), reason, resident: resident?.masterResidentId }));
    setNextCount((count) => count + 1);
  };

  const save = useRecordSave({
    editing,
    onSaved: (detail) => {
      onSaved(detail);
      if (keepOpen && !editing) startNext();
      else onDone();
    },
  });

  const chooseResident = useCallback((picked: ResidentIdentity | null) => {
    setResident(picked);
    setConfirmed(false);
    setResidentError("");
  }, []);

  const chooseService = useCallback(
    (key: string) => {
      setServiceType(key);
      setVisitErrors((current) => ({ ...current, serviceType: "" }));
      medical.reset(forms.find((candidate) => candidate.categoryKey === key) ?? null);
    },
    [forms, medical]
  );

  const setVisitField = useCallback((key: string, value: FieldValue) => {
    setVisit((current) => ({ ...current, [key]: typeof value === "string" ? value : "" }));
    setVisitErrors((current) => (current[key] ? { ...current, [key]: "" } : current));
  }, []);

  // Runs every check at once so all problems show together, not one at a time.
  const validate = () => {
    const whoProblem = residentProblem(resident, confirmed);
    setResidentError(whoProblem);
    const errors = validateVisit(visit, resident);
    if (!serviceType) errors.serviceType = "Choose the service on the record.";
    setVisitErrors(errors);
    const medicalOk = form ? medical.validate() : true;
    const reasonOk = !editing || Boolean(reason.trim());
    setReasonError(reasonOk ? "" : "Say why this record is being changed.");
    return !whoProblem && Object.keys(errors).length === 0 && medicalOk && reasonOk;
  };

  const submit = (confirmDuplicate = false) => {
    if (!validate() || !form || !resident) return;
    void save.submit({ form, resident, serviceType, visit, values: medical.values, reason, requestKey: requestKey.current, confirmDuplicate });
  };

  // Each error clears as its field is fixed, so this list shrinks while staff work.
  const problems = sectionsNeedingFixes({
    resident: residentError,
    visit: visitErrors,
    medical: medical.errors,
    medicalLabel: form ? `${form.label} details` : "",
    reason: reasonError,
  });

  return {
    isEditing: Boolean(editing),
    resident,
    chooseResident,
    confirmed,
    setConfirmed: (next: boolean) => {
      setConfirmed(next);
      if (next) setResidentError("");
    },
    residentError,
    serviceType,
    chooseService,
    form,
    visit,
    visitErrors,
    setVisitField,
    medical,
    reason,
    setReason: (text: string) => {
      setReason(text);
      setReasonError("");
    },
    reasonError,
    keepOpen,
    setKeepOpen,
    nextCount,
    problems,
    submit,
    ...save.state,
    dismissDuplicate: save.dismissDuplicate,
    hasUnsavedInput: snapshot !== opened,
  };
};

export type RecordEditorState = ReturnType<typeof useRecordEditor>;
