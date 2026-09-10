import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import type { ConsultationCategory } from "@/services/appointments";
import type { MissionForm, MissionFormField } from "../hooks/useMissionForm";
import MissionCategoryList from "./MissionCategoryList";
import MissionDateTimeFields from "./MissionDateTimeFields";

type EditMissionModalProps = {
  visible: boolean;
  form: MissionForm;
  categories: ConsultationCategory[];
  saving: boolean;
  onOpenPicker: (field: MissionFormField) => void;
  onClose: () => void;
  onSave: () => void;
};

/**
 * Editing an existing schedule.
 *
 * The same fields as the create panel, over a form seeded from the saved
 * mission. Closing also dismisses the shared picker, which would otherwise
 * outlive the sheet that opened it.
 */
export default function EditMissionModal({
  visible,
  form,
  categories,
  saving,
  onOpenPicker,
  onClose,
  onSave,
}: EditMissionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[85%] rounded-t-3xl bg-white p-4">
          <Text className="text-lg font-bold text-slate-900">Edit schedule</Text>
          <Text className="text-sm text-slate-600">
            Update date, time range, and categories.
          </Text>

          <ScrollView className="mt-3">
            <MissionDateTimeFields values={form.values} onOpenPicker={onOpenPicker} />

            <Text className="mb-2 mt-5 text-xs font-semibold text-slate-600">Categories</Text>
            <MissionCategoryList
              categories={categories}
              enabled={form.enabled}
              durations={form.durations}
              onToggle={form.toggleCategory}
              onDurationChange={form.setDuration}
            />
          </ScrollView>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              className="flex-1 items-center rounded-xl border border-slate-300 py-3"
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onSave}
              disabled={saving}
              accessibilityRole="button"
              className="flex-1 items-center rounded-xl bg-mc-primary py-3"
            >
              <Text className="font-semibold text-white">
                {saving ? "Saving…" : "Save changes"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
