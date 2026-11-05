import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { clockToDate, formatClock, toClock } from "./clockFormat";
import { FieldLabel, buildShellStyle, errorTextColor, type FieldPartProps } from "./fieldShell";
import TimePickerDialog from "./TimePickerDialog";

const IS_WEB = Platform.OS === "web";
const IS_IOS = Platform.OS === "ios";

/**
 * A time is always picked, never typed, like DateField: the app's picker on the
 * web, the system picker on phones. The value stays "HH:mm".
 */
const TimeField = ({ field, value, onChange, palette, helper, error, disabled }: FieldPartProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const clock = typeof value === "string" ? value : "";
  const shown = formatClock(clock);
  const name = field.label.replace(/\s*\(optional\)$/i, "").toLowerCase();

  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />

      <Pressable
        onPress={() => !disabled && setPickerOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${field.label}${field.required ? ", required" : ""}. ${shown || "Not set"}`}
        accessibilityHint="Opens a time picker"
        className="min-h-11 flex-row items-center gap-2.5 px-3 hover:opacity-90 active:opacity-80"
        style={buildShellStyle(palette, error, disabled)}
      >
        <Feather name="clock" size={16} color={error ? palette.subtle : palette.primary} />
        <Text className="min-w-0 flex-1 text-[16px]" style={{ color: shown ? palette.heading : palette.subtle }}>
          {shown || "Select a time"}
        </Text>
        <Feather name="chevron-down" size={16} color={palette.subtle} />
      </Pressable>

      <View className="mt-1 flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[13.5px]" style={{ color: error ? errorTextColor(palette) : palette.subtle }}>
          {helper ?? ""}
        </Text>
        {clock ? (
          <Pressable
            onPress={() => !disabled && onChange("")}
            accessibilityRole="button"
            accessibilityLabel={`Clear ${field.label}`}
            hitSlop={10}
          >
            <Text className="text-[13.5px] font-semibold" style={{ color: palette.primary }}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>

      {pickerOpen && IS_WEB ? (
        <TimePickerDialog
          title={`Select ${name}`}
          confirmLabel={`Confirm ${name}`}
          value={clock}
          onConfirm={(next) => onChange(next)}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}

      {pickerOpen && !IS_WEB ? (
        <>
          <DateTimePicker
            value={clockToDate(clock)}
            mode="time"
            is24Hour={false}
            display={IS_IOS ? "spinner" : "default"}
            onChange={(event: { type?: string }, date?: Date) => {
              // The iOS spinner reports every scroll, so it closes on Done instead.
              if (!IS_IOS) setPickerOpen(false);
              if (event?.type === "dismissed" || !date) return;
              onChange(toClock(date));
            }}
          />
          {IS_IOS ? (
            <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button" accessibilityLabel="Done choosing the time" className="min-h-11 items-end justify-center">
              <Text className="text-[16px] font-semibold" style={{ color: palette.primary }}>
                Done
              </Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  );
};

export default TimeField;
