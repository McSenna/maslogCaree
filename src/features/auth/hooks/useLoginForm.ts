import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";

export const useLoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const submit = useCallback(async () => {
    if (isSubmitting) return;

    if (!email.trim()) {
      showAlert("Validation", "Please enter your email address or phone number.");
      return;
    }
    if (!password) {
      showAlert("Validation", "Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success && result.role) {
        router.replace(getDashboardPath(result.role) as never);
        return;
      }

      if (result.code && PLATFORM_DENIED_CODES.includes(result.code)) {
        setPassword("");
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
    isSubmitting,
    submit,
    forgotPassword,
    showForgotPassword,
    closeForgotPassword: () => setShowForgotPassword(false),
    showPlatformNotice,
    dismissPlatformNotice: () => setShowPlatformNotice(false),
  };
};
