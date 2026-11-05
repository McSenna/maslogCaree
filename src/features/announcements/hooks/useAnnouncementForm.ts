import { useCallback, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import { normalizeApiError } from "@/utils/apiErrorHandler";

import type {
  AnnouncementFormErrors,
  AnnouncementFormField,
  AnnouncementFormValues,
  AnnouncementRecord,
  AnnouncementSubmitPayload,
} from "../announcement.types";
import { errorsAfterBlur, firstInvalidField, hasUnsavedChanges } from "../announcementFormChecks";
import { EMPTY_FORM_VALUES, toBaseline, toFormValues, type EditableAnnouncement } from "../announcementFormValues";
import { hasAnnouncementErrors, mapServerFieldErrors, validateAnnouncementForm } from "../announcementRules";
import { toSubmitPayload } from "../announcementSubmit";

type Focusable = { focus: () => void };
type PendingAction = "post" | "draft" | null;

type AnnouncementFormOptions = {
  /** The announcement being edited; omit to write a new one. */
  editing?: EditableAnnouncement | null;
  onSubmit: (payload: AnnouncementSubmitPayload) => Promise<AnnouncementRecord>;
  onSaved: (announcement: AnnouncementRecord) => void;
  /** Called with the user-facing message when saving fails. */
  onFailed?: (message: string) => void;
};

export const useAnnouncementForm = ({ editing = null, onSubmit, onSaved, onFailed }: AnnouncementFormOptions) => {
  const initial = useMemo(() => (editing ? toFormValues(editing) : EMPTY_FORM_VALUES), [editing]);
  const baseline = useMemo(() => (editing ? toBaseline(initial) : null), [editing, initial]);
  const [values, setValues] = useState<AnnouncementFormValues>(initial);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  // State updates are async, so a fast double tap could read the pending action as empty twice.
  const submittingRef = useRef(false);
  const fields = useRef<Partial<Record<AnnouncementFormField, Focusable>>>({});

  const fieldRef = useCallback(
    (field: AnnouncementFormField) => (node: Focusable | null) => {
      if (node) fields.current[field] = node;
      else delete fields.current[field];
    },
    []
  );

  const showErrors = useCallback((next: AnnouncementFormErrors) => {
    setErrors(next);
    const first = firstInvalidField(next);
    if (first) fields.current[first]?.focus();
  }, []);

  const setField = useCallback(
    <K extends AnnouncementFormField>(field: K, value: AnnouncementFormValues[K]) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
      setSubmitError(null);
    },
    []
  );

  const blurField = useCallback(
    (field: AnnouncementFormField) => {
      setErrors((current) => errorsAfterBlur(field, values, current, new Date(), baseline));
    },
    [values, baseline]
  );

  // Android's picker dialogs have no blur to wait for, and choosing is the moment they finish.
  const pickField = useCallback(
    (field: "date" | "time" | "endDate", value: string) => {
      setField(field, value);
      if (Platform.OS === "web") return;
      setErrors((current) => errorsAfterBlur(field, { ...values, [field]: value }, current, new Date(), baseline));
    },
    [setField, values, baseline]
  );

  const submit = useCallback(
    async (asDraft: boolean) => {
      if (submittingRef.current) return;

      const validation = validateAnnouncementForm(values, new Date(), baseline);
      if (hasAnnouncementErrors(validation)) {
        showErrors(validation);
        setSubmitError("Check the highlighted fields and try again.");
        return;
      }

      submittingRef.current = true;
      setPendingAction(asDraft ? "draft" : "post");
      setSubmitError(null);

      try {
        onSaved(await onSubmit(toSubmitPayload(values, asDraft)));
      } catch (caught: unknown) {
        // Entered values stay as they are so nothing has to be retyped.
        const normalized = normalizeApiError(caught);
        showErrors(mapServerFieldErrors(normalized.fieldErrors));
        setSubmitError(normalized.message);
        onFailed?.(normalized.message);
      } finally {
        submittingRef.current = false;
        setPendingAction(null);
      }
    },
    [values, baseline, showErrors, onSubmit, onSaved, onFailed]
  );

  return {
    values,
    errors,
    submitError,
    pendingAction,
    submitting: pendingAction !== null,
    setField,
    blurField,
    pickField,
    fieldRef,
    submit,
    hasUnsavedInput: hasUnsavedChanges(values, initial),
    isEditing: Boolean(editing),
    /** A posted announcement cannot go back to drafts, so the choice only shows before posting. */
    canChooseDraft: !editing || editing.isDraft,
  };
};

export type AnnouncementFormState = ReturnType<typeof useAnnouncementForm>;
