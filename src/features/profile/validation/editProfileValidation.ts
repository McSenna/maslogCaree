import { isValidPhMobile } from "@/features/auth/registration/registrationValidation";
import type {
  EditProfileValues,
  ProfileEditSection,
} from "../config/profileEditSections";

export type EditProfileErrors = Partial<Record<keyof EditProfileValues, string>>;

const NAME_RULES = {
  firstName: { label: "First name", required: true },
  surname: { label: "Last name", required: true },
  middleName: { label: "Middle name", required: false },
} as const;

const validateName = (
  field: keyof typeof NAME_RULES,
  value: string,
  errors: EditProfileErrors
) => {
  const { label, required } = NAME_RULES[field];
  const trimmed = value.trim();

  if (!trimmed) {
    if (required) errors[field] = `${label} is required.`;
    return;
  }

  if (trimmed.length < 2 || trimmed.length > 50) {
    errors[field] = `${label} must be between 2 and 50 characters.`;
  }
};

const isFutureDate = (isoDate: string): boolean => {
  const selected = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return false;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return selected > today;
};

const validatePersonal = (values: EditProfileValues, errors: EditProfileErrors) => {
  validateName("firstName", values.firstName, errors);
  validateName("middleName", values.middleName, errors);
  validateName("surname", values.surname, errors);

  if (!values.dateOfBirth.trim()) {
    errors.dateOfBirth = "Date of birth is required.";
  } else if (isFutureDate(values.dateOfBirth.trim())) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  if (!values.gender.trim()) {
    errors.gender = "Gender is required.";
  }
};

const validateContact = (values: EditProfileValues, errors: EditProfileErrors) => {
  const phone = values.phone.trim();
  if (phone && !isValidPhMobile(phone)) {
    errors.phone = "Enter a valid PH mobile number (e.g. 09171234567).";
  }

  const address = values.address.trim();
  if (!address) {
    errors.address = "Address is required.";
  } else if (address.length < 5 || address.length > 255) {
    errors.address = "Address must be between 5 and 255 characters.";
  }
};

export const validateEditProfileValues = (
  values: EditProfileValues,
  section: ProfileEditSection
): EditProfileErrors => {
  const errors: EditProfileErrors = {};

  if (section === "personal") validatePersonal(values, errors);
  else validateContact(values, errors);

  return errors;
};
