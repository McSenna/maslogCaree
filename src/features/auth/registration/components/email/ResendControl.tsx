import { ActivityIndicator, Platform, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { useEmailVerification } from "../../hooks/useEmailVerification";
import { REG_COLORS, REG_METRICS } from "../../registrationTheme";
import { formatCountdown } from "./verificationCopy";
import { LinkButton } from "./VerificationButtons";

const ResendControl = ({
  verification,
}: {
  verification: ReturnType<typeof useEmailVerification>;
}) => {
  const { cooldown, isResending } = verification;

  if (isResending) {
    return (
      <View
        style={{ minHeight: REG_METRICS.touchTarget, flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        <ActivityIndicator size="small" color={REG_COLORS.primary} />
        <Text style={{ fontSize: 13.5, color: REG_COLORS.muted }}>Sending a new code…</Text>
      </View>
    );
  }

  if (cooldown > 0) {
    return (
      <View
        accessible
        accessibilityLabel={`Resend available in ${cooldown} seconds`}
        style={{ minHeight: REG_METRICS.touchTarget, flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Feather name="clock" size={14} color={REG_COLORS.muted} />
        <Text style={{ fontSize: 13.5, color: REG_COLORS.muted }}>
          Resend code in{" "}
          <Text style={{ fontWeight: "600", ...Platform.select({ web: { fontVariantNumeric: "tabular-nums" } as object }) }}>
            {formatCountdown(cooldown)}
          </Text>
        </Text>
      </View>
    );
  }

  return (
    <LinkButton
      label="Resend code"
      accessibilityLabel="Resend verification code"
      icon="rotate-cw"
      onPress={() => void verification.sendCode()}
    />
  );
};

export default ResendControl;
