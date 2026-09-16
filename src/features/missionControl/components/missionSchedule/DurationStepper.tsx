import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";

type DurationStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (minutes: number) => void;
  disabled?: boolean;
  label: string;
};

const STEP_MINUTES = 5;

const STEP_SIZE = 32;

const DurationStepper = ({
  value,
  min,
  max,
  onChange,
  disabled = false,
  label,
}: DurationStepperProps) => {
  const palette = useMissionSchedulePalette();

  const atMin = value <= min;
  const atMax = value >= max;

  const button = (direction: "minus" | "plus") => {
    const isMinus = direction === "minus";
    const isOff = disabled || (isMinus ? atMin : atMax);

    return (
      <Pressable
        onPress={() =>
          onChange(
            isMinus
              ? Math.max(min, value - STEP_MINUTES)
              : Math.min(max, value + STEP_MINUTES)
          )
        }
        disabled={isOff}
        accessibilityRole="button"
        accessibilityLabel={`${isMinus ? "Decrease" : "Increase"} ${label} duration`}
        accessibilityState={{ disabled: isOff }}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        className="items-center justify-center"
        style={{
          width: STEP_SIZE,
          height: STEP_SIZE,
          borderRadius: MISSION_RADIUS.control - 4,
          backgroundColor: palette.surface,
          opacity: isOff ? 0.4 : 1,
        }}
      >
        <Feather name={direction} size={15} color={palette.primary} />
      </Pressable>
    );
  };

  return (
    <View className="items-center gap-1">
      <Text className="text-[11px] font-medium" style={{ color: palette.muted }}>
        Duration (minutes)
      </Text>

      <View
        className="flex-row items-center gap-1 p-1"
        style={{
          borderRadius: MISSION_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.subtle,
          opacity: disabled ? 0.55 : 1,
        }}
      >
        {button("minus")}
        <Text
          accessibilityLabel={`${label} duration: ${value} minutes`}
          className="text-center text-[15px] font-bold tabular-nums"
          style={{ color: palette.heading, minWidth: 34 }}
        >
          {value}
        </Text>
        {button("plus")}
      </View>

      <Text className="text-[11px]" style={{ color: palette.faint }}>
        {min}–{max} min
      </Text>
    </View>
  );
};

export default DurationStepper;
