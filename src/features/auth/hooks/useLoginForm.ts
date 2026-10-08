import { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/config/roleRoutes";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { checkLoginEmail, checkPassword } from "../webLogin/loginIdentifier";
import { toastLoginFailed, toastLoginRefused } from "./loginFailureToast";

export type LoginField = "email" | "password";

export const useLoginForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // A ref, not state, so a second tap in the same frame is already blocked.
  const inFlight = useRef(false);

  const setEmail = useCallback((value: string) => {
    setEmailValue(value);
    setEmailError(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setPasswordError(null);
  }, []);

  /** Returns the first invalid field so the caller can move focus to it. */
  const submit = useCallback(async (): Promise<LoginField | null> => {
    if (inFlight.current) return null;

    // Same rule as the web login: an email address only, never a mobile number.
    const idCheck = checkLoginEmail(email);
    const nextPasswordError = checkPassword(password);

    setEmailError(idCheck.ok ? null : idCheck.message);
    setPasswordError(nextPasswordError);

    if (!idCheck.ok) return "email";
    if (nextPasswordError) return "password";

    inFlight.current = true;
    setIsSubmitting(true);
    try {
      const result = await login(idCheck.value, password);
      if (result.success && result.role) {
        onSuccess?.();
        router.replace(getDashboardPath(result.role) as never);
        return null;
      }

      if (result.code && PLATFORM_DENIED_CODES.includes(result.code)) {
        setPasswordValue("");
        setShowPlatformNotice(true);
        return null;
      }

      toastLoginRefused(result);
    } catch (error: unknown) {
      toastLoginFailed(error);
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
    return null;
  }, [email, password, login, router, onSuccess]);

  const forgotPassword = useCallback(() => setShowForgotPassword(true), []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    isSubmitting,
    submit,
    forgotPassword,
    showForgotPassword,
    closeForgotPassword: () => setShowForgotPassword(false),
    showPlatformNotice,
    dismissPlatformNotice: () => setShowPlatformNotice(false),
  };
};
