import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DialogStatus, EmptyNote } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";
import type { RegularOptions } from "@/types/appointments.types";

import { formatClock, formatDateKey } from "../../regularSchedule/scheduleFormat";
import { groupSlots, noSlotsMessage } from "../../regularSchedule/scheduleRules";
import { TimeChip } from "../reschedule/TimeChip";

type Props = {
  palette: ResidentDialogPalette;
  day: NonNullable<RegularOptions["day"]>;
  serviceLabel: string;
  breakText: string | null;
  selected: string | null;
  onSelect: (slotStart: string) => void;
};

const BreakDivider = ({ palette, text }: { palette: ResidentDialogPalette; text: string }) => (
  <View className="flex-row items-center gap-2">
    <View className="h-px flex-1" style={{ backgroundColor: palette.divider }} />
    <Feather name="coffee" size={14} color={palette.muted} />
    <Text style={[TYPE.caption, { color: palette.body }]}>{`Lunch break, ${text}`}</Text>
    <View className="h-px flex-1" style={{ backgroundColor: palette.divider }} />
  </View>
);

/** The open start times of one date, morning then afternoon, with the lunch break between them. */
export const RegularTimeSlots = ({ palette, day, serviceLabel, breakText, selected, onSelect }: Props) => {
  if (!day.slots.length) return <EmptyNote palette={palette} message={noSlotsMessage(day.status, serviceLabel)} />;

  const groups = groupSlots(day.slots);
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Time" className="gap-3">
      <Text style={[TYPE.caption, { color: palette.body }]}>
        {`${day.openSlots === 1 ? "1 open time" : `${day.openSlots} open times`} on ${formatDateKey(day.dateKey, true)}`}
      </Text>
      {groups.map((group, index) => (
        <View key={group.label} className="gap-3">
          {index > 0 && breakText ? <BreakDivider palette={palette} text={breakText} /> : null}
          <View className="gap-2">
            <Text style={[TYPE.label, { color: palette.heading }]}>{group.label}</Text>
            <View className="flex-row flex-wrap gap-2">
              {group.slots.map((slot) => (
                <TimeChip
                  key={slot.start}
                  palette={palette}
                  label={formatClock(slot.time)}
                  accessibilityLabel={`${formatClock(slot.time)}, ${formatDateKey(day.dateKey)}`}
                  selected={selected === slot.start}
                  onPress={() => onSelect(slot.start)}
                />
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

/** Shown while the chosen date's times load, in the same place the times appear. */
export const RegularTimeSlotsLoading = ({ palette }: { palette: ResidentDialogPalette }) => (
  <DialogStatus palette={palette} message="Checking open times..." />
);

export default RegularTimeSlots;
