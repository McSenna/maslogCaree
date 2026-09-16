import { useState } from "react";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { PLATFORM_DENIED_CODES } from "@/utils/errorCodes";
import { showAlert } from "@/utils/notify";

export const useLoginForm = (onClose: () => void) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlatformNotice, setShowPlatformNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!email.trim()) {
      showAlert("Validation", "Please enter your email address.");
      return;
    }
    if (!password) {
      showAlert("Validation", "Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success && result.role) {
      onClose();
      router.replace(getDashboardPath(result.role) as any);
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
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((p) => !p),
    focusedField,
    setFocusedField,
    isSubmitting,
    showPlatformNotice,
    dismissPlatformNotice: () => setShowPlatformNotice(false),
    showForgotPassword,
    openForgotPassword: () => setShowForgotPassword(true),
    closeForgotPassword: () => setShowForgotPassword(false),
    handleSubmit,
  };
};
