import { useCallback, useEffect, useRef, useState } from "react";

import {
  sendEmailVerificationCode,
  verifyEmailVerificationCode,
} from "@/services/auth";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import { OTP_LENGTH } from "../emailVerificationConfig";

export type EmailVerificationStatus = "idle" | "codeSent" | "verified";

const normalize = (email: string) => email.trim().toLowerCase();

export const useEmailVerification = (email: string) => {
  const [status, setStatus] = useState<EmailVerificationStatus>("idle");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const requestedEmail = useRef("");

  const reset = useCallback(() => {
    setStatus("idle");
    setCode("");
    setToken("");
    setVerifiedEmail("");
    setError("");
    setCooldown(0);
    requestedEmail.current = "";
  }, []);

  // Changing the email address invalidates any code or verification already granted.
  useEffect(() => {
    const current = normalize(email);
    if (!requestedEmail.current || current === requestedEmail.current) return;

    setStatus("idle");
    setCode("");
    setToken("");
    setVerifiedEmail("");
    setError("");
    setCooldown(0);
    requestedEmail.current = "";
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = useCallback(async () => {
    if (isSending) return;

    setIsSending(true);
    setError("");

    try {
      const result = await sendEmailVerificationCode(email);
      requestedEmail.current = normalize(email);
      setCode("");
      setStatus("codeSent");
      setCooldown(result.resendAfterSeconds);
    } catch (requestError: unknown) {
      setError(
        getApiErrorMessage(
          requestError,
          "We could not send your verification code. Please try again."
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [email, isSending]);

  const verifyCode = useCallback(
    async (candidate: string) => {
      if (isVerifying || candidate.length !== OTP_LENGTH) return;

      setIsVerifying(true);
      setError("");

      try {
        const result = await verifyEmailVerificationCode(email, candidate);
        setToken(result.verificationToken);
        setVerifiedEmail(result.email);
        setStatus("verified");
      } catch (requestError: unknown) {
        setCode("");
        setError(
          getApiErrorMessage(requestError, "That verification code is not valid.")
        );
      } finally {
        setIsVerifying(false);
      }
    },
    [email, isVerifying]
  );

  const isVerified = status === "verified" && normalize(email) === verifiedEmail;

  return {
    status,
    code,
    setCode,
    token: isVerified ? token : "",
    error,
    isSending,
    isVerifying,
    cooldown,
    isVerified,
    sendCode,
    verifyCode,
    reset,
  };
};
