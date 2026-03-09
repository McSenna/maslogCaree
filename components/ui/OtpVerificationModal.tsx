import { useState } from "react";
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
import { resendOtp, verifyOtp } from "../../services/auth";
import { useAuth } from "@/contexts/AuthContext";

type OtpVerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
};

export default function OtpVerificationModal({
  visible,
  email,
  onClose,
}: OtpVerificationModalProps) {
  const { logout } = useAuth();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationError, setVerificationError] = useState("");

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Handle OTP verification
   */
  const handleVerify = async () => {
    if (isVerifying) return;

    if (!email) {
      Alert.alert("Error", "Email not found. Please try registering again.");
      return;
    }

    if (!otp.trim()) {
      setVerificationError("Please enter the verification code");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setVerificationError("Verification code must be 6 digits");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError("");

      await verifyOtp(email.trim(), otp.trim());

      Alert.alert("Success!", "Your email has been verified. Registration complete!");
      setOtp("");
      onClose();
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message ||
        "Unable to verify code. Please check and try again.";
      setVerificationError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle OTP resend
   */
  const handleResend = async () => {
    if (isResending || resendTimer > 0) return;

    if (!email) {
      Alert.alert("Error", "Email not found.");
      return;
    }

    try {
      setIsResending(true);
      const result = await resendOtp(email.trim());
      Alert.alert("Code Sent", result.message);
      setOtp("");
      setVerificationError("");
      startResendTimer();
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message ||
        "Unable to resend code. Please try again.";
      Alert.alert("Resend Failed", message);
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setOtp("");
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
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
      >
        <View
          className="w-full max-w-md rounded-3xl bg-white overflow-hidden shadow-2xl"
          style={{
            shadowColor: "#2A7DE1",
            shadowOpacity: 0.25,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          {/* Header */}
          <View className="bg-blue-600 px-6 pt-6 pb-5 overflow-hidden">
            {/* Decorative circles */}
            <View
              className="absolute -right-8 -top-8 rounded-full bg-white/10"
              style={{ width: 120, height: 120 }}
            />
            <View
              className="absolute right-10 bottom-0 rounded-full bg-white/10"
              style={{ width: 60, height: 60 }}
            />

            {/* Close button */}
            <View className="flex-row justify-end mb-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close verification"
                onPress={handleClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-white/20"
              >
                <Feather name="x" size={15} color="#fff" />
              </Pressable>
            </View>

            {/* Title row */}
            <View className="flex-row items-center gap-3">
              <View className="rounded-2xl bg-white/20 p-2.5">
                <Feather name="shield" size={22} color="#fff" />
              </View>
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  EMAIL VERIFICATION
                </Text>
                <Text className="text-xl font-extrabold text-white leading-tight">
                  Enter Verification Code
                </Text>
              </View>
            </View>
            <Text className="mt-2 text-xs text-white/70">
              We sent a 6-digit code to{" "}
              <Text className="font-semibold text-white/90">{email}</Text>. Enter it below to
              activate your account.
            </Text>
          </View>

          {/* Content */}
          <View className="px-6 py-5 gap-4">
            {/* OTP Input */}
            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                6-Digit Code
              </Text>
              <View
                className={`flex-row items-center rounded-2xl border bg-slate-50 px-3.5 py-2.5 ${
                  verificationError ? "border-red-400" : "border-slate-200"
                }`}
              >
                <Feather name="shield-off" size={15} color="#94A3B8" />
                <TextInput
                  value={otp}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, "");
                    setOtp(numericText.slice(0, 6));
                    if (verificationError) setVerificationError("");
                  }}
                  placeholder="••••••"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="flex-1 pl-2.5 text-center text-lg font-semibold tracking-[0.4em] text-slate-900"
                  placeholderTextColor="#CBD5E1"
                />
              </View>

              {verificationError ? (
                <View className="flex-row mt-2 items-center">
                  <Feather name="alert-circle" size={13} color="#dc2626" />
                  <Text className="text-red-600 text-xs ml-1.5">{verificationError}</Text>
                </View>
              ) : (
                <Text className="mt-1 text-[10px] text-slate-400">
                  This code will expire in 5 minutes.
                </Text>
              )}
            </View>

            {/* Resend / Switch account row */}
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={handleResend}
                disabled={isResending || resendTimer > 0}
              >
                <View className="flex-row items-center gap-1.5">
                  <Feather
                    name="refresh-ccw"
                    size={12}
                    color={isResending || resendTimer > 0 ? "#CBD5E1" : "#2A7DE1"}
                  />
                  <Text
                    className={`text-[11px] font-semibold ${
                      isResending || resendTimer > 0 ? "text-slate-300" : "text-blue-600"
                    }`}
                  >
                    {isResending
                      ? "Sending..."
                      : resendTimer > 0
                        ? `Resend Code (${resendTimer}s)`
                        : "Resend Code"}
                  </Text>
                </View>
              </Pressable>

              <Pressable onPress={logout}>
                <Text className="text-[11px] font-semibold text-slate-400">
                  Use a different account
                </Text>
              </Pressable>
            </View>

            {/* Verify Button */}
            <Pressable
              className="mt-1 rounded-2xl bg-blue-600 py-3.5"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed || isVerifying || otp.length !== 6 ? 0.7 : 1,
                shadowColor: "#2A7DE1",
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              })}
              disabled={isVerifying || otp.length !== 6}
              onPress={handleVerify}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Feather name="check-circle" size={16} color="#fff" />
                <Text className="text-sm font-bold text-white">
                  {isVerifying ? "Verifying..." : "Verify Email"}
                </Text>
              </View>
            </Pressable>

            {/* Footer note */}
            <View className="flex-row items-center justify-center gap-1.5 pt-1">
              <Feather name="lock" size={10} color="#CBD5E1" />
              <Text className="text-[10px] text-slate-400">
                OTP is used only for verification and will not be reused.
              </Text>
            </View>
          </View>

          {/* Info footer */}
          <View className="bg-blue-50 px-6 py-4 border-t border-blue-100">
            <View className="flex-row">
              <Feather name="info" size={14} color="#2A7DE1" />
              <Text className="text-blue-800 text-xs ml-2 flex-1">
                Can't find the email? Check your spam or junk folder.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}