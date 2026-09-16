import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RECOVERY_COLORS as C, RECOVERY_RADIUS as R } from "../recoveryTheme";

export const PrimaryButton = ({
  label,
  loadingLabel,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  loadingLabel?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) => {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(inactive), busy: Boolean(loading) }}
      className="h-12 w-full flex-row items-center justify-center gap-2"
      style={{ borderRadius: R.control, backgroundColor: C.primary, opacity: inactive ? 0.5 : 1 }}
    >
      {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
      <Text className="text-[15px] font-semibold text-white">
        {loading ? (loadingLabel ?? label) : label}
      </Text>
    </Pressable>
  );
};

export const TextButton = ({
  label,
  onPress,
  icon,
  disabled,
  tone = "muted",
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  tone?: "muted" | "primary";
}) => {
  const color = disabled ? C.border : tone === "primary" ? C.primary : C.muted;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={12}
      className="h-11 flex-row items-center justify-center gap-1.5"
      style={({ pressed }) => ({ opacity: pressed && !disabled ? 0.6 : 1 })}
    >
      {icon ? <Feather name={icon} size={14} color={color} /> : null}
      <Text className="text-[13px] font-semibold" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
};

export const RecoveryField = ({
  label,
  icon,
  error,
  trailing,
  ...input
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  error?: boolean;
  trailing?: ReactNode;
} & React.ComponentProps<typeof TextInput>) => (
  <View className="w-full gap-1.5">
    <Text className="text-[12.5px] font-semibold" style={{ color: C.text }}>
      {label}
    </Text>
    <View
      className="h-12 w-full flex-row items-center gap-2.5 px-3.5"
      style={{
        borderRadius: R.control,
        borderWidth: 1,
        borderColor: error ? C.error : C.border,
        backgroundColor: error ? C.errorSoft : C.surface,
      }}
    >
      <Feather name={icon} size={16} color={error ? C.error : C.muted} />
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#94A3B8"
        {...input}
        className="min-w-0 flex-1 text-[14.5px]"
        style={{ color: C.text, outlineStyle: "none" } as never}
      />
      {trailing}
    </View>
  </View>
);

export const RecoveryMessage = ({ tone, text }: { tone: "error" | "info"; text: string }) => {
  const isError = tone === "error";
  return (
    <View
      accessibilityRole="alert"
      className="w-full flex-row items-start gap-2 px-3 py-2.5"
      style={{
        borderRadius: R.control,
        backgroundColor: isError ? C.errorSoft : C.primarySoft,
      }}
    >
      <Feather
        name={isError ? "alert-circle" : "info"}
        size={14}
        color={isError ? C.error : C.primary}
        style={{ marginTop: 1 }}
      />
      <Text
        className="min-w-0 flex-1 text-[12.5px] leading-[18px]"
        style={{ color: isError ? C.error : C.primary }}
      >
        {text}
      </Text>
    </View>
  );
};
