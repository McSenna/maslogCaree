import api from "@/services/api";

export type SendEmailCodeResponse = {
  success: true;
  message: string;
  expiresInMinutes: number;
  resendAfterSeconds: number;
};

export type VerifyEmailCodeResponse = {
  success: true;
  message: string;
  email: string;
  verificationToken: string;
  expiresInMinutes: number;
};

const normalize = (email: string) => email.trim().toLowerCase();

export const sendEmailVerificationCode = async (
  email: string
): Promise<{ resendAfterSeconds: number; expiresInMinutes: number }> => {
  const { data } = await api.post<SendEmailCodeResponse>("/email-verification/send", {
    email: normalize(email),
  });

  return {
    resendAfterSeconds: data.resendAfterSeconds,
    expiresInMinutes: data.expiresInMinutes,
  };
};

export const verifyEmailVerificationCode = async (
  email: string,
  otp: string
): Promise<{ email: string; verificationToken: string }> => {
  const { data } = await api.post<VerifyEmailCodeResponse>("/email-verification/verify", {
    email: normalize(email),
    otp: otp.trim(),
  });

  return { email: data.email, verificationToken: data.verificationToken };
};
