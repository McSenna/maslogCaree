import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { EmptyNote, InlineError } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { breakTextOn } from "../../regularSchedule/scheduleFormat";
import type { RegularSchedulePicker } from "../../regularSchedule/useRegularSchedule";
import { RegularTimeSlots, RegularTimeSlotsLoading } from "./RegularTimeSlots";

const WEB = webStyle({ cursor: "pointer" });

type ActionProps = { palette: ResidentDialogPalette; icon: keyof typeof Feather.glyphMap; label: string; accessibilityLabel: string; onPress: () => void };

const OutlineAction = ({ palette, icon, label, accessibilityLabel, onPress }: ActionProps) => {
  const { hovered, focused, handlers } = useInteractionState();
  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="min-h-11 flex-row items-center justify-center gap-2 self-center rounded-lg border px-4"
      style={[{ borderColor: palette.accent, backgroundColor: hovered ? palette.accentSoft : palette.cardRaised }, focused ? focusRing(palette.accent) : null, WEB]}
    >
      <Feather name={icon} size={15} color={palette.accent} />
      <Text style={[TYPE.label, { color: palette.accent }]}>{label}</Text>
    </Pressable>
  );
};

/** A failed load, with a way to try again. */
export const PickerLoadError = ({ palette, picker }: { palette: ResidentDialogPalette; picker: RegularSchedulePicker }) => (
  <View className="gap-3">
    <InlineError palette={palette} message={picker.error ?? ""} />
    <OutlineAction palette={palette} icon="refresh-cw" label="Try again" accessibilityLabel="Try loading the open dates and times again" onPress={picker.retry} />
  </View>
);

type Props = {
  palette: ResidentDialogPalette;
  serviceLabel: string;
  picker: RegularSchedulePicker;
  onPicked: (slotStart: string) => void;
  /** Goes back to the calendar, for a date that turned out full. */
  onChangeDate: () => void;
};

/** The body of the time picker: loading, a failed load, an empty date, or the open times. */
const TimeBody = ({ palette, serviceLabel, picker, onPicked }: Omit<Props, "onChangeDate">) => {
  if (picker.error) return <PickerLoadError palette={palette} picker={picker} />;
  if (picker.dayLoading) return <RegularTimeSlotsLoading palette={palette} />;
  if (!picker.day || !picker.schedule) {
    return <EmptyNote palette={palette} message="Choose an open date first. Dates with a dot have open times." />;
  }
  return (
    <RegularTimeSlots
      palette={palette}
      day={picker.day}
      serviceLabel={serviceLabel}
      breakText={breakTextOn(picker.schedule, picker.day.dateKey)}
      selected={picker.slotStart}
      onSelect={onPicked}
    />
  );
};

export const RegularTimeArea = ({ onChangeDate, ...props }: Props) => (
  <View className="gap-4">
    <TimeBody {...props} />
    <OutlineAction palette={props.palette} icon="calendar" label="Choose another date" accessibilityLabel="Choose another date" onPress={onChangeDate} />
  </View>
);

export default RegularTimeArea;
