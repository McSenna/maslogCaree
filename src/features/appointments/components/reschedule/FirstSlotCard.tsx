import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { EmptyNote } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import { formatSlotTime } from "./rescheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  serviceLabel: string;
  slotStart: string | null;
  isCurrentSlot: boolean;
  /** Replaces the reschedule wording, for example on a new booking. */
  explanation?: string;
  label?: string;
};

/**
 * Stands in for the time picker when the server assigns the time: shows the
 * first open start of the chosen date. The server sets the real time on save.
 */
export const FirstSlotCard = ({ palette, serviceLabel, slotStart, isCurrentSlot, explanation: custom, label = "Your time" }: Props) => {
  if (!slotStart) {
    return <EmptyNote palette={palette} message="No times are open on this date. Pick another date." />;
  }

  const time = formatSlotTime(slotStart);
  const explanation = isCurrentSlot
    ? "This is already your time on this date. Pick another date to move."
    : custom ?? `Rescheduled ${serviceLabel.toLowerCase()} visits get the first open time on the date you pick.`;

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${time}. ${explanation}`}
      className="flex-row items-center gap-3 rounded-md border p-3"
      style={{ backgroundColor: palette.accentSoft, borderColor: palette.accent }}
    >
      <Feather name="clock" size={18} color={palette.accent} />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text style={[TYPE.title, { color: palette.heading }]}>{time}</Text>
        <Text style={[TYPE.caption, { color: palette.body }]}>{explanation}</Text>
      </View>
    </View>
  );
};

export default FirstSlotCard;
