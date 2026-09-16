import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ForgotPasswordController } from "../../useForgotPassword";
import { RECOVERY_COLORS as C, RECOVERY_RADIUS as R } from "../../recoveryTheme";
import { PrimaryButton, TextButton } from "../RecoveryControls";
import { StepHeading, StepIcon } from "./StepChrome";

export const EmailSentStep = ({ flow }: { flow: ForgotPasswordController }) => (
  <View className="w-full items-center gap-5">
    <StepIcon icon="mail" />
    <StepHeading
      title="Check Your Gmail"
      subtitle="We've sent a 6-digit verification code to your Gmail account."
    />

    <View
      className="w-full flex-row items-center justify-center gap-2 px-4 py-3"
      style={{ borderRadius: R.control, backgroundColor: C.primarySoft }}
    >
      <Feather name="check-circle" size={15} color={C.primary} />
      <Text
        className="text-[13.5px] font-semibold"
        style={{ color: C.primary }}
        numberOfLines={1}
      >
        {flow.email.trim().toLowerCase()}
      </Text>
    </View>

    <View className="w-full flex-row items-start gap-2">
      <Feather name="shield" size={13} color={C.muted} style={{ marginTop: 2 }} />
      <Text className="min-w-0 flex-1 text-[12px] leading-[17px]" style={{ color: C.muted }}>
        The verification code will expire shortly for your security.
      </Text>
    </View>

    <View className="w-full gap-1">
      <PrimaryButton label="Enter Verification Code" onPress={() => flow.setStep("otp")} />
      <TextButton label="Change Email" icon="edit-2" onPress={flow.changeEmail} />
    </View>
  </View>
);
