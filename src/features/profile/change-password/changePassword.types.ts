export type ChangePasswordField = "currentPassword" | "newPassword" | "confirmPassword";

export type ChangePasswordFormValues = Record<ChangePasswordField, string>;

export type ChangePasswordFieldErrors = Partial<Record<ChangePasswordField, string>>;

/**
 * A message across the top of the form. `retry` offers to send the same
 * entries again; `persistent` keeps it while the user edits, because editing
 * does not answer whether an unanswered attempt went through.
 */
export type ChangePasswordBanner = {
  tone: "danger" | "warning";
  message: string;
  retry: boolean;
  persistent: boolean;
};

/** Only the two fields the server needs: the confirmation never leaves the device. */
export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordApiResponse = {
  success: boolean;
  message: string;
  /** Replaces this device's token: every token issued before the change stops working. */
  token?: string;
};

export type ChangePasswordLayout = "row" | "stacked";
