import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { ConsultationCategory } from "@/services/appointments";
import { serviceDayNames } from "@/utils/serviceDays";
import {
  isCategoryOffered,
  isCategoryOnDate,
  type CategoryDurationMap,
  type CategoryEnabledMap,
} from "../../utils/missionCategories";
import MissionCategoryCard from "./MissionCategoryCard";
import { useMissionSchedulePalette } from "./missionScheduleTheme";

type MissionCategorySectionProps = {
  categories: ConsultationCategory[];
  dateKey: string;
  enabled: CategoryEnabledMap;
  durations: CategoryDurationMap;
  onToggle: (categoryKey: string) => void;
  onDurationChange: (category: ConsultationCategory, minutes: number) => void;
  compact?: boolean;
  error?: string | null;
};

const offDayNote = (category: ConsultationCategory, dateKey: string): string | null => {
  if (isCategoryOnDate(category, dateKey)) return null;
  const days = serviceDayNames(category.key);
  return `Runs every ${days} only. Choose a ${days} to add it.`;
};

const MissionCategorySection = ({
  categories,
  dateKey,
  enabled,
  durations,
  onToggle,
  onDurationChange,
  compact = false,
  error,
}: MissionCategorySectionProps) => {
  const palette = useMissionSchedulePalette();
  const selectedCount = categories.filter((category) =>
    isCategoryOffered(category, enabled, dateKey)
  ).length;

  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center gap-2">
        <Feather name="grid" size={15} color={palette.primary} />
        <Text className="min-w-0 flex-1 text-[15px] font-bold" style={{ color: palette.heading }}>
          Categories on this mission
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          className="text-[12.5px] font-medium"
          style={{ color: error ? palette.danger : palette.muted }}
        >
          {selectedCount} {selectedCount === 1 ? "service" : "services"} selected
        </Text>
      </View>

      <View className="w-full gap-2.5">
        {categories.map((category) => (
          <MissionCategoryCard
            key={category.key}
            category={category}
            enabled={Boolean(enabled[category.key])}
            durations={durations}
            onToggle={onToggle}
            onDurationChange={onDurationChange}
            compact={compact}
            offDayNote={offDayNote(category, dateKey)}
          />
        ))}
      </View>

      {error ? (
        <Text className="text-[12.5px] font-medium" style={{ color: palette.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default MissionCategorySection;
