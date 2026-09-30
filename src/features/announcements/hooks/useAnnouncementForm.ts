import { useCallback, useMemo, useRef, useState } from "react";

import { normalizeApiError } from "@/utils/apiErrorHandler";

import type {
  AnnouncementFormErrors,
  AnnouncementFormField,
  AnnouncementFormValues,
  AnnouncementRecord,
} from "../announcement.types";
import {
  EMPTY_FORM_VALUES,
  toBaseline,
  toFormValues,
  type EditableAnnouncement,
} from "../announcementFormValues";
import {
  hasAnnouncementErrors,
  mapServerFieldErrors,
  toCreatePayload,
  validateAnnouncementForm,
} from "../announcementRules";
import { createAnnouncement, updateAnnouncement } from "../services/announcementService";

type AnnouncementFormOptions = {
  /** The announcement being edited; omit to write a new one. */
  editing?: EditableAnnouncement | null;
  onSaved: (announcement: AnnouncementRecord) => void;
  /** Called with the user-facing message when saving fails. */
  onFailed?: (message: string) => void;
};

export const useAnnouncementForm = ({ editing = null, onSaved, onFailed }: AnnouncementFormOptions) => {
  const initial = useMemo(() => (editing ? toFormValues(editing) : EMPTY_FORM_VALUES), [editing]);
  const [values, setValues] = useState<AnnouncementFormValues>(initial);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // State updates are async, so a fast double tap could read `submitting` as false twice.
  const submittingRef = useRef(false);

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

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    setSubmitError(null);
  }, [initial]);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;

    const validation = validateAnnouncementForm(values, new Date(), editing ? toBaseline(initial) : null);
    if (hasAnnouncementErrors(validation)) {
      setErrors(validation);
      setSubmitError("Check the highlighted fields and try again.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = toCreatePayload(values);
      const saved = editing ? await updateAnnouncement(editing.id, payload) : await createAnnouncement(payload);
      onSaved(saved);
    } catch (caught: unknown) {
      // Entered values stay as they are so nothing has to be retyped.
      const normalized = normalizeApiError(caught);
      setErrors(mapServerFieldErrors(normalized.fieldErrors));
      setSubmitError(normalized.message);
      onFailed?.(normalized.message);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [values, editing, initial, onSaved, onFailed]);

  return {
    values,
    errors,
    submitError,
    submitting,
    setField,
    submit,
    reset,
    isEditing: Boolean(editing),
    /** A posted announcement cannot go back to drafts, so the choice only shows before posting. */
    canChooseDraft: !editing || editing.isDraft,
  };
};

export type AnnouncementFormState = ReturnType<typeof useAnnouncementForm>;
