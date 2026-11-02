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
  onSelect: (dose: DoseView) => void;
};
export default function DoseCell({
  dose,
  vaccine,
  age,
  readOnly,
  disabled = false,
  centered = false,
  onSelect,
}: Props) {
  const { colors, styles } = useImmunizationStyles();
  const completed = isAdministered(dose.record);
  const inspectable = !!dose.record;
  const interactive = !disabled && (!readOnly || inspectable);
  const interaction = useInteractionState({ disabled: !interactive });
  const label = `${vaccine}, ${dose.label}, ${age}, ${completed ? "Administered. View vaccination details" : `${dose.record?.workflowStatus === "draft" ? "Draft. Not administered" : dose.status}. ${inspectable ? "View vaccination details" : "Open administration form"}`}`;
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
        {dose.record?.workflowStatus === "draft" ? "Draft. Not administered" : completed ? "Administered" : dose.status}
      </Text>
      {completed ? (
        <Text style={[styles.muted, centered && { textAlign: "center" }, { color: colors.success.fg }]}>
          {dose.record?.administeredOn?.slice(0, 10)}
        </Text>
      ) : null}
    </>
  );
  const style = [styles.check, completed && styles.checked];
  if (!interactive)
    return (
      <View accessibilityLabel={label} style={style}>
        {content}
      </View>
    );
  return (
    <Pressable
      {...interaction.handlers}
      onPress={() => onSelect(dose)}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={
        inspectable
          ? "View saved details. Editing requires a separate action."
          : `Routine target ${dose.targetOn?.slice(0, 10) || "not set"}.`
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
      {inspectable && (interaction.hovered || interaction.focused) ? (
        <Text style={[styles.muted, centered && { textAlign: "center" }]} accessibilityRole="text">
          {dose.record ? savedDoseStatus(dose.record) : ""}{ "\n" }
          Date: {dose.record?.administeredOn || "Not recorded"}{ "\n" }
          Clinician: {dose.record?.administeredBy || "Not recorded"}{ "\n" }
          Lot: {dose.record?.lotNumber || "Not recorded"}{ "\n" }
          Open full details
        </Text>
      ) : null}
    </Pressable>
  );
}
