import { useCallback, useMemo, useRef, useState } from "react";

import { toast } from "@/components/feedback";
import { RESIDENCY } from "@/config/residency";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

import type { MasterResidentInput, MasterResidentRecord } from "../masterList.types";
import {
  emptyMasterForm,
  formFromRecord,
  toMasterInput,
  validateMasterForm,
  type MasterFormErrors,
  type MasterFormField,
} from "../masterResidentForm";
import { MASTER_STEPS, errorsForStep, firstStepWithError } from "../masterResidentSteps";
import { createMasterResident, updateMasterResident } from "../services/masterListApi";

type Options = {
  /** The record to edit; null adds a new one. */
  editing: MasterResidentRecord | null;
  onSaved: (record: MasterResidentRecord) => void;
};

const FORM_FIELDS = new Set<string>(Object.keys(emptyMasterForm("")));
const REVIEW_INDEX = MASTER_STEPS.length - 1;

const keepFormFields = (fieldErrors?: Record<string, string>): MasterFormErrors =>
  Object.fromEntries(Object.entries(fieldErrors ?? {}).filter(([field]) => FORM_FIELDS.has(field)));

/**
 * The record wizard: same rhythm as resident registration (step, check,
 * continue, review, save). Editing opens on Review with every step done, so a
 * one-field fix is Edit, change, Save.
 */
export const useMasterResidentEditor = ({ editing, onSaved }: Options) => {
  const isEditing = Boolean(editing);
  const [values, setValues] = useState<MasterResidentInput>(() =>
    editing ? formFromRecord(editing) : emptyMasterForm(RESIDENCY.barangay)
  );
  const [errors, setErrors] = useState<MasterFormErrors>({});
  const [stepIndex, setStepIndex] = useState(isEditing ? REVIEW_INDEX : 0);
  const [furthest, setFurthest] = useState(isEditing ? REVIEW_INDEX : 0);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Refs, not state: a double tap must not slip in before the re-render, and
  // the discard prompt reads the latest value.
  const submittingRef = useRef(false);
  const dirtyRef = useRef(false);

  const step = MASTER_STEPS[stepIndex];
  const isLastStep = stepIndex === REVIEW_INDEX;

  const setField = useCallback((field: MasterFormField, value: string) => {
    dirtyRef.current = true;
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
    setSubmitError("");
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index > furthest || index < 0) return;
      setSubmitError("");
      setStepIndex(index);
    },
    [furthest]
  );

  const goBack = useCallback(() => goToStep(stepIndex - 1), [goToStep, stepIndex]);

  const goNext = useCallback(() => {
    const stepErrors = errorsForStep(step.key, validateMasterForm(values, { isEditing }));
    if (Object.keys(stepErrors).length > 0) {
      setErrors((previous) => ({ ...previous, ...stepErrors }));
      return;
    }
    const next = Math.min(REVIEW_INDEX, stepIndex + 1);
    setStepIndex(next);
    setFurthest((previous) => Math.max(previous, next));
  }, [step.key, values, isEditing, stepIndex]);

  const showErrors = useCallback((found: MasterFormErrors, message: string) => {
    setErrors(found);
    setSubmitError(message);
    const index = firstStepWithError(found);
    if (index >= 0) setStepIndex(index);
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;
    const failureTitle = editing ? "Changes not saved" : "Record not added";
    const found = validateMasterForm(values, { isEditing });
    if (Object.keys(found).length > 0) {
      showErrors(found, "Some details need fixing before this record can be saved.");
      // Title only, as for a server refusal: the form already says what to fix.
      toast.error(failureTitle);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      const input = toMasterInput(values, isEditing);
      const saved = editing ? await updateMasterResident(editing._id, input) : await createMasterResident(input);
      dirtyRef.current = false;
      onSaved(saved);
    } catch (caught: unknown) {
      const normalized = normalizeApiError(caught);
      showErrors(keepFormFields(normalized.fieldErrors), normalized.message);
      toastError(failureTitle, caught, { inline: true });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [values, isEditing, editing, onSaved, showErrors]);

  // An existing record is already complete, so every other step (Review
  // included) stays one tap away while editing.
  const completedSteps = useMemo(
    () => MASTER_STEPS.map((_, index) => index !== stepIndex && (isEditing || index < furthest)),
    [furthest, stepIndex, isEditing]
  );

  return {
    values,
    errors,
    submitError,
    submitting,
    isEditing,
    step,
    stepIndex,
    isLastStep,
    completedSteps,
    setField,
    goNext,
    goBack,
    goToStep,
    submit,
    hasUnsavedInput: () => dirtyRef.current,
  };
};

export type MasterResidentEditorState = ReturnType<typeof useMasterResidentEditor>;
