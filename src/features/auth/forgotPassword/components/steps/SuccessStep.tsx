import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ForgotPasswordController } from "../../useForgotPassword";
import { RECOVERY_COLORS as C, RECOVERY_RADIUS as R } from "../../recoveryTheme";
import { PrimaryButton } from "../RecoveryControls";
import { StepHeading } from "./StepChrome";

const OutcomeRow = ({ label, done }: { label: string; done: boolean }) => (
  <View className="w-full flex-row items-center gap-2.5">
    <Feather
      name={done ? "check-circle" : "alert-circle"}
      size={15}
      color={done ? C.success : C.muted}
    />
    <Text
      className="min-w-0 flex-1 text-[12.5px]"
      style={{ color: done ? C.text : C.muted, fontWeight: done ? "600" : "400" }}
    >
      {label}
    </Text>
  </View>
);

export const SuccessStep = ({ flow }: { flow: ForgotPasswordController }) => {
  const notification = flow.outcome?.notification;
  const emailSent = Boolean(notification?.sent);
  const masked = notification?.maskedEmail;

  return (
    <View className="w-full items-center gap-5 py-2">
      <View
        className="h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: C.successSoft }}
      >
        <Feather name="check" size={36} color={C.success} />
      </View>

      <StepHeading
        title="Password Reset Successful!"
        subtitle={
          emailSent
            ? "Your password has been changed successfully. A security confirmation has been sent to your registered Gmail address."
            : "Your password has been changed successfully. You can now log in using your new password."
        }
      />

      <View
        className="w-full gap-2.5 px-4 py-3.5"
        style={{ borderRadius: R.control, backgroundColor: C.successSoft }}
      >
        <OutcomeRow label="Password changed" done />
        <OutcomeRow
          label={
            emailSent && masked
              ? `Security email sent to ${masked}`
              : "Security email could not be sent right now"
          }
          done={emailSent}
        />
      </View>

      <PrimaryButton label="Go to Login" onPress={flow.close} />
    </View>
  );
};
