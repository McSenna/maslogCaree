import { useRecoveryActions } from "./recovery/useRecoveryActions";
import { useRecoveryFormState } from "./recovery/useRecoveryFormState";

export { OTP_LENGTH } from "./recovery/otpConfig";
export type { RecoveryStep } from "./recovery/useRecoveryFormState";

export const useForgotPassword = ({ onExit }: { onExit: () => void }) => {
  const form = useRecoveryFormState();
  const actions = useRecoveryActions(form, onExit);

  return {
    step: form.step,
    setStep: form.setStep,
    email: form.email,
    setEmail: form.setEmail,
    otp: form.otp,
    setOtp: form.setOtp,
    newPassword: form.newPassword,
    setNewPassword: form.setNewPassword,
    confirmPassword: form.confirmPassword,
    setConfirmPassword: form.setConfirmPassword,
    isLoading: form.isLoading,
    outcome: form.outcome,
    error: form.error,
    setError: form.setError,
    notice: form.notice,
    resendTimer: form.resendTimer,
    canResend: form.resendTimer === 0 && !form.isLoading,
    sendCode: actions.sendCode,
    verifyCode: actions.verifyCode,
    submitNewPassword: actions.submitNewPassword,
    changeEmail: actions.changeEmail,
    reset: form.reset,
    close: actions.close,
  };
};

export type ForgotPasswordController = ReturnType<typeof useForgotPassword>;
