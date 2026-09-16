import { useEffect, useMemo, useRef } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { MISSION_RADIUS, useMissionSchedulePalette } from "../missionScheduleTheme";

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 4;

type ColumnProps<T> = {
  label: string;
  options: T[];
  value: T;
  onChange: (next: T) => void;
  render: (option: T) => string;
  flex?: number;
};

const WheelColumn = <T extends string | number,>({
  label,
  options,
  value,
  onChange,
  render,
  flex = 1,
}: ColumnProps<T>) => {
  const palette = useMissionSchedulePalette();
  const scrollRef = useRef<ScrollView>(null);

  const selectedIndex = useMemo(() => options.indexOf(value), [options, value]);

  useEffect(() => {
    if (selectedIndex < 0) return;
    const offset = Math.max(0, (selectedIndex - 1) * ROW_HEIGHT);
    const timer = setTimeout(() => scrollRef.current?.scrollTo({ y: offset, animated: false }), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex }}>
      <Text className="mb-1.5 text-center text-[11px] font-medium" style={{ color: palette.muted }}>
        {label}
      </Text>
      <View
        style={{
          height: ROW_HEIGHT * VISIBLE_ROWS,
          borderRadius: MISSION_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.subtle,
          overflow: "hidden",
        }}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <Pressable
                key={String(option)}
                onPress={() => onChange(option)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${render(option)} ${label.toLowerCase()}`}
                className="mx-1.5 items-center justify-center"
                style={{
                  height: ROW_HEIGHT - 4,
                  borderRadius: MISSION_RADIUS.control - 4,
                  backgroundColor: isSelected ? palette.primary : "transparent",
                  ...Platform.select({ web: { cursor: "pointer" } as object }),
                }}
              >
                <Text
                  className={`text-[16px] tabular-nums ${isSelected ? "font-bold" : "font-medium"}`}
                  style={{ color: isSelected ? "#FFFFFF" : palette.body }}
                >
                  {render(option)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default WheelColumn;
