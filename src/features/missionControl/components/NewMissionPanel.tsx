import { Pressable, Text, View } from "react-native";
import type { ConsultationCategory } from "@/services/appointments";
import type { MissionForm, MissionFormField } from "../hooks/useMissionForm";
import MissionCategoryList from "./MissionCategoryList";
import MissionDateTimeFields from "./MissionDateTimeFields";

type NewMissionPanelProps = {
  form: MissionForm;
  categories: ConsultationCategory[];
  saving: boolean;
  onOpenPicker: (field: MissionFormField) => void;
  onCreate: () => void;
};

/** Creating a mission schedule: the day, the hours, and the services it runs. */
export default function NewMissionPanel({
  form,
  categories,
  saving,
  onOpenPicker,
  onCreate,
}: NewMissionPanelProps) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">New mission schedule</Text>
      <Text className="mb-3 text-xs text-slate-500">
        Pick a mission date, choose a time range, then select categories.
      </Text>

      <MissionDateTimeFields values={form.values} onOpenPicker={onOpenPicker} />

      <Text className="mb-2 mt-4 text-xs font-semibold text-slate-600">
        Categories on this mission
      </Text>
      <MissionCategoryList
        categories={categories}
        enabled={form.enabled}
        durations={form.durations}
        onToggle={form.toggleCategory}
        onDurationChange={form.setDuration}
      />

      <Pressable
        onPress={onCreate}
        disabled={saving}
        accessibilityRole="button"
        className="mt-4 items-center rounded-xl bg-mc-primary py-3 active:opacity-90"
      >
        <Text className="font-semibold text-white">
          {saving ? "Saving…" : "Create mission schedule"}
        </Text>
      </Pressable>
    </View>
  );
}
