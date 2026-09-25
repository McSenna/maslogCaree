import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { toast } from "@/components/feedback/toast/toastStore";
import { isOtpComplete } from "@/components/ui/otpEntry";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/config/roleRoutes";
import { resendOtp, verifyOtp } from "@/services/auth";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";

export const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

type Options = {
  email: string;
  onClose: () => void;
  onVerified?: () => void;
};

export const useOtpVerification = ({ email, onClose, onVerified }: Options) => {
  const router = useRouter();
  const { applyAuthUser } = useAuth();

  const [code, setCodeValue] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationError, setVerificationError] = useState("");
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);

  const otpComplete = isOtpComplete(code, OTP_LENGTH);
  const resendDisabled = isResending || resendTimer > 0;
  const finishVerification = () => (onVerified ? onVerified() : onClose());

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const setCode = (next: string) => {
    setCodeValue(next);
    if (verificationError) setVerificationError("");
  };

  const resetCode = () => {
    setCodeValue("");
    setFocusRequest((value) => value + 1);
  };

  const handleVerify = async () => {
    if (isVerifying || verified) return;
    if (!email?.trim()) {
      setVerificationError("We couldn't find your email. Please start the registration again.");
      return;
    }
    if (!otpComplete) {
      setVerificationError(`Enter all ${OTP_LENGTH} digits of the code.`);
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError("");
      const { token, user } = await verifyOtp(email.trim(), code);

      if (!token) {
        resetCode();
        setShowPlatformNotice(true);
        return;
      }

      setVerified(true);
      applyAuthUser(user, token);
      toast.success("Email verified", "Your MaslogCare account is ready.");
      finishVerification();
      router.replace(getDashboardPath(user.role));
    } catch (error: unknown) {
      const { message } = getAuthErrorPresentation(
        error,
        "Verification failed",
        "That code didn't work. Check it and try again."
      );
      setVerificationError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendDisabled || !email?.trim()) return;
    try {
      setIsResending(true);
      const result = await resendOtp(email.trim());
      toast.success("New code sent", result.message);
      resetCode();
      setVerificationError("");
      setResendTimer(RESEND_COOLDOWN_SEC);
    } catch (error: unknown) {
      const { title, message } = getAuthErrorPresentation(
        error,
        "Couldn't resend the code",
        "Please try again in a moment."
      );
      toast.error(title, message);
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setCodeValue("");
    setVerificationError("");
    setResendTimer(0);
    setVerified(false);
    onClose();
  };

  return {
    code,
    setCode,
    focusRequest,
    otpComplete,
    isVerifying,
    isResending,
    verified,
    resendTimer,
    resendDisabled,
    verificationError,
    showPlatformNotice,
    dismissPlatformNotice: () => {
      setShowPlatformNotice(false);
      finishVerification();
    },
    handleVerify,
    handleResend,
    handleClose,
  };
};
