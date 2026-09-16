import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";

type MissionPickerFieldProps = {
  label: string;
  value: string;
  hint?: string;
  icon: "calendar" | "clock";
  onPress: () => void;
  invalid?: boolean;
  className?: string;
};

const MissionPickerField = ({
  label,
  value,
  hint,
  icon,
  onPress,
  invalid = false,
  className,
}: MissionPickerFieldProps) => {
  const palette = useMissionSchedulePalette();

  return (
    <View className={className}>
      <Text className="mb-1.5 text-[13.5px] font-semibold" style={{ color: palette.body }}>
        {label}
      </Text>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}${hint ? `, ${hint}` : ""}`}
        accessibilityHint="Opens a picker"
        className="w-full flex-row items-center gap-3 px-3 active:opacity-85"
        style={{
          minHeight: 62,
          paddingVertical: 10,
          borderRadius: MISSION_RADIUS.field,
          borderWidth: 1,
          borderColor: invalid ? palette.dangerBorder : palette.border,
          backgroundColor: invalid ? palette.dangerSoft : palette.subtle,
        }}
      >
        <View
          className="items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: MISSION_RADIUS.control - 2,
            backgroundColor: palette.primarySoft,
          }}
        >
          <Feather name={icon} size={18} color={palette.primary} />
        </View>

        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[15px] font-bold" style={{ color: palette.heading }}>
            {value}
          </Text>
          {hint ? (
            <Text numberOfLines={1} className="mt-0.5 text-[12px]" style={{ color: palette.muted }}>
              {hint}
            </Text>
          ) : null}
        </View>

        <Feather name="chevron-down" size={18} color={palette.faint} />
      </Pressable>
    </View>
  );
};

export default MissionPickerField;
