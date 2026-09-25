import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

type Props = {
  isResending: boolean;
  resendTimer: number;
  resendDisabled: boolean;
  isVerifying: boolean;
  verified: boolean;
  otpComplete: boolean;
  onResend: () => void;
  onVerify: () => void;
  onSwitchAccount: () => void;
};

const resendLabel = (isResending: boolean, resendTimer: number) =>
  isResending ? "Sending…" : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code";

const OtpModalActions = ({
  isResending,
  resendTimer,
  resendDisabled,
  isVerifying,
  verified,
  otpComplete,
  onResend,
  onVerify,
  onSwitchAccount,
}: Props) => {
  const colors = useThemeColors();

  return (
    <View style={{ gap: SPACING.md }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <Button
          variant="text"
          size="sm"
          icon="refresh-ccw"
          label={resendLabel(isResending, resendTimer)}
          disabled={resendDisabled}
          onPress={onResend}
        />
        <Button variant="text" size="sm" label="Use a different account" onPress={onSwitchAccount} />
      </View>

      <Button
        label={verified ? "Verified" : "Verify code"}
        loadingLabel="Verifying…"
        icon="check-circle"
        size="lg"
        fullWidth
        loading={isVerifying}
        disabled={!otpComplete || verified}
        onPress={onVerify}
      />

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.xs + 2 }}>
        <Feather name="lock" size={12} color={colors.subtle} />
        <Text style={[TYPE.caption, { color: colors.muted, textAlign: "center" }]}>
          Codes are single-use and only verify your email.
        </Text>
      </View>
    </View>
  );
};

export default OtpModalActions;
