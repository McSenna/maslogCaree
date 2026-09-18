import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { PROFILE_COLORS as C, PROFILE_RADIUS } from "../config/profileTheme";
import { useChangePassword } from "./useChangePassword";

type ChangePasswordFormProps = {
  changePasswordState: ReturnType<typeof useChangePassword>;
  onCancel: () => void;
  compact?: boolean;
};

const STRENGTH_CONFIG = {
  weak: { label: "Weak", color: C.danger, fill: 1 },
  medium: { label: "Medium", color: "#D97706", fill: 2 },
  strong: { label: "Strong", color: C.green, fill: 3 },
} as const;

export const ChangePasswordForm = ({
  changePasswordState,
  onCancel,
  compact = false,
}: ChangePasswordFormProps) => {
  const {
    values,
    errors,
    isSubmitting,
    strength,
    setValue,
    handleSubmit,
    showCurrent,
    showNew,
    showConfirm,
    toggleShowCurrent,
    toggleShowNew,
    toggleShowConfirm,
    currentRef,
    newRef,
    confirmRef,
    focusNew,
    focusConfirm,
  } = changePasswordState;

  const strengthMeta = values.newPassword ? STRENGTH_CONFIG[strength] : null;

  return (
    <View style={{ width: "100%", gap: compact ? 14 : 16 }}>
      {/* Form Subtitle */}
      <Text
        style={{
          fontSize: compact ? 13 : 14,
          color: C.muted,
          lineHeight: compact ? 18 : 20,
        }}
      >
        Update your password to keep your MaslogCare account secure.
      </Text>

      {/* General error message banner */}
      {errors.general ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: C.dangerSoft,
            borderWidth: 1,
            borderColor: C.dangerBorder,
          }}
          accessibilityRole="alert"
        >
          <Feather name="alert-circle" size={16} color={C.danger} />
          <Text style={{ flex: 1, fontSize: 13, color: C.danger, fontWeight: "500" }}>
            {errors.general}
          </Text>
        </View>
      ) : null}

      {/* 1. Current Password */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: C.heading,
          }}
        >
          Current Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 46,
            borderRadius: PROFILE_RADIUS.control,
            borderWidth: 1,
            borderColor: errors.currentPassword ? C.danger : C.border,
            backgroundColor: C.background,
            paddingHorizontal: 14,
          }}
        >
          <Feather
            name="lock"
            size={16}
            color={errors.currentPassword ? C.danger : C.muted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            ref={currentRef}
            value={values.currentPassword}
            onChangeText={(text) => setValue("currentPassword", text)}
            placeholder="Enter your current password"
            placeholderTextColor={C.muted}
            secureTextEntry={!showCurrent}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="next"
            onSubmitEditing={focusNew}
            editable={!isSubmitting}
            style={{
              flex: 1,
              height: "100%",
              fontSize: 14,
              color: C.heading,
            }}
          />
          <Pressable
            onPress={toggleShowCurrent}
            accessibilityRole="button"
            accessibilityLabel={showCurrent ? "Hide current password" : "Show current password"}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            <Feather
              name={showCurrent ? "eye-off" : "eye"}
              size={17}
              color={C.muted}
            />
          </Pressable>
        </View>
        {errors.currentPassword ? (
          <Text style={{ fontSize: 12, color: C.danger, fontWeight: "500", marginTop: 2 }}>
            {errors.currentPassword}
          </Text>
        ) : null}
      </View>

      {/* 2. New Password */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: C.heading,
          }}
        >
          New Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 46,
            borderRadius: PROFILE_RADIUS.control,
            borderWidth: 1,
            borderColor: errors.newPassword ? C.danger : C.border,
            backgroundColor: C.background,
            paddingHorizontal: 14,
          }}
        >
          <Feather
            name="lock"
            size={16}
            color={errors.newPassword ? C.danger : C.muted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            ref={newRef}
            value={values.newPassword}
            onChangeText={(text) => setValue("newPassword", text)}
            placeholder="Enter your new password"
            placeholderTextColor={C.muted}
            secureTextEntry={!showNew}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={focusConfirm}
            editable={!isSubmitting}
            style={{
              flex: 1,
              height: "100%",
              fontSize: 14,
              color: C.heading,
            }}
          />
          <Pressable
            onPress={toggleShowNew}
            accessibilityRole="button"
            accessibilityLabel={showNew ? "Hide new password" : "Show new password"}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            <Feather
              name={showNew ? "eye-off" : "eye"}
              size={17}
              color={C.muted}
            />
          </Pressable>
        </View>

        {/* Password Strength Indicator */}
        {values.newPassword.length > 0 ? (
          <View
            style={{ gap: 4, marginTop: 4 }}
            accessibilityLabel={`Password strength: ${strengthMeta?.label ?? ""}`}
          >
            <View style={{ flexDirection: "row", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    backgroundColor:
                      strengthMeta && i < strengthMeta.fill ? strengthMeta.color : C.border,
                  }}
                />
              ))}
            </View>
            <Text
              style={{
                fontSize: 11.5,
                fontWeight: "600",
                color: strengthMeta?.color ?? C.muted,
              }}
            >
              {strengthMeta?.label} password
            </Text>
          </View>
        ) : null}

        {errors.newPassword ? (
          <Text style={{ fontSize: 12, color: C.danger, fontWeight: "500", marginTop: 2 }}>
            {errors.newPassword}
          </Text>
        ) : null}
      </View>

      {/* 3. Confirm New Password */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: C.heading,
          }}
        >
          Confirm New Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 46,
            borderRadius: PROFILE_RADIUS.control,
            borderWidth: 1,
            borderColor: errors.confirmPassword ? C.danger : C.border,
            backgroundColor: C.background,
            paddingHorizontal: 14,
          }}
        >
          <Feather
            name="lock"
            size={16}
            color={errors.confirmPassword ? C.danger : C.muted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            ref={confirmRef}
            value={values.confirmPassword}
            onChangeText={(text) => setValue("confirmPassword", text)}
            placeholder="Re-enter your new password"
            placeholderTextColor={C.muted}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!isSubmitting}
            style={{
              flex: 1,
              height: "100%",
              fontSize: 14,
              color: C.heading,
            }}
          />
          <Pressable
            onPress={toggleShowConfirm}
            accessibilityRole="button"
            accessibilityLabel={showConfirm ? "Hide confirm password" : "Show confirm password"}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            <Feather
              name={showConfirm ? "eye-off" : "eye"}
              size={17}
              color={C.muted}
            />
          </Pressable>
        </View>
        {errors.confirmPassword ? (
          <Text style={{ fontSize: 12, color: C.danger, fontWeight: "500", marginTop: 2 }}>
            {errors.confirmPassword}
          </Text>
        ) : null}
      </View>

      {/* Form Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          marginTop: compact ? 8 : 12,
        }}
      >
        <Pressable
          onPress={onCancel}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Cancel change password"
          style={({ pressed }) => ({
            paddingHorizontal: 18,
            paddingVertical: 11,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: pressed ? C.border : "transparent",
            opacity: isSubmitting ? 0.5 : 1,
          })}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: C.body }}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel={isSubmitting ? "Changing password" : "Change Password"}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingHorizontal: 22,
            paddingVertical: 11,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: pressed ? "#1D4ED8" : C.primary,
            opacity: isSubmitting ? 0.75 : 1,
          })}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
                Changing Password...
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
              Change Password
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default ChangePasswordForm;
