import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

// The vaccine column keeps its share of the six age columns at every table width.
const VACCINE_COLUMN_FLEX = 1.88;
const DOSE_CHIP_MAX_WIDTH = 142;

const useScheduleStyles = () => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        table: { borderWidth: 1, borderColor: colors.border, borderRadius: RADII.medium, overflow: "hidden" },
        row: { flexDirection: "row", borderBottomWidth: 1, borderColor: colors.divider },
        rowLast: { borderBottomWidth: 0 },
        rowHeader: { backgroundColor: colors.tableHeader },
        vaccineCell: { flex: VACCINE_COLUMN_FLEX, minWidth: 0, justifyContent: "center", paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
        slotCell: {
          flex: 1,
          minWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          padding: SPACING.sm,
          borderLeftWidth: 1,
          borderColor: colors.divider,
        },
        headerText: { ...TYPE.bodyStrong, color: colors.heading, textAlign: "center" },
        vaccineHeaderText: { ...TYPE.bodyStrong, color: colors.heading },
        vaccineHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
        vaccineName: { ...TYPE.bodyStrong, color: colors.heading, flexShrink: 1 },
        vaccineInfo: { gap: SPACING.xxs, paddingTop: SPACING.xs },
        vaccineInfoText: { ...TYPE.caption, fontWeight: "400", color: colors.body },
        notScheduled: { ...TYPE.body, color: colors.muted },
        chip: {
          width: "100%",
          maxWidth: DOSE_CHIP_MAX_WIDTH,
          alignItems: "center",
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
          borderWidth: 1,
          borderRadius: RADII.small,
        },
        chipCompact: { width: "auto", flexShrink: 1, alignItems: "flex-start" },
        chipCompleted: { backgroundColor: colors.success.bg, borderColor: colors.success.border },
        chipPending: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
        chipHead: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
        chipTitle: { ...TYPE.label, fontWeight: "700", color: colors.heading, flexShrink: 1 },
        chipTitleCompleted: { color: colors.success.fg },
        chipSub: { ...TYPE.caption, fontWeight: "400", color: colors.body },
        chipSubCompleted: { color: colors.success.fg },
        cards: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md },
        card: {
          gap: SPACING.sm,
          padding: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADII.medium,
          backgroundColor: colors.surface,
        },
        cardRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: SPACING.md,
          paddingTop: SPACING.sm,
          borderTopWidth: 1,
          borderColor: colors.divider,
        },
        cardAge: { ...TYPE.bodyStrong, color: colors.body, flexShrink: 1 },
      }),
    [colors],
  );
  return { colors, styles };
};

export default useScheduleStyles;
