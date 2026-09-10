import { View } from "react-native";
import type { MissionFormField, MissionFormValues } from "../hooks/useMissionForm";
import PickerField from "./PickerField";

type MissionDateTimeFieldsProps = {
  values: MissionFormValues;
  onOpenPicker: (field: MissionFormField) => void;
};

/** The mission's date and hours — identical in the create panel and the edit sheet. */
export default function MissionDateTimeFields({
  values,
  onOpenPicker,
}: MissionDateTimeFieldsProps) {
  return (
    <>
      <PickerField
        label="Mission date"
        value={values.date}
        icon="calendar"
        strongLabel
        onPress={() => onOpenPicker("date")}
      />

      <View className="mt-3 flex-row gap-2">
        <PickerField
          className="flex-1"
          label="Start time"
          value={values.startTime}
          icon="clock"
          onPress={() => onOpenPicker("start")}
        />
        <PickerField
          className="flex-1"
          label="End time"
          value={values.endTime}
          icon="clock"
          onPress={() => onOpenPicker("end")}
        />
      </View>
    </>
  );
}
