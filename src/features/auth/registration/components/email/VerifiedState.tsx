import type { Ref } from "react";
import { Text, View } from "react-native";
import { REG_COLORS } from "../../registrationTheme";
import { maskEmail } from "./verificationCopy";
import { PrimaryButton } from "./VerificationButtons";
import VerificationIconBadge from "./VerificationIconBadge";
import { webOnly } from "./verificationTheme";

type VerifiedStateProps = {
  email: string;
  titleId: string;
  buttonHeight: number;
  reducedMotion: boolean;
  continueRef: Ref<View>;
  onDone: () => void;
};

const VerifiedState = ({ email, titleId, buttonHeight, reducedMotion, continueRef, onDone }: VerifiedStateProps) => (
  <View style={{ width: "100%", gap: 20 }}>
    <View
      {...webOnly({ role: "status", "aria-live": "polite" })}
      accessibilityLiveRegion="polite"
      style={{ alignItems: "center", gap: 8 }}
    >
      <VerificationIconBadge name="check" color={REG_COLORS.successText} background={REG_COLORS.secondarySoft} />
      <Text
        nativeID={titleId}
        accessibilityRole="header"
        style={{ fontSize: 19, fontWeight: "700", color: REG_COLORS.heading, textAlign: "center" }}
      >
        Email verified
      </Text>
      <Text style={{ fontSize: 14, lineHeight: 20, color: REG_COLORS.muted, textAlign: "center" }}>
        {maskEmail(email)} is confirmed. You can continue with your registration.
      </Text>
    </View>
    <PrimaryButton
      buttonRef={continueRef}
      label="Continue"
      onPress={onDone}
      height={buttonHeight}
      reducedMotion={reducedMotion}
    />
  </View>
);

export default VerifiedState;
