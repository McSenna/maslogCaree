import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import { announcementDateRange, parseDateKey, toDateKey } from "../../announcementRules";
import { formatDateKeyLabel } from "../../announcementFormat";
import ClearEndDateButton from "./ClearEndDateButton";
import { END_DATE_HELPER, END_DATE_LABEL, type AnnouncementEndDateFieldProps } from "./endDateField.types";
import PickerTrigger from "./PickerTrigger";

const IS_IOS = Platform.OS === "ios";

/** Optional last day the announcement stays up, with the same picker as the event date. */
const AnnouncementEndDateField = ({ value, eventDate, onChange, error, disabled }: AnnouncementEndDateFieldProps) => {
  const colors = useThemeColors();
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const range = useMemo(() => announcementDateRange(), []);
  const earliest = eventDate && eventDate > range.min ? eventDate : range.min;
  const pickerValue = parseDateKey(value) ?? parseDateKey(earliest) ?? new Date();

  const handleChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (!IS_IOS) setOpen(false);
    if (event.type === "dismissed" || !picked) return;
    onChange(toDateKey(picked));
  };

  return (
    <View className="gap-1">
      <PickerTrigger
        label={END_DATE_LABEL}
        placeholder="No end date"
        display={formatDateKeyLabel(value)}
        icon="calendar"
        open={open}
        error={error}
        helper={value ? undefined : END_DATE_HELPER}
        required={false}
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
      />
      {value ? <ClearEndDateButton onPress={() => onChange("")} disabled={disabled} /> : null}

      {open ? (
        <View
          style={
            IS_IOS
              ? { borderRadius: RADII.medium, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }
              : undefined
          }
        >
          <DateTimePicker
            value={pickerValue}
            mode="date"
            display={IS_IOS ? "spinner" : "default"}
            minimumDate={parseDateKey(earliest) ?? undefined}
            themeVariant={resolvedTheme === "dark" ? "dark" : "light"}
            onChange={handleChange}
          />
          {IS_IOS ? (
            <Pressable
              onPress={() => {
                // The spinner only reports changes, so confirm what is showing.
                onChange(toDateKey(pickerValue));
                setOpen(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Use this end date"
              className="min-h-11 items-center justify-center border-t"
              style={{ borderTopColor: colors.border }}
            >
              <Text className="text-[15px] font-semibold" style={{ color: colors.primary }}>
                Done
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default AnnouncementEndDateField;
