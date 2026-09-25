import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";
import type { SelectOption } from "./selectFieldTypes";
import { webStyle } from "@/theme/webStyle";

type Props = {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  selected: SelectOption | null;
  open: boolean;
  hasError: boolean;
  isDisabled: boolean;
  loading: boolean;
  loadingText: string;
  onPress: () => void;
};

const SelectTrigger = ({
  label,
  placeholder,
  icon,
  selected,
  open,
  hasError,
  isDisabled,
  loading,
  loadingText,
  onPress,
}: Props) => {
  const borderColor = hasError
    ? APPOINTMENT_COLORS.danger
    : open
      ? APPOINTMENT_COLORS.primaryBright
      : APPOINTMENT_COLORS.border;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={`Opens the ${label.toLowerCase()} picker`}
      accessibilityState={{ disabled: isDisabled, expanded: open }}
      accessibilityValue={{ text: selected?.label ?? placeholder }}
      disabled={isDisabled}
      onPress={onPress}
      className="w-full flex-row items-center"
      style={{
        height: APPOINTMENT_METRICS.fieldHeight,
        paddingHorizontal: 14,
        gap: 10,
        borderRadius: APPOINTMENT_METRICS.radiusField,
        borderWidth: hasError || open ? 1.5 : 1,
        borderColor,
        backgroundColor: isDisabled ? "#F7F9FC" : APPOINTMENT_COLORS.white,
        opacity: isDisabled ? 0.75 : 1,
        ...webStyle({ cursor: isDisabled ? "default" : "pointer" }),
      }}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={hasError ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.primaryBright}
      />

      {loading ? (
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <ActivityIndicator size="small" color={APPOINTMENT_COLORS.primaryBright} />
          <Text style={{ fontSize: 15, color: APPOINTMENT_COLORS.mutedText }}>{loadingText}</Text>
        </View>
      ) : (
        <Text
          numberOfLines={1}
          className="min-w-0 flex-1"
          style={{
            fontSize: 15,
            fontWeight: selected ? "600" : "400",
            color: selected ? APPOINTMENT_COLORS.bodyText : APPOINTMENT_COLORS.placeholder,
          }}
        >
          {selected?.label ?? placeholder}
        </Text>
      )}

      <Feather
        name={open ? "chevron-up" : "chevron-down"}
        size={20}
        color={APPOINTMENT_COLORS.mutedText}
      />
    </Pressable>
  );
};

export default SelectTrigger;
