import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import DateOfBirthPicker from "@/features/auth/components/datePicker/DateOfBirthPicker";
import { formatBirthDate } from "@/features/auth/utils/dateOfBirth";
import { PALETTE } from "@/theme/palette";

import { useVisitDay } from "../form/VisitDayContext";
import { boundsForField, openingMonth } from "./dateFieldBounds";
import { FieldLabel, buildShellStyle, parseDateKey, toDateKey, type FieldPartProps } from "./fieldShell";

const asLocalDate = (iso: string | null) => (iso ? parseDateKey(iso) : undefined);

/**
 * A date is always picked, never typed: the app's calendar on the web, the
 * system picker on phones. Both only offer days the field allows (see
 * dateFieldBounds), and the server checks the same limits.
 */
const DateField = ({ field, value, onChange, palette, helper, error, disabled }: FieldPartProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const bounds = boundsForField(field, useVisitDay());
  const day = typeof value === "string" && value ? value.slice(0, 10) : "";
  const shown = day ? formatBirthDate(day) : "";
  const isWeb = Platform.OS === "web";

  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />

      <Pressable
        onPress={() => !disabled && setPickerOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${field.label}${field.required ? ", required" : ""}. ${shown || "Not set"}`}
        accessibilityHint="Opens a calendar"
        className="min-h-11 flex-row items-center gap-2.5 px-3 hover:opacity-90 active:opacity-80"
        style={buildShellStyle(palette, error, disabled)}
      >
        <Feather name="calendar" size={16} color={error ? palette.subtle : palette.primary} />
        <Text className="min-w-0 flex-1 text-[14px]" style={{ color: shown ? palette.heading : palette.subtle }}>
          {shown || "Select a date"}
        </Text>
        <Feather name="chevron-down" size={16} color={palette.subtle} />
      </Pressable>

      <View className="mt-1 flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[11.5px]" style={{ color: error ? PALETTE.red[600] : palette.subtle }}>
          {helper ?? ""}
        </Text>
        {day ? (
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

      {isWeb ? (
        <DateOfBirthPicker
          visible={pickerOpen}
          value={day}
          onConfirm={(iso) => onChange(iso)}
          onClose={() => setPickerOpen(false)}
          opensAt={openingMonth(bounds)}
          bounds={bounds}
          title={`Select ${field.label.toLowerCase()}`}
          confirmLabel={`Confirm ${field.label.toLowerCase()}`}
        />
      ) : null}

      {pickerOpen && !isWeb ? (
        <DateTimePicker
          value={day ? parseDateKey(day) : asLocalDate(bounds.min) ?? new Date()}
          mode="date"
          minimumDate={asLocalDate(bounds.min)}
          maximumDate={asLocalDate(bounds.max)}
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
