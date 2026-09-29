import { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/config/roleRoutes";
import { ERROR_CODES, PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { LOGIN_MESSAGES, checkIdentifier, checkPassword } from "./loginIdentifier";

export type LoginStatus = "idle" | "submitting" | "success";

type FieldErrors = { identifier: string | null; password: string | null };

const NO_ERRORS: FieldErrors = { identifier: null, password: null };

export const useWebLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifierValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // A ref, not state, so a second click in the same frame is already blocked.
  const inFlight = useRef(false);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierValue(value);
    setErrors((current) => ({ ...current, identifier: null }));
    setFormError(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setErrors((current) => ({ ...current, password: null }));
    setFormError(null);
  }, []);

  // Only a filled field is checked on blur, so tabbing past an empty one stays quiet.
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
    if (!idCheck.ok) return "identifier";
    if (nextErrors.password) return "password";

    inFlight.current = true;
    setFormError(null);
    setStatus("submitting");
    try {
      const result = await login(idCheck.value, password);
      if (result.success && result.role) {
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
      if (result.code === ERROR_CODES.INVALID_CREDENTIALS) {
        setFormError(LOGIN_MESSAGES.credentialsMismatch);
        return null;
      }
      setFormError(
        getAuthErrorPresentation(
          { code: result.code, message: result.error },
          "Login failed",
          LOGIN_MESSAGES.credentialsMismatch
        ).message
      );
    } catch (error: unknown) {
      setStatus("idle");
      setFormError(getApiErrorMessage(error, "Something went wrong. Please try again."));
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
    formError,
    status,
    submit,
    validateIdentifierOnBlur,
    showForgotPassword,
    openForgotPassword: () => setShowForgotPassword(true),
    closeForgotPassword: () => setShowForgotPassword(false),
    showPlatformNotice,
    dismissPlatformNotice: () => setShowPlatformNotice(false),
  };
};
