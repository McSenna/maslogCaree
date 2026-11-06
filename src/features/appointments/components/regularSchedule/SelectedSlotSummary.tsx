import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";
import type { RegularSlot } from "@/types/appointments.types";

import { formatClock, formatDateKey, slotEndTime } from "../../regularSchedule/scheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  serviceLabel: string;
  dateKey: string;
  slot: RegularSlot;
  /** The line above the date; a reschedule says it is the new time. */
  caption?: string;
};

/** The chosen date and time, stated once more right before the resident confirms. */
export const SelectedSlotSummary = ({ palette, serviceLabel, dateKey, slot, caption = `You are booking ${serviceLabel}` }: Props) => (
  <View
    accessibilityRole="summary"
    accessibilityLabel={`${caption}: ${formatDateKey(dateKey)} at ${formatClock(slot.time)}`}
    className="flex-row items-start gap-3 rounded-lg border p-3"
    style={{ backgroundColor: palette.cardRaised, borderColor: palette.accent }}
  >
    <View className="pt-0.5">
      <Feather name="calendar" size={18} color={palette.accent} />
    </View>
    <View className="min-w-0 flex-1 gap-1">
      <Text style={[TYPE.caption, { color: palette.body }]}>{caption}</Text>
      <Text style={[TYPE.bodyStrong, { color: palette.heading }]}>{formatDateKey(dateKey)}</Text>
      <Text style={[TYPE.body, { color: palette.heading }]}>
        {`${formatClock(slot.time)} to ${formatClock(slotEndTime(slot))}`}
      </Text>
    </View>
  </View>
);

export default SelectedSlotSummary;
