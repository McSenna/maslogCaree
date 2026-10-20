import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { REG_COLORS } from "../../registrationTheme";
import { fieldSurface } from "../fieldStyles";

const SelectTrigger = ({
  label,
  selectedLabel,
  placeholder,
  icon,
  open,
  error,
  height,
  onPress,
  disabled,
}: {
  label: string;
  selectedLabel?: string;
  placeholder: string;
  icon?: keyof typeof Feather.glyphMap;
  open: boolean;
  error?: string;
  height: number;
  onPress: () => void;
  disabled?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      disabled={disabled}
      accessibilityState={{ expanded: open, disabled }}
      aria-expanded={open}
      aria-disabled={disabled}
      accessibilityHint={`Opens ${label.toLowerCase()} options`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityValue={{ text: selectedLabel ?? placeholder }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        height,
        paddingHorizontal: 14,
        gap: 10,
        ...fieldSurface({
          focused: open || focused,
          invalid: Boolean(error),
          disabled,
        }),
      }}
    >
      {icon ? (
        <Feather
          name={icon}
          size={17}
          color={open ? REG_COLORS.primary : REG_COLORS.subtle}
        />
      ) : null}
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 15,
          color: selectedLabel ? REG_COLORS.text : REG_COLORS.subtle,
        }}
      >
        {selectedLabel ?? placeholder}
      </Text>
      <Feather name="chevron-down" size={17} color={REG_COLORS.muted} />
    </Pressable>
  );
};

export default SelectTrigger;
