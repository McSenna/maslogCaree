import { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { dismissToast, toast } from "@/components/feedback/toast/toastStore";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/config/roleRoutes";
import { ERROR_CODES, PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { LOGIN_MESSAGES, checkIdentifier, checkPassword } from "./loginIdentifier";

export type LoginStatus = "idle" | "submitting" | "success";

type FieldErrors = { identifier: string | null; password: string | null };

const NO_ERRORS: FieldErrors = { identifier: null, password: null };

const FAILURE_TITLE = "Couldn't log in";

/** One sentence for the toast, naming every field that still needs attention. */
const validationMessage = (errors: FieldErrors): string | null => {
  if (errors.identifier === LOGIN_MESSAGES.identifierRequired && errors.password) {
    return LOGIN_MESSAGES.bothRequired;
  }
  return errors.identifier ?? errors.password;
};

/**
 * Web login. Failures are reported in one toast with the reason; the card itself
 * only marks the fields that need changing (aria-invalid and the red outline).
 */
export const useWebLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifierValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // A ref, not state, so a second click in the same frame is already blocked.
  const inFlight = useRef(false);
  // The failure toast describes the values that were submitted, so editing either one retires it.
  const failureToast = useRef<number | null>(null);

  const reportFailure = useCallback((message: string) => {
    failureToast.current = toast.error(FAILURE_TITLE, message);
  }, []);

  const retireFailure = useCallback(() => {
    if (failureToast.current === null) return;
    dismissToast(failureToast.current);
    failureToast.current = null;
  }, []);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierValue(value);
    setErrors((current) => ({ ...current, identifier: null }));
    retireFailure();
  }, [retireFailure]);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setErrors((current) => ({ ...current, password: null }));
    retireFailure();
  }, [retireFailure]);

  // Only a filled field is checked on blur, and only outlined: a toast while tabbing would interrupt.
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

    const invalid = validationMessage(nextErrors);
    if (invalid) {
      reportFailure(invalid);
      return nextErrors.identifier ? "identifier" : "password";
    }
    if (!idCheck.ok) return "identifier";

    inFlight.current = true;
    retireFailure();
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
      reportFailure(
        result.code === ERROR_CODES.INVALID_CREDENTIALS
          ? LOGIN_MESSAGES.credentialsMismatch
          : getAuthErrorPresentation(
              { code: result.code, message: result.error },
              FAILURE_TITLE,
              "We couldn't sign you in. Please try again."
            ).message
      );
    } catch (error: unknown) {
      setStatus("idle");
      reportFailure(getApiErrorMessage(error, "Something went wrong. Please try again."));
    } finally {
      inFlight.current = false;
    }
    return null;
  }, [identifier, password, login, router, reportFailure, retireFailure]);

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    errors,
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
