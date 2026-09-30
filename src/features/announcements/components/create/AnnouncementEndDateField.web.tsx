import { useId, useMemo } from "react";
import { View } from "react-native";

import { announcementDateRange } from "../../announcementRules";
import { formatDateKeyLabel } from "../../announcementFormat";
import ClearEndDateButton from "./ClearEndDateButton";
import { END_DATE_HELPER, END_DATE_LABEL, type AnnouncementEndDateFieldProps } from "./endDateField.types";
import NativeInput from "./WebPickerInput";

const AnnouncementEndDateField = ({ value, eventDate, onChange, error, disabled }: AnnouncementEndDateFieldProps) => {
  const id = useId();
  const range = useMemo(() => announcementDateRange(), []);
  const earliest = eventDate && eventDate > range.min ? eventDate : range.min;

  return (
    <View className="gap-1">
      <NativeInput
        id={`${id}-end`}
        type="date"
        label={END_DATE_LABEL}
        value={value}
        onChange={onChange}
        error={error}
        helper={value ? formatDateKeyLabel(value) : END_DATE_HELPER}
        disabled={disabled}
        min={earliest}
        required={false}
      />
      {value ? <ClearEndDateButton onPress={() => onChange("")} disabled={disabled} /> : null}
    </View>
  );
};

export default AnnouncementEndDateField;
