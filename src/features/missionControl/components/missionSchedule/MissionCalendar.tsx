import { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";
import { fromIsoDateKey, toIsoDateKey } from "../../utils/dateTime";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CELL_HEIGHT = 46;

const buildGrid = (month: Date): (number | null)[] => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();

  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const MissionCalendar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) => {
  const palette = useMissionSchedulePalette();
  const selected = useMemo(() => fromIsoDateKey(value), [value]);
  const [month, setMonth] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1)
  );

  const shownMonthKey = `${month.getFullYear()}-${month.getMonth()}`;
  const valueMonthKey = `${selected.getFullYear()}-${selected.getMonth()}`;
  const [lastValueMonth, setLastValueMonth] = useState(valueMonthKey);

  // Follow the selected date to its month when the value changes from outside.
  if (valueMonthKey !== lastValueMonth) {
    setLastValueMonth(valueMonthKey);
    if (valueMonthKey !== shownMonthKey) {
      setMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }

  const todayKey = toIsoDateKey(new Date());
  const cells = useMemo(() => buildGrid(month), [month]);

  const shiftMonth = (delta: number) =>
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const arrow = (direction: "chevron-left" | "chevron-right", delta: number, label: string) => (
    <Pressable
      onPress={() => shiftMonth(delta)}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
      style={{
        backgroundColor: palette.subtle,
        ...Platform.select({ web: { cursor: "pointer" } as object }),
      }}
    >
      <Feather name={direction} size={17} color={palette.body} />
    </Pressable>
  );

  return (
    <View className="w-full">
      <View className="mb-2 flex-row items-center justify-between">
        {arrow("chevron-left", -1, "Previous month")}
        <Text
          accessibilityLiveRegion="polite"
          className="text-[14.5px] font-bold"
          style={{ color: palette.heading }}
        >
          {monthLabel}
        </Text>
        {arrow("chevron-right", 1, "Next month")}
      </View>

      <View className="flex-row">
        {WEEKDAYS.map((weekday) => (
          <View key={weekday} className="flex-1 items-center py-1.5">
            <Text className="text-[11px] font-semibold" style={{ color: palette.faint }}>
              {weekday}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={`blank-${index}`} style={{ width: `${100 / 7}%`, height: CELL_HEIGHT }} />;
          }

          const key = toIsoDateKey(new Date(month.getFullYear(), month.getMonth(), day));
          const isSelected = key === value;
          const isToday = key === todayKey;

          return (
            <View key={key} style={{ width: `${100 / 7}%`, height: CELL_HEIGHT }} className="p-0.5">
              <Pressable
                onPress={() => onChange(key)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                hitSlop={2}
                accessibilityLabel={new Date(
                  month.getFullYear(),
                  month.getMonth(),
                  day
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                className="flex-1 items-center justify-center active:opacity-70"
                style={{
                  borderRadius: MISSION_RADIUS.control - 2,
                  backgroundColor: isSelected ? palette.primary : "transparent",
                  borderWidth: isToday && !isSelected ? 1 : 0,
                  borderColor: palette.primary,
                  ...Platform.select({ web: { cursor: "pointer" } as object }),
                }}
              >
                <Text
                  className={`text-[14px] tabular-nums ${isSelected || isToday ? "font-bold" : "font-medium"}`}
                  style={{
                    color: isSelected ? "#FFFFFF" : isToday ? palette.primary : palette.body,
                  }}
                >
                  {day}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MissionCalendar;
