import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { resendOtp, verifyOtp } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";

const MC_PRIMARY = "#2A7DE1";
const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

export type OtpVerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  /** If set, called after successful verify instead of `onClose` (e.g. close parent registration UI). */
  onVerified?: () => void;
};

export default function OtpVerificationModal({
  visible,
  email,
  onClose,
  onVerified,
}: OtpVerificationModalProps) {
  const router = useRouter();
  const { logout, applyAuthUser } = useAuth();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationError, setVerificationError] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const otp = otpDigits.join("");

  // Resend countdown with cleanup
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => {
      setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(RESEND_COOLDOWN_SEC);
  };

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (verificationError) setVerificationError("");
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

  const handleVerify = async () => {
    if (isVerifying) return;
    if (!email?.trim()) {
      Alert.alert("Error", "Email not found. Please try registering again.");
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      setVerificationError("Please enter all 6 digits");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError("");
      const { token, user } = await verifyOtp(email.trim(), otp);
      applyAuthUser(user, token);
      Alert.alert("Success!", "Your email has been verified. Registration complete!");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      if (onVerified) {
        onVerified();
      } else {
        onClose();
      }
      router.replace(getDashboardPath(user.role as any) as any);
    } catch (error: any) {
      setVerificationError(
        error?.message ??
        error?.response?.data?.message ?? "Unable to verify code. Please check and try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendTimer > 0 || !email?.trim()) return;
    try {
      setIsResending(true);
      const result = await resendOtp(email.trim());
      Alert.alert("Code Sent", result.message);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setVerificationError("");
      startResendTimer();
    } catch (error: any) {
      Alert.alert(
        "Resend Failed",
        error?.message ??
        error?.response?.data?.message ?? "Unable to resend code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setVerificationError("");
    setResendTimer(0);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
      >
        <View
          className="w-full max-w-md rounded-2xl bg-white overflow-hidden self-center"
          style={{
            boxShadow: "0px 12px 24px rgba(15,23,42,0.2)",
            elevation: 12,
          }}
        >
          {/* Header */}
          <View className="bg-mc-primary px-5 pt-5 pb-5 overflow-hidden">
            <View
              className="absolute -right-10 -top-10 rounded-full bg-white/10"
              style={{ width: 140, height: 140 }}
            />
            <View
              className="absolute right-6 bottom-0 rounded-full bg-white/[0.07]"
              style={{ width: 70, height: 70 }}
            />
            <View className="flex-row justify-end mb-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close verification"
                onPress={handleClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-white/20"
              >
                <Feather name="x" size={16} color="#fff" />
              </Pressable>
            </View>
            <View className="flex-row items-center gap-3 mb-1.5">
              <View className="rounded-[10px] bg-white/20 p-2">
                <Feather name="shield" size={20} color="#fff" />
              </View>
              <View>
                <Text className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Email Verification
                </Text>
                <Text className="text-[18px] font-extrabold leading-tight text-white tracking-tight">
                  Enter verification code
                </Text>
              </View>
            </View>
            <Text className="text-[10.5px] text-white/70 leading-relaxed">
              We sent a 6-digit code to{" "}
              <Text className="font-semibold text-white/90">{email}</Text>.{"\n"}
              Enter it below to activate your account.
            </Text>
          </View>

          {/* Body */}
          <View className="px-5 py-5 gap-4">
            <View>
              <Text className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                6-Digit Code
              </Text>
              <View className="flex-row gap-2">
                {otpDigits.map((digit, i) => (
                  <View
                    key={i}
                    className="flex-1 items-center justify-center rounded-xl border-2"
                    style={{
                      height: 52,
                      borderColor: verificationError
                        ? "#EF4444"
                        : digit
                          ? MC_PRIMARY
                          : "#E2E8F0",
                      backgroundColor: digit ? "#EEF2FF" : "#F8FAFC",
                    }}
                  >
                    <TextInput
                      ref={(r) => {
                        inputRefs.current[i] = r;
                      }}
                      value={digit}
                      onChangeText={(t) => handleDigitChange(t, i)}
                      onKeyPress={(e) => handleKeyPress(e, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      className="w-full h-full text-slate-800"
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: digit ? MC_PRIMARY : "#94A3B8",
                      }}
                      selectTextOnFocus
                      editable={!isVerifying}
                    />
                  </View>
                ))}
              </View>
              {verificationError ? (
                <View className="flex-row mt-2 items-center gap-2">
                  <Feather name="alert-circle" size={12} color="#DC2626" />
                  <Text className="text-red-600 text-[11px]">{verificationError}</Text>
                </View>
              ) : (
                <Text className="mt-1.5 text-[9.5px] text-slate-400">
                  This code will expire in 5 minutes.
                </Text>
              )}
            </View>

            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={handleResend}
                disabled={isResending || resendTimer > 0}
                accessibilityRole="button"
                accessibilityLabel={
                  resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend code"
                }
              >
                <View className="flex-row items-center gap-2">
                  <Feather
                    name="refresh-ccw"
                    size={12}
                    color={isResending || resendTimer > 0 ? "#94A3B8" : MC_PRIMARY}
                  />
                  <Text
                    className="text-[11px] font-semibold"
                    style={{
                      color: isResending || resendTimer > 0 ? "#94A3B8" : MC_PRIMARY,
                    }}
                  >
                    {isResending
                      ? "Sending…"
                      : resendTimer > 0
                        ? `Resend (${resendTimer}s)`
                        : "Resend OTP"}
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={logout} accessibilityRole="button" accessibilityLabel="Use a different account">
                <Text className="text-[11px] font-semibold text-slate-500">
                  Use a different account
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleVerify}
              disabled={isVerifying || otp.length !== OTP_LENGTH}
              className="rounded-xl bg-mc-primary items-center justify-center w-full"
              style={({ pressed }) => ({
                height: 50,
                opacity: pressed || isVerifying || otp.length !== OTP_LENGTH ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                boxShadow: "0px 4px 10px rgba(42,125,225,0.35)",
                elevation: 4,
              })}
            >
              <View className="flex-row items-center gap-2">
                <Feather name="check-circle" size={16} color="#fff" />
                <Text className="text-[14px] font-bold text-white">
                  {isVerifying ? "Verifying…" : "Verify OTP"}
                </Text>
              </View>
            </Pressable>

            <View className="flex-row items-center justify-center gap-2">
              <Feather name="lock" size={10} color="#94A3B8" />
              <Text className="text-[9px] text-slate-400">
                OTP is used only for verification and will not be reused.
              </Text>
            </View>
          </View>

          <View className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex-row items-center gap-2">
            <Feather name="info" size={13} color={MC_PRIMARY} />
            <Text className="text-[10px] text-slate-600 flex-1 leading-relaxed">
              Can&apos;t find the email? Check your spam or junk folder.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
