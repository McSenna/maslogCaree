import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { ConsultationCategory } from "@/services/appointments";
import {
  isVariableDuration,
  resolveDuration,
  type CategoryDurationMap,
} from "../../utils/missionCategories";
import DurationStepper from "./DurationStepper";
import ServiceToggle from "./ServiceToggle";
import {
  CATEGORY_ICONS,
  FALLBACK_CATEGORY_ICON,
  MISSION_RADIUS,
  useMissionSchedulePalette,
} from "./missionScheduleTheme";

type MissionCategoryCardProps = {
  category: ConsultationCategory;
  enabled: boolean;
  durations: CategoryDurationMap;
  onToggle: (categoryKey: string) => void;
  onDurationChange: (category: ConsultationCategory, minutes: number) => void;
  compact?: boolean;
};

const MissionCategoryCard = ({
  category,
  enabled,
  durations,
  onToggle,
  onDurationChange,
  compact = false,
}: MissionCategoryCardProps) => {
  const palette = useMissionSchedulePalette();
  const tone = enabled ? palette.toneFor(category.key) : palette.neutralTone;

  const variable = isVariableDuration(category);
  const duration = resolveDuration(category, durations);

  const durationControl = variable ? (
    <DurationStepper
      value={duration}
      min={category.durationMinutesMin ?? duration}
      max={category.durationMinutesMax ?? duration}
      onChange={(minutes) => onDurationChange(category, minutes)}
      disabled={!enabled}
      label={category.label}
    />
  ) : (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${category.label} duration: ${duration} minutes, fixed`}
      className="px-4 py-2.5"
      style={{
        borderRadius: MISSION_RADIUS.pill,
        backgroundColor: palette.subtle,
        borderWidth: 1,
        borderColor: palette.border,
        opacity: enabled ? 1 : 0.6,
      }}
    >
      <Text className="text-[13.5px] font-semibold tabular-nums" style={{ color: palette.body }}>
        {duration} min
      </Text>
    </View>
  );

  return (
    <View
      className={`w-full ${compact ? "gap-3" : "flex-row items-center gap-4"} p-3.5`}
      style={{
        borderRadius: MISSION_RADIUS.card,
        borderWidth: 1,
        borderColor: palette.border,
        backgroundColor: enabled ? palette.surface : palette.subtle,
      }}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <View
          className="items-center justify-center"
          style={{ width: 46, height: 46, borderRadius: MISSION_RADIUS.control, backgroundColor: tone.bg }}
        >
          <MaterialCommunityIcons
            name={CATEGORY_ICONS[category.key] ?? FALLBACK_CATEGORY_ICON}
            size={22}
            color={tone.fg}
          />
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <Text
            numberOfLines={1}
            className="text-[15px] font-bold"
            style={{ color: enabled ? palette.heading : palette.body }}
          >
            {category.label}
          </Text>
          {category.description ? (
            <Text numberOfLines={compact ? 2 : 1} className="text-[12.5px]" style={{ color: palette.muted }}>
              {category.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View className={compact ? "flex-row items-center justify-between gap-3" : "flex-row items-center gap-4"}>
        {durationControl}
        <ServiceToggle
          value={enabled}
          onChange={() => onToggle(category.key)}
          label={`${category.label} on this mission`}
        />
      </View>
    </View>
  );
};

export default MissionCategoryCard;
