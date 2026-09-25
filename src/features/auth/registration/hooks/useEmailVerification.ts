import { useCallback, useEffect, useRef, useState } from "react";

import { isOtpComplete } from "@/components/ui/otpEntry";
import {
  sendEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/services/auth";
import { normalizeApiError } from "@/utils/apiErrorHandler";

import {
  OTP_COPY,
  describeSendFailure,
  describeVerifyFailure,
  type VerifyFailureKind,
} from "../components/email/verificationCopy";
import { OTP_LENGTH } from "../emailVerificationConfig";

export type EmailVerificationStatus = "idle" | "codeSent" | "verified";

/** Feedback shown in the code panel's status area. */
export type CodeFeedback = {
  tone: "error" | "success" | "info";
  message: string;
  kind?: VerifyFailureKind;
};

const normalize = (email: string) => email.trim().toLowerCase();

export const useEmailVerification = (email: string) => {
  const [status, setStatus] = useState<EmailVerificationStatus>("idle");
  const [code, setCodeState] = useState("");
  const [token, setToken] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  /** Failure of the first send, shown under the e-mail field (no code panel yet). */
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<CodeFeedback | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  /** Bumped when the e-mail field should take focus (after "Change email"). */
  const [emailFocusRequest, setEmailFocusRequest] = useState(0);
  /** Bumped when the code dialog is dismissed, so focus can return to the field. */
  const [returnFocusRequest, setReturnFocusRequest] = useState(0);

  const requestedEmail = useRef("");
  // State updates land a render late, so two quick taps could both pass an
  // `isVerifying` check; refs close that window.
  const sendingRef = useRef(false);
  const verifyingRef = useRef(false);
  // Bumped whenever earlier requests stop being relevant (reset, new e-mail,
  // unmount); a response carrying an older id is ignored.
  const generationRef = useRef(0);

  const clearAll = useCallback(() => {
    generationRef.current += 1;
    sendingRef.current = false;
    verifyingRef.current = false;
    requestedEmail.current = "";
    setStatus("idle");
    setCodeState("");
    setToken("");
    setVerifiedEmail("");
    setError("");
    setFeedback(null);
    setIsSending(false);
    setIsVerifying(false);
    setCooldown(0);
    setExpiresInMinutes(null);
    setIsCodeDialogOpen(false);
  }, []);

  useEffect(
    () => () => {
      generationRef.current += 1;
    },
    []
  );

  // Changing the email address invalidates any code or verification already granted.
  useEffect(() => {
    const current = normalize(email);
    if (!requestedEmail.current || current === requestedEmail.current) return;
    clearAll();
  }, [email, clearAll]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const requestFocus = () => setFocusRequest((count) => count + 1);

  /** Updates the code; editing after an error clears the error so the boxes stop showing it. */
  const setCode = useCallback((next: string) => {
    setCodeState(next);
    setFeedback((current) => (current?.tone === "error" || current?.tone === "info" ? null : current));
  }, []);

  const sendCode = useCallback(async () => {
    if (sendingRef.current) return;
    const isResend = status === "codeSent";
    const generation = generationRef.current;

    sendingRef.current = true;
    setIsSending(true);
    setError("");
    if (isResend) setFeedback(null);

    try {
      const result = await sendEmailVerificationCode(email);
      if (generation !== generationRef.current) return;

      requestedEmail.current = normalize(email);
      setCodeState("");
      setStatus("codeSent");
      setCooldown(result.resendAfterSeconds);
      setExpiresInMinutes(result.expiresInMinutes);
      setFeedback(isResend ? { tone: "success", message: OTP_COPY.resent } : null);
      setIsCodeDialogOpen(true);
      requestFocus();
    } catch (requestError: unknown) {
      if (generation !== generationRef.current) return;

      const { code: errorCode, retryAfter } = normalizeApiError(requestError);
      const message = describeSendFailure(errorCode, { isResend, retryAfter });
      if (errorCode === "OTP_COOLDOWN" && retryAfter && retryAfter > 0) setCooldown(retryAfter);

      if (isResend) setFeedback({ tone: "error", message });
      else setError(message);
    } finally {
      if (generation === generationRef.current) {
        sendingRef.current = false;
        setIsSending(false);
      }
    }
  }, [email, status]);

  const verifyCode = useCallback(
    async (candidate: string) => {
      if (verifyingRef.current || sendingRef.current) return;

      if (!isOtpComplete(candidate, OTP_LENGTH)) {
        setFeedback({ tone: "error", kind: "incomplete", message: OTP_COPY.incomplete(OTP_LENGTH) });
        requestFocus();
        return;
      }

      const generation = generationRef.current;
      verifyingRef.current = true;
      setIsVerifying(true);
      setFeedback(null);

      try {
        const result = await verifyEmailVerificationCode(email, candidate);
        if (generation !== generationRef.current) return;

        setToken(result.verificationToken);
        setVerifiedEmail(result.email);
        setStatus("verified");
        setFeedback({ tone: "success", message: OTP_COPY.verified });
      } catch (requestError: unknown) {
        if (generation !== generationRef.current) return;

        const failure = describeVerifyFailure(normalizeApiError(requestError).code, OTP_LENGTH);
        // Typed digits survive a recoverable failure (wrong digit, dropped
        // connection) so the user can fix one box instead of retyping all six.
        if (failure.clearCode) setCodeState("");
        setFeedback({ tone: "error", kind: failure.kind, message: failure.message });
        requestFocus();
      } finally {
        if (generation === generationRef.current) {
          verifyingRef.current = false;
          setIsVerifying(false);
        }
      }
    },
    [email]
  );

  /** Reopens the code dialog after it was dismissed; the entered digits are kept. */
  const openCodeDialog = useCallback(() => {
    setIsCodeDialogOpen(true);
    requestFocus();
  }, []);

  const closeCodeDialog = useCallback(() => {
    setIsCodeDialogOpen(false);
    setReturnFocusRequest((count) => count + 1);
  }, []);

  /** Drops the pending code and hands focus back to the address field to correct it. */
  const changeEmail = useCallback(() => {
    clearAll();
    setEmailFocusRequest((count) => count + 1);
  }, [clearAll]);

  const isVerified = status === "verified" && normalize(email) === verifiedEmail;

  return {
    status,
    code,
    setCode,
    token: isVerified ? token : "",
    error,
    feedback,
    isSending,
    isResending: isSending && status === "codeSent",
    isVerifying,
    cooldown,
    expiresInMinutes,
    focusRequest,
    isVerified,
    sendCode,
    verifyCode,
    isCodeDialogOpen,
    emailFocusRequest,
    returnFocusRequest,
    openCodeDialog,
    closeCodeDialog,
    changeEmail,
    reset: clearAll,
  };
};
