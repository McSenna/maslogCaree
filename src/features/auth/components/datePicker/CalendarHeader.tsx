import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { REG_COLORS } from "../../registration/registrationTheme";
import { monthLabel } from "./calendarMonth";

type CalendarHeaderProps = {
  year: number;
  monthIndex: number;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpenYears: () => void;
  yearsOpen: boolean;
};

const NavButton = ({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: "chevron-left" | "chevron-right";
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    onPress={onPress}
    disabled={disabled}
    hitSlop={6}
    style={{
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: REG_COLORS.border,
      backgroundColor: REG_COLORS.surface,
      opacity: disabled ? 0.4 : 1,
    }}
  >
    <Feather name={icon} size={18} color={REG_COLORS.text} />
  </Pressable>
);

const CalendarHeader = ({
  year,
  monthIndex,
  canGoForward,
  onPrevious,
  onNext,
  onOpenYears,
  yearsOpen,
}: CalendarHeaderProps) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
    <NavButton icon="chevron-left" label="Previous month" onPress={onPrevious} />

    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${monthLabel(year, monthIndex)}. Change year`}
      accessibilityState={{ expanded: yearsOpen }}
      onPress={onOpenYears}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        height: 38,
        borderRadius: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "800", color: REG_COLORS.text }}>
        {monthLabel(year, monthIndex)}
      </Text>
      <Feather
        name={yearsOpen ? "chevron-up" : "chevron-down"}
        size={16}
        color={REG_COLORS.muted}
      />
    </Pressable>

    <NavButton
      icon="chevron-right"
      label="Next month"
      disabled={!canGoForward}
      onPress={onNext}
    />
  </View>
);

export default CalendarHeader;
