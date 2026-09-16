import { Pressable, Text, View } from "react-native";

import { QUEUE_RADIUS } from "@/components/appointmentQueue/queueTheme";

import { FieldHelper, FieldLabel, type FieldPartProps } from "./fieldShell";

const BooleanField = ({
  field,
  value,
  onChange,
  palette,
  helper,
  error,
  disabled,
}: FieldPartProps) => {
  const on = value === true;

  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />
      <View
        className="flex-row overflow-hidden self-start"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.panelBorder,
        }}
      >
        {[
          { label: "No", selected: !on, next: false },
          { label: "Yes", selected: on, next: true },
        ].map((option) => (
          <Pressable
            key={option.label}
            onPress={() => !disabled && onChange(option.next)}
            accessibilityRole="radio"
            accessibilityState={{ selected: option.selected, disabled }}
            accessibilityLabel={`${field.label}: ${option.label}`}
            className="h-10 items-center justify-center px-6"
            style={{ backgroundColor: option.selected ? palette.primary : "transparent" }}
          >
            <Text
              className="text-[13.5px] font-semibold"
              style={{ color: option.selected ? "#FFFFFF" : palette.muted }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FieldHelper helper={helper} error={error} palette={palette} />
    </View>
  );
};

export default BooleanField;
