import { Feather } from "@expo/vector-icons";
import { useId } from "react";
import { Platform, Pressable, Text } from "react-native";

import { resolveFieldAppearance } from "@/components/forms/fieldAppearance";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import PickerFieldShell from "./PickerFieldShell";

const IS_IOS = Platform.OS === "ios";

/** A field-shaped button that opens the platform date or time picker. */
type PickerTriggerProps = {
  label: string;
  placeholder: string;
  display: string;
  icon: keyof typeof Feather.glyphMap;
  open: boolean;
  error?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

const PickerTrigger = ({
  label,
  placeholder,
  display,
  icon,
  open,
  error,
  helper,
  required = true,
  disabled,
  onPress,
}: PickerTriggerProps) => {
  const colors = useThemeColors();
  const messageId = useId();
  const look = resolveFieldAppearance(colors, {
    focused: open,
    hovered: false,
    error: Boolean(error),
    success: false,
    disabled: Boolean(disabled),
  });

  return (
    <PickerFieldShell label={label} messageId={messageId} error={error} helper={helper} required={required}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display || "not set"}`}
        accessibilityHint={`Opens the ${label.toLowerCase()} picker`}
        accessibilityState={{ disabled: Boolean(disabled), expanded: IS_IOS ? open : undefined }}
        style={{
          minHeight: 46,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 14,
          borderRadius: RADII.medium,
          borderWidth: look.borderWidth,
          borderColor: look.border,
          backgroundColor: look.background,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Feather name={icon} size={16} color={look.icon} />
        <Text
          numberOfLines={1}
          style={{ flex: 1, minWidth: 0, fontSize: 15, color: display ? colors.heading : colors.subtle }}
        >
          {display || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.muted} />
      </Pressable>
    </PickerFieldShell>
  );
};

export default PickerTrigger;
