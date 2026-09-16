import { useCallback } from "react";
import {
  requestPasswordResetCode,
  resetPasswordWithCode,
  verifyPasswordResetCode,
} from "@/services/passwordReset";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { isValidEmail, meetsAllPasswordRules } from "../passwordRules";
import { OTP_LENGTH } from "./otpConfig";
import type { useRecoveryFormState } from "./useRecoveryFormState";

export const useRecoveryActions = (
  form: ReturnType<typeof useRecoveryFormState>,
  onExit: () => void
) => {
  const {
    email,
    otp,
    newPassword,
    confirmPassword,
    isLoading,
    mounted,
    setStep,
    setIsLoading,
    setError,
    setNotice,
    setResendTimer,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    setOutcome,
    reset,
  } = form;

  const sendCode = useCallback(
    async (mode: "initial" | "resend" = "initial") => {
      if (isLoading) return;
      const trimmed = email.trim();

      if (!trimmed) return setError("Enter your email address.");
      if (!isValidEmail(trimmed)) return setError("Enter a valid email address.");

      setIsLoading(true);
      setError(null);
      setNotice(null);
      try {
        const result = await requestPasswordResetCode(trimmed);
        if (!mounted.current) return;
        setResendTimer(result.resendAfterSeconds);
        setNotice(mode === "resend" ? "A new verification code has been sent." : result.message);
        setOtp("");
        if (mode === "initial") setStep("sent");
      } catch (e: unknown) {
        if (mounted.current) setError(getApiErrorMessage(e, "The code could not be sent."));
      } finally {
        if (mounted.current) setIsLoading(false);
      }
    },
    [email, isLoading, mounted, setError, setIsLoading, setNotice, setOtp, setResendTimer, setStep]
  );

  const verifyCode = useCallback(async () => {
    if (isLoading) return;
    if (otp.length !== OTP_LENGTH) return setError(`Enter all ${OTP_LENGTH} digits.`);

    setIsLoading(true);
    setError(null);
    setNotice(null);
    try {
      await verifyPasswordResetCode(email, otp);
      if (!mounted.current) return;
      setStep("password");
    } catch (e: unknown) {
      if (!mounted.current) return;
      setError(getApiErrorMessage(e, "The verification code is incorrect or has expired."));
      setOtp("");
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, [email, otp, isLoading, mounted, setError, setIsLoading, setNotice, setOtp, setStep]);

  const submitNewPassword = useCallback(async () => {
    if (isLoading) return;
    if (!meetsAllPasswordRules(newPassword)) {
      return setError("Your password does not meet all the requirements yet.");
    }
    if (newPassword !== confirmPassword) return setError("The passwords do not match.");

    setIsLoading(true);
    setError(null);
    try {
      const result = await resetPasswordWithCode(email, otp, newPassword);
      if (!mounted.current) return;
      setOutcome(result);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("success");
    } catch (e: unknown) {
      if (!mounted.current) return;
      const message = getApiErrorMessage(e, "The password could not be reset.");
      setError(message);
      if (/expired|incorrect/i.test(message)) setStep("otp");
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, [
    email,
    otp,
    newPassword,
    confirmPassword,
    isLoading,
    mounted,
    setConfirmPassword,
    setError,
    setIsLoading,
    setNewPassword,
    setOtp,
    setOutcome,
    setStep,
  ]);

  const changeEmail = useCallback(() => {
    setStep("email");
    setOtp("");
    setError(null);
    setNotice(null);
  }, [setStep, setOtp, setError, setNotice]);

  const close = useCallback(() => {
    reset();
    onExit();
  }, [reset, onExit]);

  return { sendCode, verifyCode, submitNewPassword, changeEmail, close };
};
