import { Pressable, Text, TextInput, View } from "react-native";
import type { ConsultationCategory } from "@/services/appointments";
import { isVariableDuration, resolveDuration, type CategoryDurationMap } from "../utils/missionCategories";

type MissionCategoryRowProps = {
  category: ConsultationCategory;
  enabled: boolean;
  durations: CategoryDurationMap;
  onToggle: (categoryKey: string) => void;
  onDurationChange: (category: ConsultationCategory, minutes: number) => void;
};

/**
 * One service on a mission: whether it runs, and for how long per patient.
 *
 * The duration field appears only for a service whose length the mission
 * chooses. A fixed-length service shows its duration in the label instead —
 * editing it would suggest a choice the catalogue does not offer.
 */
export default function MissionCategoryRow({
  category,
  enabled,
  durations,
  onToggle,
  onDurationChange,
}: MissionCategoryRowProps) {
  const isRange = isVariableDuration(category);
  const shownDuration = resolveDuration(category, durations);

  return (
    <View className="border-b border-slate-100 pb-2 pt-2">
      <Pressable
        onPress={() => onToggle(category.key)}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
        accessibilityLabel={category.label}
        className="flex-row items-center justify-between"
      >
        <Text className="flex-1 pr-2 text-slate-800">
          {category.label}
          {typeof category.durationMinutes === "number" ? ` · ${category.durationMinutes} min` : ""}
          {isRange ? ` · ${shownDuration} min` : ""}
        </Text>
        <Text className="font-bold text-mc-primary">{enabled ? "ON" : "off"}</Text>
      </Pressable>

      {enabled && isRange ? (
        <View className="mt-2">
          <Text className="mb-1 text-[11px] text-slate-500">Duration (minutes)</Text>
          <TextInput
            value={String(shownDuration)}
            onChangeText={(text) => {
              // An empty or half-typed field is left as-is rather than
              // snapped to a bound, so the number stays editable.
              if (text.trim().length === 0) return;
              const minutes = Number(text);
              if (!Number.isFinite(minutes)) return;
              onDurationChange(category, minutes);
            }}
            keyboardType="number-pad"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
          <Text className="mt-1 text-[10px] text-slate-400">
            {category.durationMinutesMin}–{category.durationMinutesMax} min
          </Text>
        </View>
      ) : null}
    </View>
  );
}
