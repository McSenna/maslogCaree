import { Platform } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import type { MissionFormField, MissionFormValues } from "../hooks/useMissionForm";
import { fromClockTime, fromIsoDateKey, toClockTime, toIsoDateKey } from "../utils/dateTime";

type MissionDateTimePickerProps = {
  /** Which field is being edited, or null when the picker is closed. */
  field: MissionFormField | null;
  /** The values of whichever form opened the picker. */
  values: MissionFormValues;
  onChange: (field: MissionFormField, next: string) => void;
  onDismiss: () => void;
};

/** The picker's starting value, read back from the field it is editing. */
function initialValue(field: MissionFormField, values: MissionFormValues): Date {
  if (field === "date") return fromIsoDateKey(values.date);
  return fromClockTime(field === "start" ? values.startTime : values.endTime);
}

/**
 * The one native picker both mission forms share.
 *
 * Mounted only while a field is being edited: on Android the component *is*
 * the dialog, so unmounting is how it closes. Every value it produces is
 * written back in the API's own `YYYY-MM-DD` / `HH:mm` shape rather than a
 * locale string.
 */
export default function MissionDateTimePicker({
  field,
  values,
  onChange,
  onDismiss,
}: MissionDateTimePickerProps) {
  if (!field) return null;

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      onDismiss();
      return;
    }
    if (!date) return;

    onChange(field, field === "date" ? toIsoDateKey(date) : toClockTime(date));
    onDismiss();
  };

  return (
    <DateTimePicker
      value={initialValue(field, values)}
      mode={field === "date" ? "date" : "time"}
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={handleChange}
    />
  );
}
