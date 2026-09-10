/** The fields the registration form collects, before it is sent. */
export type RegistrationValues = {
  fullname: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  address: string;
};

/** Field name → the first thing wrong with it. */
export type RegistrationErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * What the form can tell the resident before the server sees it.
 *
 * One message per field — the first failure, not a list — because the message
 * sits under the input and a stack of them would push the form around while it
 * is being filled in. The server enforces the same rules on write.
 */
export function validateRegistration(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = {};

  if (!values.fullname.trim()) errors.fullname = "Full name is required";
  else if (values.fullname.trim().length < 2) errors.fullname = "At least 2 characters";

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email";

  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 8) errors.password = "At least 8 characters";
  else if (!/[A-Za-z]/.test(values.password)) errors.password = "Must contain a letter";
  else if (!/\d/.test(values.password)) errors.password = "Must contain a number";

  if (!values.gender) errors.gender = "Select a gender";
  if (!values.dateOfBirth.trim()) errors.dateOfBirth = "Date of birth is required";

  if (!values.address.trim()) errors.address = "Address is required";
  else if (values.address.trim().length < 5) errors.address = "At least 5 characters";

  return errors;
}
