import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { EmptyNote } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import type { DayChoice } from "./dayChoices";
import { formatScheduleDate } from "./rescheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  options: DayChoice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyMessage?: string;
};

const slotCountLabel = (count: number): string => (count === 1 ? "1 open time" : `${count} open times`);

const SlotCountBadge = ({
  palette,
  count,
}: {
  palette: ResidentDialogPalette;
  count: number;
}) => (
  <View
    style={{
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: count > 0 ? palette.successSoft : palette.card,
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: "600",
        color: count > 0 ? palette.successFg : palette.muted,
      }}
    >
      {count > 0 ? slotCountLabel(count) : "Fully booked"}
    </Text>
  </View>
);

export const RescheduleDateList = ({
  palette,
  options,
  selectedId,
  onSelect,
  emptyMessage = "No upcoming mission schedules are open for this service yet.",
}: Props) => {
  if (!options.length) {
    return <EmptyNote palette={palette} message={emptyMessage} />;
  }

  return (
    <View style={{ gap: 8 }}>
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const count = option.openCount;
        const dateLabel = formatScheduleDate(option.date);

        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            disabled={count === 0}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled: count === 0 }}
            aria-checked={isSelected}
            accessibilityLabel={`${dateLabel}, ${count > 0 ? `${slotCountLabel(count)} available` : "fully booked"}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 12,
              borderRadius: 10,
              backgroundColor: isSelected ? palette.accentSoft : palette.card,
              borderColor: isSelected ? palette.accent : palette.border,
              borderWidth: 1,
              opacity: count > 0 ? 1 : 0.45,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Feather name="calendar" size={16} color={isSelected ? palette.accent : palette.muted} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? palette.accent : palette.heading,
                }}
              >
                {dateLabel}
              </Text>
            </View>

            <SlotCountBadge palette={palette} count={count} />
          </Pressable>
        );
      })}
    </View>
  );
};

export default RescheduleDateList;
