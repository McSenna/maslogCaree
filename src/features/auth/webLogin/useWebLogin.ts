import { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/config/roleRoutes";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { toastLoginFailed, toastLoginRefused } from "../hooks/loginFailureToast";
import { checkLoginEmail, checkPassword } from "./loginIdentifier";

export type LoginStatus = "idle" | "submitting" | "success";

type FieldErrors = { identifier: string | null; password: string | null };

const NO_ERRORS: FieldErrors = { identifier: null, password: null };

// Staff dashboards open on their appointment queue; the admin one does not.
const successText = (role: string): string =>
  role === "admin" ? "Opening your dashboard…" : "Taking you to your appointments…";

/**
 * Web login. A field that needs changing gets its own message under its box;
 * a sign-in the server refused is reported in the error toast.
 */
export const useWebLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifierValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // A ref, not state, so a second click in the same frame is already blocked.
  const inFlight = useRef(false);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierValue(value);
    setErrors((current) => ({ ...current, identifier: null }));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setErrors((current) => ({ ...current, password: null }));
  }, []);

  // Only a filled field is checked on blur; an empty one is left alone until submit.
  const validateIdentifierOnBlur = useCallback(() => {
    if (!identifier.trim()) return;
    const check = checkLoginEmail(identifier);
    setErrors((current) => ({ ...current, identifier: check.ok ? null : check.message }));
  }, [identifier]);

  /** Returns the first invalid field so the caller can move focus to it. */
  const submit = useCallback(async (): Promise<keyof FieldErrors | null> => {
    if (inFlight.current) return null;

    const idCheck = checkLoginEmail(identifier);
    const nextErrors: FieldErrors = {
      identifier: idCheck.ok ? null : idCheck.message,
      password: checkPassword(password),
    };
    setErrors(nextErrors);
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
      toastLoginRefused(result);
    } catch (error: unknown) {
      setStatus("idle");
      toastLoginFailed(error);
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
