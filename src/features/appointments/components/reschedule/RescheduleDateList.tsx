import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { EmptyNote } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { RescheduleOptionSchedule } from "@/types/appointments.types";

import { formatScheduleDate } from "./rescheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  schedules: RescheduleOptionSchedule[];
  selectedId: string | null;
  onSelect: (missionScheduleId: string) => void;
};

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
      {count > 0 ? `${count} slots` : "Fully booked"}
    </Text>
  </View>
);

export const RescheduleDateList = ({ palette, schedules, selectedId, onSelect }: Props) => {
  if (!schedules.length) {
    return (
      <EmptyNote
        palette={palette}
        message="No upcoming mission schedules are open for this service yet."
      />
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {schedules.map((schedule) => {
        const isSelected = selectedId === schedule.missionScheduleId;
        const count = schedule.availableSlotStarts.length;
        const dateLabel = formatScheduleDate(schedule.date);

        return (
          <Pressable
            key={schedule.missionScheduleId}
            onPress={() => onSelect(schedule.missionScheduleId)}
            disabled={count === 0}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected, disabled: count === 0 }}
            accessibilityLabel={`${dateLabel}, ${count > 0 ? `${count} slots available` : "fully booked"}`}
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
