import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import { focusRing } from "@/components/data-table/focusRing";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useResponsive } from "@/hooks/useResponsive";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { clockFromParts, clockParts, formatClock, isClock, nudgeClock, toClock } from "./clockFormat";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const PERIODS = ["AM", "PM"] as const;
const WEB = webStyle({ cursor: "pointer" });
const twoDigits = (value: number) => String(value).padStart(2, "0");
// Six 44px cells need 284px, so the narrowest phones get an even four columns instead.
const SIX_COLUMNS_FROM = 360;

type CellProps = { label: string; spoken: string; selected?: boolean; onPress: () => void; wide?: boolean; narrow?: boolean };

// A button with aria-pressed, because React Native Web's radios ignore the Space key.
const TimeCell = ({ label, spoken, selected = false, onPress, wide = false, narrow = false }: CellProps) => {
  const palette = useResidentDialogPalette();
  const { hovered, focused, handlers } = useInteractionState();
  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={spoken}
      accessibilityState={{ selected }}
      aria-pressed={selected}
      style={[
        wide ? styles.wideCell : styles.cell,
        narrow ? styles.fourColumns : null,
        { borderColor: selected ? palette.accent : palette.border, backgroundColor: selected ? palette.accent : hovered ? palette.accentSoft : palette.cardRaised },
        focused ? focusRing(palette.accent, 2) : null,
        WEB,
      ]}
    >
      <Text style={[styles.cellText, { color: selected ? palette.onAccent : palette.heading }]}>{label}</Text>
    </Pressable>
  );
};

type Props = {
  title: string;
  confirmLabel: string;
  value: string;
  onConfirm: (clock: string) => void;
  onClose: () => void;
};

/** Mounted per opening. Nothing reaches the form until Confirm, like the date picker. */
const TimePickerDialog = ({ title, confirmLabel, value, onConfirm, onClose }: Props) => {
  const palette = useResidentDialogPalette();
  const [draft, setDraft] = useState(() => (isClock(value) ? value : toClock(new Date())));
  const parts = clockParts(draft);
  const update = (change: Partial<typeof parts>) => setDraft(clockFromParts({ ...parts, ...change }));
  const heading = [styles.group, { color: palette.body }];
  const narrow = useResponsive().width < SIX_COLUMNS_FROM;

  return (
    <ResponsiveDialog
      visible
      title={title}
      icon="clock"
      onClose={onClose}
      maxWidth={420}
      footer={
        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" accessibilityLabel="Cancel time selection" onPress={onClose} fullWidth style={styles.action} />
          <Button label="Confirm" accessibilityLabel={confirmLabel} onPress={() => { onConfirm(draft); onClose(); }} fullWidth style={styles.action} />
        </View>
      }
    >
      <View style={styles.body}>
        <View style={styles.readout}>
          <Text accessibilityLiveRegion="polite" style={[styles.time, { color: palette.heading }]}>{formatClock(draft)}</Text>
          <View style={styles.periods}>
            {PERIODS.map((period) => (
              <TimeCell key={period} label={period} spoken={period} selected={parts.period === period} onPress={() => update({ period })} />
            ))}
          </View>
        </View>
        <Text accessibilityRole="header" style={heading}>Hour</Text>
        <View style={styles.grid}>
          {HOURS.map((hour) => (
            <TimeCell key={hour} label={String(hour)} spoken={`Hour ${hour}`} narrow={narrow} selected={parts.hour === hour} onPress={() => update({ hour })} />
          ))}
        </View>
        <Text accessibilityRole="header" style={heading}>Minute</Text>
        <View style={styles.grid}>
          {MINUTES.map((minute) => (
            <TimeCell key={minute} label={twoDigits(minute)} spoken={`Minute ${minute}`} narrow={narrow} selected={parts.minute === minute} onPress={() => update({ minute })} />
          ))}
        </View>
        <View style={styles.nudges}>
          <TimeCell wide label="- 1 min" spoken="Subtract one minute" onPress={() => setDraft(nudgeClock(draft, -1))} />
          <TimeCell wide label="+ 1 min" spoken="Add one minute" onPress={() => setDraft(nudgeClock(draft, 1))} />
        </View>
      </View>
    </ResponsiveDialog>
  );
};

const styles = StyleSheet.create({
  body: { gap: SPACING.sm },
  readout: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm, paddingBottom: SPACING.xs },
  time: { ...TYPE.headline, fontVariant: ["tabular-nums"] },
  periods: { flexDirection: "row", gap: SPACING.xs, width: 120 },
  group: { ...TYPE.label },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  cell: { flexGrow: 1, flexBasis: "14%", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: RADII.small },
  fourColumns: { flexBasis: "22%" },
  wideCell: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: RADII.small },
  cellText: { ...TYPE.bodyStrong, fontVariant: ["tabular-nums"] },
  nudges: { flexDirection: "row", gap: SPACING.xs },
  actions: { flexDirection: "row", gap: SPACING.sm },
  action: { flexGrow: 1, flexBasis: 0 },
});

export default TimePickerDialog;
