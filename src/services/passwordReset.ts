import api from "@/services/api";

export type ForgotPasswordResponse = {
  message: string;
  expiresInMinutes: number;
  resendAfterSeconds: number;
};

const normalize = (email: string) => email.trim().toLowerCase();

export async function requestPasswordResetCode(email: string): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<{ success: boolean } & ForgotPasswordResponse>(
    "/forgot-password",
    { email: normalize(email) }
  );
  return {
    message: data.message,
    expiresInMinutes: data.expiresInMinutes ?? 10,
    resendAfterSeconds: data.resendAfterSeconds ?? 45,
  };
}

export async function verifyPasswordResetCode(
  email: string,
  code: string
): Promise<{ message: string }> {
  const { data } = await api.post<{ success: boolean; message: string }>("/verify-reset-code", {
    email: normalize(email),
    code: code.trim(),
  });
  return { message: data.message };
}

export type ResetPasswordResult = {
  message: string;
  changedAt: string | null;
  notification: { sent: boolean; maskedEmail: string };
};

export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    changedAt?: string;
    notification?: { sent: boolean; maskedEmail: string };
  }>("/reset-password", {
    email: normalize(email),
    code: code.trim(),
    newPassword,
  });

  return {
    message: data.message,
    changedAt: data.changedAt ?? null,
    notification: data.notification ?? { sent: false, maskedEmail: "" },
  };
}
