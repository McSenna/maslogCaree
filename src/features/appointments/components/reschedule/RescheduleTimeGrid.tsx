import { Pressable, Text, View } from "react-native";

import { EmptyNote } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import { formatSlotTime } from "./rescheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  slots: string[];
  selected: string | null;
  onSelect: (slotStart: string) => void;
};

export const RescheduleTimeGrid = ({ palette, slots, selected, onSelect }: Props) => {
  if (!slots.length) {
    return (
      <EmptyNote palette={palette} message="All time slots for this date are taken." />
    );
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {slots.map((slotIso) => {
        const isSelected = selected === slotIso;
        const label = formatSlotTime(slotIso);

        return (
          <Pressable
            key={slotIso}
            onPress={() => onSelect(slotIso)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={label}
            style={{
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: 14,
              borderRadius: 8,
              backgroundColor: isSelected ? palette.accent : palette.card,
              borderColor: isSelected ? palette.accent : palette.border,
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isSelected ? "700" : "500",
                color: isSelected ? "#FFFFFF" : palette.body,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RescheduleTimeGrid;
