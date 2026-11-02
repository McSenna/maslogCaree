import { StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";

export default function useChecklistGridStyles() {
  const colors = useThemeColors();
  return StyleSheet.create({
    table: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RADII.small,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: colors.divider,
      alignItems: "stretch",
    },
    header: { backgroundColor: colors.tableHeader },
    vaccine: {
      width: 200,
      padding: SPACING.sm,
      justifyContent: "center",
      gap: SPACING.xs,
    },
    slot: {
      flex: 1,
      minWidth: 0,
      padding: SPACING.xs,
      borderLeftWidth: 1,
      borderColor: colors.divider,
      justifyContent: "center",
    },
    slotTitle: { textAlign: "center" },
    group: {
      flex: 6,
      padding: SPACING.sm,
      borderLeftWidth: 1,
      borderColor: colors.divider,
      alignItems: "center",
    },
    mobileDose: {
      flexDirection: "row",
      gap: SPACING.md,
      alignItems: "center",
      justifyContent: "space-between",
    },
    age: { flex: 1, minWidth: 0, gap: SPACING.xs },
    mobileControl: { flex: 1, minWidth: 0 },
  });
}
