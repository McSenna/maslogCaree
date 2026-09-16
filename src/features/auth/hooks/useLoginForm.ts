import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";

const EMAIL_REQUIRED = "Please enter your email address or phone number.";
const PASSWORD_REQUIRED = "Please enter your password.";

export const useLoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const setEmail = useCallback((value: string) => {
    setEmailValue(value);
    setEmailError(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setPasswordError(null);
  }, []);

  const submit = useCallback(async () => {
    if (isSubmitting) return;

    const missingEmail = !email.trim();
    const missingPassword = !password;

    setEmailError(missingEmail ? EMAIL_REQUIRED : null);
    setPasswordError(missingPassword ? PASSWORD_REQUIRED : null);

    if (missingEmail || missingPassword) return;

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success && result.role) {
        router.replace(getDashboardPath(result.role) as never);
        return;
      }

      if (result.code && PLATFORM_DENIED_CODES.includes(result.code)) {
        setPasswordValue("");
        setShowPlatformNotice(true);
        return;
      }

      const { title, message } = getAuthErrorPresentation(
        { code: result.code, message: result.error },
        "Login Failed",
        result.error ?? "Invalid email or password."
      );
      showAlert(title, message);
    } catch (error: unknown) {
      showAlert(
        "Login Failed",
        getApiErrorMessage(error, "An unexpected error occurred. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, email, password, login, router]);

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
