import { Text, View } from "react-native";
import type { MissionFormField, MissionFormValues } from "../../hooks/useMissionForm";
import { formatClockLabel, formatLongDateLabel } from "../../utils/dateTime";
import MissionPickerField from "./MissionPickerField";
import { useMissionSchedulePalette } from "./missionScheduleTheme";

type MissionDateTimeSectionProps = {
  values: MissionFormValues;
  onOpenPicker: (field: MissionFormField) => void;
  compact?: boolean;
  timeError?: string | null;
  dateError?: string | null;
};

const MissionDateTimeSection = ({
  values,
  onOpenPicker,
  compact = false,
  timeError,
  dateError,
}: MissionDateTimeSectionProps) => {
  const palette = useMissionSchedulePalette();

  return (
    <View className="w-full gap-3.5">
      <View>
        <MissionPickerField
          label="Mission date"
          value={values.date}
          hint={formatLongDateLabel(values.date)}
          icon="calendar"
          invalid={Boolean(dateError)}
          onPress={() => onOpenPicker("date")}
        />
        {dateError ? (
          <Text className="mt-1.5 text-[12.5px] font-medium" style={{ color: palette.danger }}>
            {dateError}
          </Text>
        ) : null}
      </View>

      <View>
        <View className={compact ? "w-full gap-3.5" : "w-full flex-row gap-3"}>
          <MissionPickerField
            className={compact ? undefined : "min-w-0 flex-1"}
            label="Start time"
            value={formatClockLabel(values.startTime)}
            icon="clock"
            invalid={Boolean(timeError)}
            onPress={() => onOpenPicker("start")}
          />
          <MissionPickerField
            className={compact ? undefined : "min-w-0 flex-1"}
            label="End time"
            value={formatClockLabel(values.endTime)}
            icon="clock"
            invalid={Boolean(timeError)}
            onPress={() => onOpenPicker("end")}
          />
        </View>
        {timeError ? (
          <Text className="mt-1.5 text-[12.5px] font-medium" style={{ color: palette.danger }}>
            {timeError}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default MissionDateTimeSection;
