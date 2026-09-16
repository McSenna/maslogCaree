import { Pressable, Text, View } from "react-native";

import { QUEUE_RADIUS } from "@/components/appointmentQueue/queueTheme";

import { FieldHelper, FieldLabel, type FieldPartProps } from "./fieldShell";

const SelectField = ({
  field,
  value,
  onChange,
  palette,
  helper,
  error,
  disabled,
}: FieldPartProps) => {
  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />
      <View className="flex-row flex-wrap gap-2">
        {(field.options ?? []).map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => !disabled && onChange(selected ? null : option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
              accessibilityLabel={option.label}
              className="h-9 items-center justify-center px-3.5"
              style={{
                borderRadius: QUEUE_RADIUS.pill,
                borderWidth: 1,
                borderColor: selected ? palette.primary : palette.panelBorder,
                backgroundColor: selected ? palette.primarySoft : "transparent",
              }}
            >
              <Text
                className={`text-[13px] ${selected ? "font-semibold" : "font-medium"}`}
                style={{ color: selected ? palette.primary : palette.muted }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FieldHelper helper={helper} error={error} palette={palette} />
    </View>
  );
};

export default SelectField;
