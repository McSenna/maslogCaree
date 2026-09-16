import { isValidPhMobile } from "@/features/auth/registration/registrationValidation";

export type EditProfileValidationInput = {
  fullname: string;
  phone: string;
  address: string;
};

export type EditProfileErrors = Partial<Record<"fullname" | "phone" | "address", string>>;

export const validateEditProfileValues = (
  values: EditProfileValidationInput
): EditProfileErrors => {
  const errors: EditProfileErrors = {};

  const fullname = values.fullname.trim();
  if (!fullname) {
    errors.fullname = "Full name is required.";
  } else if (fullname.length < 2 || fullname.length > 100) {
    errors.fullname = "Full name must be between 2 and 100 characters.";
  }

  const phone = values.phone.trim();
  if (phone && !isValidPhMobile(phone)) {
    errors.phone = "Enter a valid PH mobile number (e.g. 09171234567).";
  }

  const address = values.address.trim();
  if (address && (address.length < 5 || address.length > 255)) {
    errors.address = "Address must be between 5 and 255 characters.";
  }

  return errors;
};
