import { useCallback, useEffect, useRef, useState } from "react";
import type { ResetPasswordResult } from "@/services/passwordReset";

export type RecoveryStep = "email" | "sent" | "otp" | "password" | "success";

export const useRecoveryFormState = () => {
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [outcome, setOutcome] = useState<ResetPasswordResult | null>(null);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((n) => (n <= 1 ? 0 : n - 1)), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const reset = useCallback(() => {
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
    setError(null);
    setNotice(null);
    setResendTimer(0);
    setOutcome(null);
  }, []);

  return {
    step,
    setStep,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    setIsLoading,
    error,
    setError,
    notice,
    setNotice,
    resendTimer,
    setResendTimer,
    outcome,
    setOutcome,
    mounted,
    reset,
  };
};
