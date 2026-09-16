import { Pressable, Text, View } from "react-native";

import { formatBirthDate } from "../../utils/dateOfBirth";
import { REG_COLORS } from "../../registration/registrationTheme";
import { WEEKDAY_LABELS, buildCalendarCells } from "./calendarMonth";

type CalendarGridProps = {
  year: number;
  monthIndex: number;
  selected: string;
  onSelect: (iso: string) => void;
  cellSize: number;
};

const CalendarGrid = ({ year, monthIndex, selected, onSelect, cellSize }: CalendarGridProps) => {
  const cells = buildCalendarCells(year, monthIndex);

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row" }}>
        {WEEKDAY_LABELS.map((label) => (
          <Text
            key={label}
            style={{
              width: `${100 / 7}%`,
              textAlign: "center",
              fontSize: 11.5,
              fontWeight: "700",
              color: REG_COLORS.subtle,
            }}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((cell) => {
          if (!cell.day || !cell.iso) {
            return <View key={cell.key} style={{ width: `${100 / 7}%`, height: cellSize }} />;
          }

          const isSelected = selected === cell.iso;

          return (
            <View key={cell.key} style={{ width: `${100 / 7}%`, height: cellSize, padding: 2 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={formatBirthDate(cell.iso)}
                accessibilityState={{ selected: isSelected, disabled: cell.disabled }}
                onPress={() => onSelect(cell.iso as string)}
                disabled={cell.disabled}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  backgroundColor: isSelected ? REG_COLORS.primary : "transparent",
                  opacity: cell.disabled ? 0.32 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: isSelected ? "800" : "500",
                    color: isSelected ? "#FFFFFF" : REG_COLORS.text,
                  }}
                >
                  {cell.day}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarGrid;
