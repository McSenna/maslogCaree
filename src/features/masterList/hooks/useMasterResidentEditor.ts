import { useCallback, useEffect, useRef, useState } from "react";

import { Platform } from "react-native";

import { toast } from "@/components/feedback";
import { RESIDENCY } from "@/config/residency";
import { ERROR_CODES } from "@/utils/errorCodes";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

import type {
  MasterResidentInput,
  MasterResidentRecord,
} from "../masterList.types";
import {
  emptyMasterForm,
  formFromRecord,
  toMasterInput,
  validateMasterForm,
  type MasterFormErrors,
  type MasterFormField,
} from "../masterResidentForm";
import {
  createMasterResident,
  updateMasterResident,
} from "../services/masterListApi";

type Options = {
  /** The record to edit; null adds a new one. */
  editing: MasterResidentRecord | null;
  onSaved: (record: MasterResidentRecord) => void;
};

const FORM_FIELDS = new Set<string>(Object.keys(emptyMasterForm("")));

const keepFormFields = (
  fieldErrors?: Record<string, string>,
): MasterFormErrors =>
  Object.fromEntries(
    Object.entries(fieldErrors ?? {}).filter(([field]) =>
      FORM_FIELDS.has(field),
    ),
  );

/** Single-page editor; validation and API payloads match the official registry. */
export const useMasterResidentEditor = ({ editing, onSaved }: Options) => {
  const isEditing = Boolean(editing);
  const [values, setValues] = useState<MasterResidentInput>(() =>
    editing ? formFromRecord(editing) : emptyMasterForm(RESIDENCY.barangay),
  );
  const [errors, setErrors] = useState<MasterFormErrors>({});
  const [errorRevision, setErrorRevision] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Refs, not state: a double tap must not slip in before the re-render, and
  // the discard prompt reads the latest value.
  const submittingRef = useRef(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  const setField = useCallback((field: MasterFormField, value: string) => {
    if (submittingRef.current) return;
    dirtyRef.current = true;
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
    setSubmitError("");
  }, []);

  const showErrors = useCallback((found: MasterFormErrors, message: string) => {
    setErrors(found);
    setSubmitError(message);
    setErrorRevision((previous) => previous + 1);
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;
    const failureTitle = editing ? "Changes not saved" : "Record not added";
    const found = validateMasterForm(values, { isEditing });
    if (Object.keys(found).length > 0) {
      showErrors(
        found,
        "Some details need fixing before this record can be saved.",
      );
      // Title only, as for a server refusal: the form already says what to fix.
      toast.error(failureTitle);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    try {
      const input = toMasterInput(values, isEditing);
      const saved = editing
        ? await updateMasterResident(editing._id, input)
        : await createMasterResident(input);
      dirtyRef.current = false;
      onSaved(saved);
    } catch (caught: unknown) {
      const normalized = normalizeApiError(caught);
      const isDuplicateResident =
        normalized.code === ERROR_CODES.DUPLICATE_RESOURCE &&
        Boolean(
          normalized.fieldErrors?.firstName && normalized.fieldErrors?.address,
        );
      // A matching record is a form-level error, rather than nine invalid fields.
      showErrors(
        isDuplicateResident ? {} : keepFormFields(normalized.fieldErrors),
        normalized.message,
      );
      toastError(
        isDuplicateResident ? normalized.message : failureTitle,
        caught,
        { inline: true },
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [values, isEditing, editing, onSaved, showErrors]);

  return {
    values,
    errors,
    submitError,
    submitting,
    isEditing,
    errorRevision,
    setField,
    submit,
    hasUnsavedInput: () => dirtyRef.current,
  };
};

export type MasterResidentEditorState = ReturnType<
  typeof useMasterResidentEditor
>;
