export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordFormValues, string>> & {
  general?: string;
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
