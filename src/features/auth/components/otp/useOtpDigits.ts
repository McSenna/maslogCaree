import { useRef, useState } from "react";
import type { TextInput } from "react-native";

export const OTP_LENGTH = 6;

export const emptyOtp = () => Array(OTP_LENGTH).fill("");

export const useOtpDigits = (onDigitEntered?: () => void) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(emptyOtp());
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    onDigitEntered?.();
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...otpDigits];
      next[index - 1] = "";
      setOtpDigits(next);
    }
  };

  return {
    otpDigits,
    inputRefs,
    otp: otpDigits.join(""),
    otpComplete: otpDigits.join("").length === OTP_LENGTH,
    resetOtp: () => setOtpDigits(emptyOtp()),
    handleDigitChange,
    handleKeyPress,
  };
};
