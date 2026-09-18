import { useCallback, useMemo, useRef, useState } from "react";
import {
  EMPTY_EDIT_PROFILE_VALUES,
  PROFILE_EDIT_SECTION_FIELDS,
  type EditProfileField,
  type EditProfileValues,
  type ProfileEditSection,
} from "../config/profileEditSections";
import {
  validateEditProfileValues,
  type EditProfileErrors,
} from "../validation/editProfileValidation";

export type { EditProfileValues } from "../config/profileEditSections";

const NAME_FIELDS: EditProfileField[] = ["firstName", "middleName", "surname"];

/**
 * The backend rebuilds `fullname` from the name parts, so a change to any one
 * of them must carry the other two — otherwise unchanged parts that are still
 * blank in the database would be dropped from the rebuilt full name.
 */
const withCompleteName = (fields: EditProfileField[]): EditProfileField[] => {
  if (!fields.some((field) => NAME_FIELDS.includes(field))) return fields;
  return [...new Set([...fields, ...NAME_FIELDS])];
};

export const useEditProfileForm = (section: ProfileEditSection | null) => {
  const [values, setValues] = useState<EditProfileValues>(EMPTY_EDIT_PROFILE_VALUES);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const baseline = useRef<EditProfileValues>(EMPTY_EDIT_PROFILE_VALUES);

  const syncTo = useCallback((initial: EditProfileValues) => {
    baseline.current = initial;
    setValues(initial);
    setErrors({});
  }, []);

  const setField = useCallback((field: EditProfileField, value: string) => {
    setValues((prev) => (prev[field] === value ? prev : { ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const changedFields = useMemo<EditProfileField[]>(() => {
    if (!section) return [];

    return PROFILE_EDIT_SECTION_FIELDS[section].filter(
      (field) => values[field].trim() !== baseline.current[field].trim()
    );
  }, [section, values]);

  const validate = useCallback(() => {
    if (!section) return false;

    const nextErrors = validateEditProfileValues(values, section);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [section, values]);

  const buildPayload = useCallback(() => {
    const payload: Partial<Record<EditProfileField, string>> = {};
    withCompleteName(changedFields).forEach((field) => {
      payload[field] = values[field].trim();
    });
    return payload;
  }, [changedFields, values]);

  return {
    values,
    errors,
    setField,
    syncTo,
    validate,
    buildPayload,
    isDirty: changedFields.length > 0,
  };
};

export type EditProfileFormState = ReturnType<typeof useEditProfileForm>;
