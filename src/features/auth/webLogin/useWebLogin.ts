import { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/config/roleRoutes";
import { ERROR_CODES, PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { toastError } from "@/utils/errorToast/toastError";
import { toast } from "@/components/feedback/toast/toastStore";
import { LOGIN_MESSAGES, checkIdentifier, checkPassword } from "./loginIdentifier";

export type LoginStatus = "idle" | "submitting" | "success";

type FieldErrors = { identifier: string | null; password: string | null };

const NO_ERRORS: FieldErrors = { identifier: null, password: null };

// Staff dashboards open on their appointment queue; the admin one does not.
const successText = (role: string): string =>
  role === "admin" ? "Opening your dashboard…" : "Taking you to your appointments…";

/**
 * Web login. A field that needs changing gets its own message under its box;
 * a sign-in the server refused gets one alert above the fields. Editing either
 * value clears the alert, since it described the values that were sent.
 */
export const useWebLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifierValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const [alert, setAlert] = useState<string | null>(null);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // A ref, not state, so a second click in the same frame is already blocked.
  const inFlight = useRef(false);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierValue(value);
    setErrors((current) => ({ ...current, identifier: null }));
    setAlert(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setErrors((current) => ({ ...current, password: null }));
    setAlert(null);
  }, []);

  // Only a filled field is checked on blur; an empty one is left alone until submit.
  const validateIdentifierOnBlur = useCallback(() => {
    if (!identifier.trim()) return;
    const check = checkIdentifier(identifier);
    setErrors((current) => ({ ...current, identifier: check.ok ? null : check.message }));
  }, [identifier]);

  /** Returns the first invalid field so the caller can move focus to it. */
  const submit = useCallback(async (): Promise<keyof FieldErrors | null> => {
    if (inFlight.current) return null;

    const idCheck = checkIdentifier(identifier);
    const nextErrors: FieldErrors = {
      identifier: idCheck.ok ? null : idCheck.message,
      password: checkPassword(password),
    };
    setErrors(nextErrors);
    setAlert(null);
    if (!idCheck.ok) return "identifier";
    if (nextErrors.password) return "password";

    inFlight.current = true;
    setStatus("submitting");
    try {
      const result = await login(idCheck.value, password);
      if (result.success && result.role) {
        setSuccessMessage(successText(result.role));
        setStatus("success");
        router.replace(getDashboardPath(result.role) as never);
        return null;
      }

      setStatus("idle");
      if (result.code && PLATFORM_DENIED_CODES.includes(result.code)) {
        setPasswordValue("");
        setShowPlatformNotice(true);
        return null;
      }
      // As on the phone sign-in: the alert above the fields explains, the toast marks the failed attempt.
      toast.error("Couldn't log in");
      setAlert(
        result.code === ERROR_CODES.INVALID_CREDENTIALS
          ? LOGIN_MESSAGES.credentialsMismatch
          : getAuthErrorPresentation(
              { code: result.code, message: result.error },
              "Couldn't log in",
              "We couldn't sign you in. Please try again."
            ).message
      );
    } catch (error: unknown) {
      setStatus("idle");
      toastError("Couldn't log in", error, { inline: true });
      setAlert(getApiErrorMessage(error, "We couldn't reach MaslogCare. Check your connection, then try again."));
    } finally {
      inFlight.current = false;
    }
    return null;
  }, [identifier, password, login, router]);

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    errors,
    alert,
    status,
    successMessage,
    submit,
    validateIdentifierOnBlur,
    showForgotPassword,
    openForgotPassword: () => setShowForgotPassword(true),
    closeForgotPassword: () => setShowForgotPassword(false),
    showPlatformNotice,
    dismissPlatformNotice: () => setShowPlatformNotice(false),
  };
};
