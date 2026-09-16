export const OTP_LENGTH = 6;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmailFormat = (email: string) => EMAIL_PATTERN.test(email.trim());
