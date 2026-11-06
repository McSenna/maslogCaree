import { Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { dayAccessibilityLabel, type CalendarCell } from "../../regularSchedule/scheduleRules";

type DayCell = Extract<CalendarCell, { kind: "day" }>;

type Props = {
  palette: ResidentDialogPalette;
  cell: DayCell;
  isSelected: boolean;
  isToday: boolean;
  onSelect: (dateKey: string) => void;
};

const WEB_ACTIVE = webStyle({ cursor: "pointer", transition: "background-color 150ms ease-out" });
const WEB_INACTIVE = webStyle({ cursor: "not-allowed" });

const colorsFor = (palette: ResidentDialogPalette, cell: DayCell, isSelected: boolean, highlighted: boolean) => {
  if (isSelected) return { background: palette.accent, text: palette.onAccent, dot: palette.onAccent };
  if (!cell.selectable) return { background: "transparent", text: palette.muted, dot: "transparent" };
  return { background: highlighted ? palette.accentSoft : "transparent", text: palette.heading, dot: palette.successFg };
};

/**
 * One date. Open dates are bold with a dot under the number; full, closed and
 * past dates are muted and cannot be chosen. The spoken label carries the full
 * state, so no status depends on colour.
 */
export const CalendarDayCell = ({ palette, cell, isSelected, isToday, onSelect }: Props) => {
  const { hovered, focused, pressed, handlers } = useInteractionState({ disabled: !cell.selectable });
  const colors = colorsFor(palette, cell, isSelected, hovered || pressed);

  return (
    <View className="w-[14.2857%] p-0.5">
      <Pressable
        {...handlers}
        onPress={() => onSelect(cell.dateKey)}
        disabled={!cell.selectable}
        accessibilityRole="button"
        accessibilityLabel={dayAccessibilityLabel(cell, isSelected, isToday)}
        accessibilityState={{ selected: isSelected, disabled: !cell.selectable }}
        aria-pressed={isSelected}
        className="min-h-11 items-center justify-center gap-0.5 rounded-lg border"
        style={[
          { backgroundColor: colors.background, borderColor: isToday && !isSelected ? palette.accent : "transparent" },
          focused ? focusRing(palette.accent, 0) : null,
          cell.selectable ? WEB_ACTIVE : WEB_INACTIVE,
        ]}
      >
        <Text
          style={[
            TYPE.label,
            {
              color: colors.text,
              fontWeight: cell.selectable || isSelected ? "700" : "400",
              textDecorationLine: cell.status === "full" ? "line-through" : "none",
            },
          ]}
        >
          {cell.day}
        </Text>
        <View className="h-1 w-1 rounded-full" style={{ backgroundColor: colors.dot }} />
      </Pressable>
    </View>
  );
};

export default CalendarDayCell;
