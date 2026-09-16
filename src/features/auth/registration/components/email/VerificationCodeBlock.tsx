import { Pressable, Text, View } from "react-native";

import OtpCodeInput from "@/components/ui/OtpCodeInput";

import { OTP_LENGTH } from "../../emailVerificationConfig";
import { REG_COLORS, REG_RADIUS } from "../../registrationTheme";

type VerificationCodeBlockProps = {
  code: string;
  onChangeCode: (next: string) => void;
  onVerify: (code: string) => void;
  isVerifying: boolean;
  hasError: boolean;
  height: number;
};

const OTP_PALETTE = {
  border: REG_COLORS.border,
  primary: REG_COLORS.primary,
  primarySoft: REG_COLORS.primarySoft,
  surface: REG_COLORS.surface,
  text: REG_COLORS.text,
  error: REG_COLORS.error,
  errorSoft: REG_COLORS.errorSoft,
};

const VerificationCodeBlock = ({
  code,
  onChangeCode,
  onVerify,
  isVerifying,
  hasError,
  height,
}: VerificationCodeBlockProps) => {
  const canVerify = code.length === OTP_LENGTH && !isVerifying;

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: REG_COLORS.heading }}>
        Verification Code
      </Text>

      <OtpCodeInput
        value={code}
        onChange={onChangeCode}
        onComplete={onVerify}
        palette={OTP_PALETTE}
        length={OTP_LENGTH}
        disabled={isVerifying}
        hasError={hasError}
        boxHeight={height}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Verify code"
        accessibilityState={{ disabled: !canVerify, busy: isVerifying }}
        onPress={() => onVerify(code)}
        disabled={!canVerify}
        style={{
          height,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: REG_RADIUS.control,
          backgroundColor: REG_COLORS.primary,
          opacity: canVerify ? 1 : 0.5,
        }}
      >
        <Text style={{ fontSize: 14.5, fontWeight: "700", color: REG_COLORS.surface }}>
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Text>
      </Pressable>
    </View>
  );
};

export default VerificationCodeBlock;
