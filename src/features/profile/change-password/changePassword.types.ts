export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordFormValues, string>> & {
  general?: string;
  /** The attempt got no answer, so the change may or may not have happened. Kept while the user edits. */
  unconfirmed?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type ChangePasswordApiResponse = {
  success: boolean;
  message: string;
};
