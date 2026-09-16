import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  FieldLabel,
  buildShellStyle,
  parseDateKey,
  toDateKey,
  type FieldPartProps,
} from "./fieldShell";

const DateField = ({
  field,
  value,
  onChange,
  palette,
  helper,
  error,
  disabled,
}: FieldPartProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const boxStyle = { ...buildShellStyle(palette, error, disabled), color: palette.heading } as const;
  const display = typeof value === "string" && value ? value.slice(0, 10) : "";

  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />

      {Platform.OS === "web" ? (
        <TextInput
          value={display}
          onChangeText={(text) => onChange(text)}
          editable={!disabled}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={palette.subtle}
          accessibilityLabel={field.label}
          className="h-11 px-3 text-[14px]"
          style={boxStyle}
        />
      ) : (
        <Pressable
          onPress={() => !disabled && setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`${field.label}${display ? `: ${display}` : ", not set"}`}
          className="h-11 flex-row items-center justify-between px-3"
          style={boxStyle}
        >
          <Text
            className="text-[14px]"
            style={{ color: display ? palette.heading : palette.subtle }}
          >
            {display || "Select a date"}
          </Text>
          <Feather name="calendar" size={16} color={palette.muted} />
        </Pressable>
      )}

      <View className="mt-1 flex-row items-center justify-between">
        <Text className="text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
          {helper ?? ""}
        </Text>
        {display ? (
          <Pressable
            onPress={() => !disabled && onChange(null)}
            accessibilityRole="button"
            accessibilityLabel={`Clear ${field.label}`}
            hitSlop={10}
          >
            <Text className="text-[11.5px] font-semibold" style={{ color: palette.primary }}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>

      {pickerOpen && Platform.OS !== "web" ? (
        <DateTimePicker
          value={parseDateKey(value)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event: { type?: string }, date?: Date) => {
            setPickerOpen(false);
            if (event?.type === "dismissed" || !date) return;
            onChange(toDateKey(date));
          }}
        />
      ) : null}
    </View>
  );
};

export default DateField;
