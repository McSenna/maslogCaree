export type PasswordRule = {
  key: string;
  label: string;
  test: (value: string) => boolean;
};

export const PASSWORD_MIN_LENGTH = 8;
// The backend enforces the same limit (backend/config/passwordPolicy.js).
export const PASSWORD_MAX_LENGTH = 16;

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: "length",
    label: `${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters`,
    test: (v) => v.length >= PASSWORD_MIN_LENGTH && v.length <= PASSWORD_MAX_LENGTH,
  },
  {
    key: "case",
    label: "Uppercase and lowercase letters",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { key: "number", label: "At least one number", test: (v) => /\d/.test(v) },
  { key: "symbol", label: "At least one special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export type PasswordStrength = "weak" | "medium" | "strong";

export const passwordStrength = (value: string): PasswordStrength => {
  if (!value) return "weak";
  const passed = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  if (passed < PASSWORD_RULES.length) return passed >= 3 ? "medium" : "weak";
  return value.length >= 12 ? "strong" : "medium";
};

export const meetsAllPasswordRules = (value: string) =>
  PASSWORD_RULES.every((rule) => rule.test(value));

export const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
