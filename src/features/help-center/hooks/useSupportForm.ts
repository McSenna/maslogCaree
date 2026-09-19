import { useCallback, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { submitSupportTicket } from "../services/supportService";
import { hasSupportErrors, validateSupportForm } from "../validation/supportValidation";
import { useSupportAttachments } from "./useSupportAttachments";
import type {
  SupportFormErrors,
  SupportFormValues,
  SupportTicket,
} from "../types/support.types";

const emptyValues: SupportFormValues = {
  fullName: "",
  contactEmail: "",
  contactNumber: "",
  category: "",
  subject: "",
  description: "",
};

export const useSupportForm = (onSubmitted?: (ticket: SupportTicket) => void) => {
  const { user } = useAuth();
  const attachments = useSupportAttachments();

  const profileValues = useMemo<SupportFormValues>(
    () => ({
      ...emptyValues,
      fullName: user?.name ?? "",
      contactEmail: user?.email ?? "",
      contactNumber: user?.phone ?? "",
    }),
    [user?.name, user?.email, user?.phone]
  );

  const [overrides, setOverrides] = useState<Partial<SupportFormValues>>({});
  const [errors, setErrors] = useState<SupportFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const values = useMemo<SupportFormValues>(
    () => ({ ...profileValues, ...overrides }),
    [profileValues, overrides]
  );

  const setField = useCallback(<K extends keyof SupportFormValues>(
    field: K,
    value: SupportFormValues[K]
  ) => {
    setOverrides((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  }, []);

  const reset = useCallback(() => {
    setOverrides({});
    setErrors({});
    setSubmitError(null);
    attachments.resetAttachments();
  }, [attachments]);

  const submit = useCallback(async () => {
    if (submitting) return;

    const validation = validateSupportForm(values, attachments.attachments);
    if (hasSupportErrors(validation)) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const ticket = await submitSupportTicket(values, attachments.attachments);
      reset();
      onSubmitted?.(ticket);
    } catch (caught: unknown) {
      const normalized = normalizeApiError(caught);
      setErrors(normalized.fieldErrors ?? {});
      setSubmitError(normalized.message);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, values, attachments.attachments, reset, onSubmitted]);

  return { values, errors, submitError, submitting, setField, submit, reset, attachments };
};
