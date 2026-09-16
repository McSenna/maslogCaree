import { View } from "react-native";
import type { ConsultationCategory } from "@/services/appointments";
import type { MissionForm, MissionFormField } from "../../hooks/useMissionForm";
import MissionCategorySection from "./MissionCategorySection";
import MissionDateTimeSection from "./MissionDateTimeSection";
import type { MissionScheduleErrors } from "./useMissionScheduleValidation";
import { useMissionSchedulePalette } from "./missionScheduleTheme";

type MissionScheduleFormProps = {
  form: MissionForm;
  categories: ConsultationCategory[];
  onOpenPicker: (field: MissionFormField) => void;
  errors: MissionScheduleErrors;
  compact?: boolean;
};

const MissionScheduleForm = ({
  form,
  categories,
  onOpenPicker,
  errors,
  compact = false,
}: MissionScheduleFormProps) => {
  const palette = useMissionSchedulePalette();

  return (
    <View className="w-full gap-5">
      <MissionDateTimeSection
        values={form.values}
        onOpenPicker={onOpenPicker}
        compact={compact}
        dateError={errors.date}
        timeError={errors.time}
      />

      <View style={{ height: 1, backgroundColor: palette.divider }} />

      <MissionCategorySection
        categories={categories}
        enabled={form.enabled}
        durations={form.durations}
        onToggle={form.toggleCategory}
        onDurationChange={form.setDuration}
        compact={compact}
        error={errors.categories}
      />
    </View>
  );
};

export default MissionScheduleForm;
