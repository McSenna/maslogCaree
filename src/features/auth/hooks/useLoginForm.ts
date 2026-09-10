import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";

/**
 * Signing in from the landing card.
 *
 * A rejected credential and a rejected *client* are different outcomes: the
 * first is a failed login, the second is a policy decision about where this
 * account is allowed to sign in. They are reported differently, and neither
 * creates a session to navigate away with.
 */
export function useLoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);

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

      // Right credentials, wrong client. This is a policy outcome rather than
      // a failure, so it gets the MaslogCare dialog explaining where to go
      // instead of a "Login Failed" alert — and the user stays on this page,
      // since no session was created to navigate away with.
      if (result.code && PLATFORM_DENIED_CODES.includes(result.code)) {
        setPassword("");
        setShowPlatformNotice(true);
        return;
      }

      showAlert("Login Failed", result.error ?? "Invalid email or password.");
    } catch (error: unknown) {
      // login() already returns failures in `result`; reaching here means an
      // unexpected client-side fault rather than a rejected credential.
      showAlert(
        "Login Failed",
        getApiErrorMessage(error, "An unexpected error occurred. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, email, password, login, router]);

  const forgotPassword = useCallback(() => {
    showAlert("Forgot Password", "Password reset functionality will be available soon.");
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    submit,
    forgotPassword,
    showPlatformNotice,
    dismissPlatformNotice: () => setShowPlatformNotice(false),
  };
}
