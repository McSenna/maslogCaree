import { useCallback, useRef, useState } from "react";

import { normalizeApiError } from "@/utils/apiErrorHandler";

import type {
  AnnouncementFormErrors,
  AnnouncementFormField,
  AnnouncementFormValues,
  AnnouncementRecord,
} from "../announcement.types";
import {
  hasAnnouncementErrors,
  mapServerFieldErrors,
  toCreatePayload,
  validateAnnouncementForm,
} from "../announcementRules";
import { createAnnouncement } from "../services/announcementService";

const EMPTY_VALUES: AnnouncementFormValues = {
  title: "",
  message: "",
  date: "",
  time: "",
  location: "",
};

type CreateAnnouncementCallbacks = {
  onCreated: (announcement: AnnouncementRecord) => void;
  /** Called with the user-facing message when the post fails. */
  onFailed?: (message: string) => void;
};

export const useCreateAnnouncementForm = ({ onCreated, onFailed }: CreateAnnouncementCallbacks) => {
  const [values, setValues] = useState<AnnouncementFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<AnnouncementFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // State updates are async, so a fast double tap could read `submitting` as false twice.
  const submittingRef = useRef(false);

  const setField = useCallback((field: AnnouncementFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError(null);
  }, []);

  const reset = useCallback(() => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setSubmitError(null);
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;

    const validation = validateAnnouncementForm(values);
    if (hasAnnouncementErrors(validation)) {
      setErrors(validation);
      setSubmitError("Check the highlighted fields and try again.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const announcement = await createAnnouncement(toCreatePayload(values));
      reset();
      onCreated(announcement);
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
  }, [values, reset, onCreated, onFailed]);

  return { values, errors, submitError, submitting, setField, submit, reset };
};

export type CreateAnnouncementForm = ReturnType<typeof useCreateAnnouncementForm>;
