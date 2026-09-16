import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const MC_PRIMARY = "#2A7DE1";

type Props = {
  isResending: boolean;
  resendTimer: number;
  resendDisabled: boolean;
  isVerifying: boolean;
  otpComplete: boolean;
  onResend: () => void;
  onVerify: () => void;
  onSwitchAccount: () => void;
};

const OtpModalActions = ({
  isResending,
  resendTimer,
  resendDisabled,
  isVerifying,
  otpComplete,
  onResend,
  onVerify,
  onSwitchAccount,
}: Props) => {
  const resendColor = resendDisabled ? "#94A3B8" : MC_PRIMARY;

  return (
    <>
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={onResend}
          disabled={resendDisabled}
          accessibilityRole="button"
          accessibilityLabel={resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend code"}
        >
          <View className="flex-row items-center gap-2">
            <Feather name="refresh-ccw" size={12} color={resendColor} />
            <Text className="text-[11px] font-semibold" style={{ color: resendColor }}>
              {isResending
                ? "Sending…"
                : resendTimer > 0
                  ? `Resend (${resendTimer}s)`
                  : "Resend OTP"}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={onSwitchAccount}
          accessibilityRole="button"
          accessibilityLabel="Use a different account"
        >
          <Text className="text-[11px] font-semibold text-slate-500">
            Use a different account
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onVerify}
        disabled={isVerifying || !otpComplete}
        className="rounded-xl bg-mc-primary items-center justify-center w-full"
        style={({ pressed }) => ({
          height: 50,
          opacity: pressed || isVerifying || !otpComplete ? 0.7 : 1,
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
    </>
  );
};

export default OtpModalActions;
