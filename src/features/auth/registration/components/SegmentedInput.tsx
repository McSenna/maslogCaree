import { Pressable, Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";
import FieldShell from "./FieldShell";

type SegmentedInputProps<T extends string> = {
  label: string;
  value: string;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  required?: boolean;
  error?: string;
  height: number;
};

const SegmentedInput = <T extends string>({
  label,
  value,
  options,
  onChange,
  required,
  error,
  height,
}: SegmentedInputProps<T>) => (
  <FieldShell label={label} required={required} error={error}>
    <View
      accessibilityRole="radiogroup"
      style={{
        flexDirection: "row",
        height,
        padding: 4,
        gap: 4,
        borderWidth: 1,
        borderRadius: REG_RADIUS.control,
        borderColor: error ? REG_COLORS.error : REG_COLORS.border,
        backgroundColor: REG_COLORS.surfaceMuted,
      }}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={option.label}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: REG_RADIUS.control - 4,
              backgroundColor: selected ? REG_COLORS.primary : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 14.5,
                fontWeight: selected ? "700" : "500",
                color: selected ? REG_COLORS.surface : REG_COLORS.muted,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </FieldShell>
);

export default SegmentedInput;
