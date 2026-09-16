import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { resendOtp, verifyOtp } from "@/services/auth";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { showAlert } from "@/utils/notify";

import { useOtpDigits } from "./useOtpDigits";

const RESEND_COOLDOWN_SEC = 60;

type Options = {
  email: string;
  onClose: () => void;
  onVerified?: () => void;
};

export const useOtpVerification = ({ email, onClose, onVerified }: Options) => {
  const router = useRouter();
  const { applyAuthUser } = useAuth();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationError, setVerificationError] = useState("");
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);

  const digits = useOtpDigits(() => {
    if (verificationError) setVerificationError("");
  });

  const resendDisabled = isResending || resendTimer > 0;
  const finishVerification = () => (onVerified ? onVerified() : onClose());

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => {
      setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (isVerifying) return;
    if (!email?.trim()) {
      showAlert("Error", "Email not found. Please try registering again.");
      return;
    }
    if (!digits.otpComplete) {
      setVerificationError("Please enter all 6 digits");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError("");
      const { token, user } = await verifyOtp(email.trim(), digits.otp);

      if (!token) {
        digits.resetOtp();
        setShowPlatformNotice(true);
        return;
      }

      applyAuthUser(user, token);
      showAlert("Success!", "Your email has been verified. Registration complete!");
      digits.resetOtp();
      finishVerification();
      router.replace(getDashboardPath(user.role as any) as any);
    } catch (error: unknown) {
      const { message } = getAuthErrorPresentation(
        error,
        "Verification Failed",
        "Unable to verify the code. Please check and try again."
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
      showAlert("Code Sent", result.message);
      digits.resetOtp();
      setVerificationError("");
      setResendTimer(RESEND_COOLDOWN_SEC);
    } catch (error: unknown) {
      const { title, message } = getAuthErrorPresentation(
        error,
        "Resend Failed",
        "Unable to resend the code. Please try again."
      );
      showAlert(title, message);
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    digits.resetOtp();
    setVerificationError("");
    setResendTimer(0);
    onClose();
  };

  return {
    ...digits,
    isVerifying,
    isResending,
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
