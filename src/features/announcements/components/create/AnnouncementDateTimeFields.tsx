import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import {
  announcementDateRange,
  combineDateTime,
  parseClock,
  parseDateKey,
  toClock,
  toDateKey,
} from "../../announcementRules";
import { formatClockLabel, formatDateKeyLabel } from "../../announcementFormat";
import type { AnnouncementDateTimeFieldsProps } from "./dateTimeFields.types";
import PickerTrigger from "./PickerTrigger";

type PickerMode = "date" | "time";

const IS_IOS = Platform.OS === "ios";

/**
 * Android opens the system date/time dialog; iOS shows the spinner inline
 * under the field with a Done button, since its value changes on every scroll.
 */
const AnnouncementDateTimeFields = ({
  date,
  time,
  onChangeDate,
  onChangeTime,
  dateError,
  timeError,
  disabled,
  stacked = false,
}: AnnouncementDateTimeFieldsProps) => {
  const colors = useThemeColors();
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = useState<PickerMode | null>(null);
  const range = useMemo(() => announcementDateRange(), []);

  const pickerValue = useMemo(() => {
    const fallback = new Date();
    fallback.setMinutes(0, 0, 0);
    fallback.setHours(fallback.getHours() + 1);
    const day = parseDateKey(date);
    const combined = combineDateTime(date, time);
    if (combined) return combined;
    if (day) {
      day.setHours(fallback.getHours(), 0, 0, 0);
      return day;
    }
    const minutes = parseClock(time);
    if (minutes !== null) fallback.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return fallback;
  }, [date, time]);

  const handleChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (!IS_IOS) setMode(null);
    if (event.type === "dismissed" || !picked) return;
    if (mode === "date") onChangeDate(toDateKey(picked));
    else onChangeTime(toClock(picked));
  };

  const toggle = (next: PickerMode) => setMode((current) => (current === next ? null : next));

  return (
    <View style={{ gap: 12 }}>
      <View style={stacked ? { gap: 16 } : { flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        <View style={stacked ? undefined : { flex: 1.4, minWidth: 0 }}>
          <PickerTrigger
            label="Date"
            placeholder="Select a date"
            display={formatDateKeyLabel(date)}
            icon="calendar"
            open={mode === "date"}
            error={dateError}
            disabled={disabled}
            onPress={() => toggle("date")}
          />
        </View>
        <View style={stacked ? undefined : { flex: 1, minWidth: 0 }}>
          <PickerTrigger
            label="Time"
            placeholder="Select a time"
            display={formatClockLabel(time)}
            icon="clock"
            open={mode === "time"}
            error={timeError}
            disabled={disabled}
            onPress={() => toggle("time")}
          />
        </View>
      </View>

      {mode ? (
        <View
          style={
            IS_IOS
              ? {
                  borderRadius: RADII.medium,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  overflow: "hidden",
                }
              : undefined
          }
        >
          <DateTimePicker
            value={pickerValue}
            mode={mode}
            display={IS_IOS ? "spinner" : "default"}
            minimumDate={mode === "date" ? parseDateKey(range.min) ?? undefined : undefined}
            maximumDate={mode === "date" ? parseDateKey(range.max) ?? undefined : undefined}
            themeVariant={resolvedTheme === "dark" ? "dark" : "light"}
            onChange={handleChange}
          />
          {IS_IOS ? (
            <Pressable
              onPress={() => {
                // The spinner only reports changes, so confirm what is showing.
                if (mode === "date") onChangeDate(toDateKey(pickerValue));
                else onChangeTime(toClock(pickerValue));
                setMode(null);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Use this ${mode}`}
              style={{
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.primary }}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default AnnouncementDateTimeFields;
