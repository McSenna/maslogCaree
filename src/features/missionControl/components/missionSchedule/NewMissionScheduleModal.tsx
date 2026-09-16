import type { ConsultationCategory, MissionScheduleRecord } from "@/services/appointments";
import { useWindowDimensions, View } from "react-native";
import type { MissionForm, MissionFormField } from "../../hooks/useMissionForm";
import MissionScheduleForm from "./MissionScheduleForm";
import MissionScheduleSheet, { MISSION_SHEET_BREAKPOINT } from "./MissionScheduleSheet";
import MissionSubmitButton, { MissionSecurityNote } from "./MissionSubmitButton";
import { useMissionScheduleValidation } from "./useMissionScheduleValidation";

type NewMissionScheduleModalProps = {
  visible: boolean;
  form: MissionForm;
  categories: ConsultationCategory[];
  missions: MissionScheduleRecord[];
  saving: boolean;
  onOpenPicker: (field: MissionFormField) => void;
  onClose: () => void;
  onCreate: () => void;
};

const NewMissionScheduleModal = ({
  visible,
  form,
  categories,
  missions,
  saving,
  onOpenPicker,
  onClose,
  onCreate,
}: NewMissionScheduleModalProps) => {
  const { width } = useWindowDimensions();
  const compact = width < MISSION_SHEET_BREAKPOINT;

  const { errors, isValid } = useMissionScheduleValidation({
    values: form.values,
    enabled: form.enabled,
    categories,
    missions,
  });

  return (
    <MissionScheduleSheet
      visible={visible}
      title="New mission schedule"
      subtitle="Pick a mission date, choose a time range, then select categories."
      onClose={onClose}
      footer={
        <View className="w-full">
          <MissionSubmitButton
            label="Create mission schedule"
            loadingLabel="Creating schedule…"
            onPress={onCreate}
            saving={saving}
            disabled={!isValid}
          />
          <MissionSecurityNote />
        </View>
      }
    >
      <MissionScheduleForm
        form={form}
        categories={categories}
        onOpenPicker={onOpenPicker}
        errors={errors}
        compact={compact}
      />
    </MissionScheduleSheet>
  );
};

export default NewMissionScheduleModal;
