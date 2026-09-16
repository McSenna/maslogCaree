import { PASSWORD_RULES, meetsAllPasswordRules } from "../forgotPassword/passwordRules";
import { EMPTY_REGISTRATION, type StepKey } from "./registrationOptions";

export type RegistrationValues = typeof EMPTY_REGISTRATION;
export type RegistrationField = keyof RegistrationValues;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PH_MOBILE_PATTERN = /^(?:\+?63|0)9\d{9}$/;

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

const SUFFIX_PATTERN = /^[\p{L}][\p{L}\s.]*$/u;

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

export const formatPhMobile = (value: string) => {
  const digits = digitsOnly(value).slice(0, 11);
  const parts = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 11)];
  return parts.filter(Boolean).join(" ");
};

export const isValidPhMobile = (value: string) =>
  PH_MOBILE_PATTERN.test(digitsOnly(value).length ? digitsOnly(value) : value.trim());

export const STEP_FIELDS: Record<StepKey, RegistrationField[]> = {
  personal: [
    "firstName",
    "middleName",
    "surname",
    "suffix",
    "dateOfBirth",
    "sex",
    "civilStatus",
    "contactNumber",
    "email",
  ],
  identity: ["idType", "idNumber", "idDocument"],
  address: ["houseNumberOrPurok", "street", "barangay", "cityMunicipality", "province"],
  account: ["password", "confirmPassword"],
  review: [],
};

const requiredName = (value: string, label: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required.`;
  if (!NAME_PATTERN.test(trimmed)) return `Please enter a valid ${label.toLowerCase()}.`;
  if (trimmed.length > 50) return `${label} must not exceed 50 characters.`;
  return undefined;
};

export const validateField = (
  field: RegistrationField,
  values: RegistrationValues
): string | undefined => {
  const value = values[field];

  switch (field) {
    case "firstName":
      return requiredName(value, "First name");
    case "surname":
      return requiredName(value, "Surname");

    case "middleName":
      if (!value.trim()) return undefined;
      return requiredName(value, "Middle name");

    case "suffix": {
      const suffix = value.trim();
      if (!suffix) return undefined;
      if (suffix.length > 20) return "Suffix must not exceed 20 characters.";
      return SUFFIX_PATTERN.test(suffix)
        ? undefined
        : "Please enter a valid suffix, such as Jr. or III.";
    }

    case "dateOfBirth":
      if (!value.trim()) return "Date of birth is required.";
      if (new Date(value) > new Date()) return "Date of birth cannot be in the future.";
      return undefined;

    case "sex":
      return value ? undefined : "Please select your sex.";

    case "civilStatus":
      return undefined;

    case "contactNumber":
      if (!value.trim()) return "Contact number is required.";
      return isValidPhMobile(value)
        ? undefined
        : "Please enter a valid Philippine mobile number.";

    case "email":
      if (!value.trim()) return "Email address is required.";
      return EMAIL_PATTERN.test(value.trim())
        ? undefined
        : "Please enter a valid email address.";

    case "password":
      if (!value) return "Password is required.";
      return meetsAllPasswordRules(value)
        ? undefined
        : "Password does not meet the requirements.";

    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      return value === values.password ? undefined : "Passwords do not match.";

    case "cityMunicipality":
      return value.trim() ? undefined : "City / Municipality is required.";

    case "province":
      return value.trim() ? undefined : "Province is required.";

    case "idType":
      return value.trim() ? undefined : "Please select your ID Type.";

    case "idNumber": {
      const trimmed = value.trim();
      if (!trimmed) return "ID Number is required.";
      if (trimmed.length < 3) return "ID Number must be at least 3 characters.";
      if (trimmed.length > 50) return "ID Number must not exceed 50 characters.";
      return undefined;
    }

    case "idDocument":
      return value ? undefined : "Please upload a valid Government ID (JPG, PNG, or PDF).";

    default:
      return undefined;
  }
};

export const validateStep = (step: StepKey, values: RegistrationValues): RegistrationErrors => {
  const errors: RegistrationErrors = {};
  STEP_FIELDS[step].forEach((field) => {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  });
  return errors;
};

export const isStepComplete = (step: StepKey, values: RegistrationValues) =>
  Object.keys(validateStep(step, values)).length === 0;

export { PASSWORD_RULES };
