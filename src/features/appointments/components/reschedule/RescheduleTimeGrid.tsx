import { Text, View } from "react-native";

import { EmptyNote } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import { formatSlotTime } from "./rescheduleFormat";
import { TimeChip } from "./TimeChip";

type Props = {
  palette: ResidentDialogPalette;
  slots: string[];
  selected: string | null;
  onSelect: (slotStart: string) => void;
};

// Missions run a morning and an afternoon window, so a long day reads in two
// short groups instead of one wall of times.
const groupByHalfDay = (slots: string[]) => [
  { label: "Morning", slots: slots.filter((iso) => new Date(iso).getHours() < 12) },
  { label: "Afternoon", slots: slots.filter((iso) => new Date(iso).getHours() >= 12) },
];

export const RescheduleTimeGrid = ({ palette, slots, selected, onSelect }: Props) => {
  if (!slots.length) {
    return (
      <EmptyNote palette={palette} message="All time slots for this date are taken." />
    );
  }

  return (
    <View className="gap-3">
      {groupByHalfDay(slots)
        .filter((group) => group.slots.length > 0)
        .map((group) => (
          <View key={group.label} className="gap-2">
            <Text style={[TYPE.caption, { color: palette.muted }]}>{group.label}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {group.slots.map((slotIso) => (
                <TimeChip
                  key={slotIso}
                  palette={palette}
                  label={formatSlotTime(slotIso)}
                  selected={selected === slotIso}
                  onPress={() => onSelect(slotIso)}
                />
              ))}
            </View>
          </View>
        ))}
    </View>
  );
};

export default RescheduleTimeGrid;
