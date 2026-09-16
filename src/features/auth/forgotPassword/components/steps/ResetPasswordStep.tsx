import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

import type { ForgotPasswordController } from "../../useForgotPassword";
import { meetsAllPasswordRules } from "../../passwordRules";
import { RECOVERY_COLORS as C } from "../../recoveryTheme";
import PasswordRequirements, { PasswordStrengthMeter } from "../PasswordRequirements";
import { PrimaryButton, RecoveryField, RecoveryMessage } from "../RecoveryControls";
import { StepHeading, StepIcon } from "./StepChrome";

const eyeToggle = (shown: boolean, toggle: () => void) => (
  <Feather
    name={shown ? "eye-off" : "eye"}
    size={16}
    color={C.muted}
    onPress={toggle}
    accessibilityRole="button"
    accessibilityLabel={shown ? "Hide password" : "Show password"}
    suppressHighlighting
  />
);

export const ResetPasswordStep = ({ flow }: { flow: ForgotPasswordController }) => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mismatch = flow.confirmPassword.length > 0 && flow.newPassword !== flow.confirmPassword;
  const canSubmit =
    meetsAllPasswordRules(flow.newPassword) && !mismatch && flow.confirmPassword.length > 0;

  return (
    <View className="w-full items-center gap-4">
      <StepIcon icon="lock" />
      <StepHeading
        title="Create New Password"
        subtitle="Create a strong password to protect your MaslogCare account."
      />

      <RecoveryField
        label="New Password"
        icon="lock"
        value={flow.newPassword}
        onChangeText={(text) => {
          flow.setNewPassword(text);
          if (flow.error) flow.setError(null);
        }}
        placeholder="Enter a new password"
        secureTextEntry={!showNew}
        autoCapitalize="none"
        autoComplete="new-password"
        editable={!flow.isLoading}
        trailing={eyeToggle(showNew, () => setShowNew((v) => !v))}
      />

      <PasswordStrengthMeter value={flow.newPassword} />
      <PasswordRequirements value={flow.newPassword} />

      <RecoveryField
        label="Confirm New Password"
        icon="lock"
        value={flow.confirmPassword}
        onChangeText={(text) => {
          flow.setConfirmPassword(text);
          if (flow.error) flow.setError(null);
        }}
        placeholder="Re-enter your new password"
        secureTextEntry={!showConfirm}
        autoCapitalize="none"
        autoComplete="new-password"
        editable={!flow.isLoading}
        error={mismatch}
        trailing={eyeToggle(showConfirm, () => setShowConfirm((v) => !v))}
      />

      {mismatch ? <RecoveryMessage tone="error" text="The passwords do not match." /> : null}
      {flow.error ? <RecoveryMessage tone="error" text={flow.error} /> : null}

      <PrimaryButton
        label="Reset Password"
        loadingLabel="Resetting Password..."
        loading={flow.isLoading}
        disabled={!canSubmit}
        onPress={() => void flow.submitNewPassword()}
      />
    </View>
  );
};
