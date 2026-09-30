import { useId, useMemo } from "react";
import { View } from "react-native";

import { announcementDateRange, parseClock } from "../../announcementRules";
import { formatClockLabel, formatDateKeyLabel } from "../../announcementFormat";
import type { AnnouncementDateTimeFieldsProps } from "./dateTimeFields.types";
import NativeInput from "./WebPickerInput";

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
  const baseId = useId();
  const range = useMemo(() => announcementDateRange(), []);

  return (
    <View style={stacked ? { gap: 16 } : { flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
      <View style={stacked ? undefined : { flex: 1.4, minWidth: 0 }}>
        <NativeInput
          id={`${baseId}-date`}
          type="date"
          label="Date"
          value={date}
          onChange={onChangeDate}
          error={dateError}
          helper={formatDateKeyLabel(date) || undefined}
          disabled={disabled}
          min={range.min}
          max={range.max}
        />
      </View>
      <View style={stacked ? undefined : { flex: 1, minWidth: 0 }}>
        <NativeInput
          id={`${baseId}-time`}
          type="time"
          label="Time"
          value={time}
          onChange={onChangeTime}
          error={timeError}
          helper={parseClock(time) === null ? undefined : formatClockLabel(time)}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default AnnouncementDateTimeFields;
