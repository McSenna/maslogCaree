import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import TextField from "@/components/forms/TextField";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useChangePassword } from "./useChangePassword";

type ChangePasswordFormProps = {
  changePasswordState: ReturnType<typeof useChangePassword>;
  onCancel: () => void;
  compact?: boolean;
};

export const ChangePasswordForm = ({ changePasswordState, onCancel, compact = false }: ChangePasswordFormProps) => {
  const colors = useThemeColors();
  const { values, errors, isSubmitting, strength, setValue, handleSubmit, currentRef, newRef, confirmRef, focusNew, focusConfirm } =
    changePasswordState;

  return (
    <View style={{ width: "100%", gap: compact ? 14 : 16 }}>
      <Text style={{ fontSize: compact ? 13 : 14, lineHeight: compact ? 18 : 20, color: colors.muted }}>
        Update your password to keep your MaslogCare account secure.
      </Text>

      {errors.general ? (
        <View
          accessibilityRole="alert"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: RADII.medium,
            borderWidth: 1,
            borderColor: colors.danger.border,
            backgroundColor: colors.danger.bg,
          }}
        >
          <Feather name="alert-circle" size={16} color={colors.danger.fg} />
          <Text style={{ flex: 1, fontSize: 13, fontWeight: "500", color: colors.danger.fg }}>{errors.general}</Text>
        </View>
      ) : null}

      <TextField
        inputRef={currentRef}
        label="Current password"
        leftIcon="lock"
        secureToggle
        value={values.currentPassword}
        onChangeText={(text) => setValue("currentPassword", text)}
        placeholder="Enter your current password"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="next"
        onSubmitEditing={focusNew}
        disabled={isSubmitting}
        error={errors.currentPassword}
      />

      <TextField
        inputRef={newRef}
        label="New password"
        leftIcon="lock"
        secureToggle
        value={values.newPassword}
        onChangeText={(text) => setValue("newPassword", text)}
        placeholder="Enter your new password"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={focusConfirm}
        disabled={isSubmitting}
        error={errors.newPassword}
      />
      {values.newPassword ? <PasswordStrengthMeter strength={strength} /> : null}

      <TextField
        inputRef={confirmRef}
        label="Confirm new password"
        leftIcon="lock"
        secureToggle
        value={values.confirmPassword}
        onChangeText={(text) => setValue("confirmPassword", text)}
        placeholder="Re-enter your new password"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        disabled={isSubmitting}
        error={errors.confirmPassword}
        success={Boolean(values.confirmPassword) && values.confirmPassword === values.newPassword}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 12, marginTop: compact ? 8 : 12 }}>
        <Button variant="ghost" label="Cancel" onPress={onCancel} disabled={isSubmitting} accessibilityLabel="Cancel change password" />
        <Button label="Change password" loading={isSubmitting} loadingLabel="Changing password…" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default ChangePasswordForm;
