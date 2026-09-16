import { useCallback, useMemo, useRef, useState } from "react";
import {
  validateEditProfileValues,
  type EditProfileErrors,
} from "../validation/editProfileValidation";

export type EditProfileValues = {
  fullname: string;
  email: string;
  phone: string;
  address: string;
};

export type EditProfileInitial = EditProfileValues;

const EMPTY_VALUES: EditProfileValues = { fullname: "", email: "", phone: "", address: "" };

export const useEditProfileForm = () => {
  const [values, setValues] = useState<EditProfileValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const baseline = useRef<EditProfileInitial>(EMPTY_VALUES);

  const syncTo = useCallback((initial: EditProfileInitial) => {
    baseline.current = initial;
    setValues({
      fullname: initial.fullname,
      email: initial.email,
      phone: initial.phone,
      address: initial.address,
    });
    setErrors({});
  }, []);

  const setField = useCallback((field: keyof EditProfileValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field as keyof EditProfileErrors] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const isDirty = useMemo(() => {
    const base = baseline.current;
    return (
      values.fullname.trim() !== base.fullname.trim() ||
      values.phone.trim() !== base.phone.trim() ||
      values.address.trim() !== base.address.trim()
    );
  }, [values]);

  const validate = useCallback(() => {
    const nextErrors = validateEditProfileValues(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const buildPayload = useCallback(() => {
    const base = baseline.current;
    const payload: Record<string, string> = {};

    if (values.fullname.trim() !== base.fullname.trim()) payload.fullname = values.fullname.trim();
    if (values.phone.trim() !== base.phone.trim()) payload.phone = values.phone.trim();
    if (values.address.trim() !== base.address.trim()) payload.address = values.address.trim();

    return payload;
  }, [values]);

  return { values, errors, setField, isDirty, syncTo, validate, buildPayload };
};
