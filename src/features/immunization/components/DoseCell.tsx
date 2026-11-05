import { formatCalendarDay } from "@/features/medicalRecordMasterlist/masterlistLabels";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { savedDoseStatus } from "../savedDosePresentation";
import { isAdministered } from "../immunizationLogic";
import type { DoseView } from "../types";
import useImmunizationStyles from "./immunizationStyles";

type Props = {
  dose: DoseView;
  vaccine: string;
  age: string;
  readOnly: boolean;
  disabled?: boolean;
  centered?: boolean;
  /** Off where stored values must not appear beside a dose that was not given. */
  hoverPreview?: boolean;
  onSelect: (dose: DoseView) => void;
};
export default function DoseCell({
  dose,
  vaccine,
  age,
  readOnly,
  disabled = false,
  centered = false,
  hoverPreview = true,
  onSelect,
}: Props) {
  const { colors, styles } = useImmunizationStyles();
  const completed = isAdministered(dose.record);
  const inspectable = !!dose.record;
  const openable = !readOnly || inspectable;
  const interactive = !disabled && openable;
  const interaction = useInteractionState({ disabled: !interactive });
  // A saved dose says what its record says, so a voided dose never reads differently from its details.
  const statusText = dose.record ? savedDoseStatus(dose.record) : dose.status;
  const label = `${vaccine}, ${dose.label}, ${age}, ${statusText}. ${inspectable ? "View vaccination details" : "Open administration form"}`;
  const content = (
    <>
      <View style={[styles.doseRow, centered && { justifyContent: "center" }]}>
        <Feather
          name={completed ? "check-square" : "square"}
          size={18}
          color={completed ? colors.success.fg : colors.body}
        />
        <Text
          style={[styles.strong, centered && { textAlign: "center" }, completed && { color: colors.success.fg }]}
        >
          {dose.label}
        </Text>
      </View>
      <Text style={[styles.muted, centered && { textAlign: "center" }, completed && { color: colors.success.fg }]}>
        {statusText}
      </Text>
      {completed ? (
        <Text style={[styles.muted, centered && { textAlign: "center" }, { color: colors.success.fg }]}>
          {formatCalendarDay(dose.record?.administeredOn)}
        </Text>
      ) : null}
    </>
  );
  const style = [styles.check, completed && styles.checked];
  // Being busy only disables the control. Swapping it for a View would destroy the
  // node, and a closing dose modal would have nothing to return focus to.
  if (!openable)
    return (
      <View accessibilityLabel={label} style={style}>
        {content}
      </View>
    );
  return (
    <Pressable
      {...interaction.handlers}
      onPress={() => onSelect(dose)}
      disabled={!interactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={
        inspectable
          ? "View saved details. Editing requires a separate action."
          : `Routine target ${dose.targetOn ? formatCalendarDay(dose.targetOn) : "not set"}.`
      }
      style={[
        ...style,
        (interaction.hovered || interaction.pressed) && {
          backgroundColor: colors.rowHover,
        },
        {
          outlineWidth: interaction.focused ? 2 : 0,
          outlineColor: colors.focusRing,
          outlineStyle: "solid",
        },
      ]}
    >
      {content}
      {/* Hover only: a focus-driven preview collapses on mouse down, moving the row under the pointer so the click misses. */}
      {hoverPreview && inspectable && interaction.hovered ? (
        <Text style={[styles.muted, centered && { textAlign: "center" }]} accessibilityRole="text">
          {dose.record ? savedDoseStatus(dose.record) : ""}{ "\n" }
          Date: {formatCalendarDay(dose.record?.administeredOn)}{ "\n" }
          Clinician: {dose.record?.administeredBy || "Not recorded"}{ "\n" }
          {dose.record?.lotNumber ? `Lot: ${dose.record.lotNumber}\n` : ""}
          Open full details
        </Text>
      ) : null}
    </Pressable>
  );
}
