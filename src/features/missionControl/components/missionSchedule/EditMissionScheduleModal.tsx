import { Pressable, Text, useWindowDimensions, View } from "react-native";
import type { ConsultationCategory, MissionScheduleRecord } from "@/services/appointments";
import type { MissionForm, MissionFormField } from "../../hooks/useMissionForm";
import MissionScheduleForm from "./MissionScheduleForm";
import MissionScheduleSheet, { MISSION_SHEET_BREAKPOINT } from "./MissionScheduleSheet";
import MissionSubmitButton from "./MissionSubmitButton";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";
import { useMissionScheduleValidation } from "./useMissionScheduleValidation";

type EditMissionScheduleModalProps = {
  visible: boolean;
  form: MissionForm;
  categories: ConsultationCategory[];
  missions: MissionScheduleRecord[];
  editingMissionId: string | null;
  saving: boolean;
  onOpenPicker: (field: MissionFormField) => void;
  onClose: () => void;
  onSave: () => void;
};

const EditMissionScheduleModal = ({
  visible,
  form,
  categories,
  missions,
  editingMissionId,
  saving,
  onOpenPicker,
  onClose,
  onSave,
}: EditMissionScheduleModalProps) => {
  const palette = useMissionSchedulePalette();
  const { width } = useWindowDimensions();
  const compact = width < MISSION_SHEET_BREAKPOINT;

  const { errors, isValid } = useMissionScheduleValidation({
    values: form.values,
    enabled: form.enabled,
    categories,
    missions,
    excludeMissionId: editingMissionId,
  });

  return (
    <MissionScheduleSheet
      visible={visible}
      title="Edit mission schedule"
      subtitle="Update the date, the time range, or the categories this mission runs."
      onClose={onClose}
      footer={
        <View className="w-full flex-row items-center gap-2.5">
          <Pressable
            onPress={onClose}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Cancel editing"
            className="items-center justify-center px-5"
            style={{
              height: 52,
              borderRadius: MISSION_RADIUS.field,
              borderWidth: 1,
              borderColor: palette.border,
              opacity: saving ? 0.5 : 1,
            }}
          >
            <Text className="text-[14.5px] font-semibold" style={{ color: palette.body }}>
              Cancel
            </Text>
          </Pressable>

          <View className="min-w-0 flex-1">
            <MissionSubmitButton
              label="Save changes"
              loadingLabel="Saving changes…"
              onPress={onSave}
              saving={saving}
              disabled={!isValid}
            />
          </View>
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

export default EditMissionScheduleModal;
