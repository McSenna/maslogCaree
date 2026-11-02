import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

const useImmunizationStyles = () => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        page: { flex: 1, backgroundColor: colors.page },
        content: { padding: SPACING.lg, gap: SPACING.xl },
        section: { gap: SPACING.md },
        panel: {
          padding: SPACING.lg,
          gap: SPACING.md,
          backgroundColor: colors.surface,
          borderRadius: RADII.medium,
          borderWidth: 1,
          borderColor: colors.border,
        },
        row: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: SPACING.sm,
          alignItems: "center",
        },
        title: { ...TYPE.headline, color: colors.heading },
        heading: { ...TYPE.title, color: colors.heading },
        body: { ...TYPE.body, color: colors.body, flexShrink: 1 },
        strong: { ...TYPE.bodyStrong, color: colors.heading, flexShrink: 1 },
        muted: { ...TYPE.caption, color: colors.muted, flexShrink: 1 },
        error: { ...TYPE.body, color: colors.danger.fg },
        notice: {
          ...TYPE.body,
          color: colors.warning.fg,
          backgroundColor: colors.warning.bg,
          padding: SPACING.md,
          borderRadius: RADII.small,
        },
        divider: {
          borderBottomWidth: 1,
          borderColor: colors.divider,
          paddingBottom: SPACING.md,
          gap: SPACING.sm,
        },
        cell: { flex: 1, minWidth: 0, padding: SPACING.sm, gap: SPACING.xs },
        ageGroup: { flex: 6, minWidth: 0, padding: SPACING.sm },
        vaccine: { flex: 1, minWidth: 0, padding: SPACING.sm, gap: SPACING.xs },
        tableRow: {
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: colors.divider,
        },
        tableHeader: {
          flexDirection: "row",
          backgroundColor: colors.tableHeader,
        },
        full: { width: "100%" },
        skeleton: {
          height: SPACING.xxl,
          backgroundColor: colors.skeleton,
          borderRadius: RADII.small,
        },
        check: {
          minHeight: 48,
          gap: SPACING.xs,
          padding: SPACING.xs,
          borderRadius: RADII.small,
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.borderStrong,
        },
        checked: {
          borderColor: colors.success.border,
          backgroundColor: colors.success.bg,
        },
        compactRow: { flexDirection: "row", gap: SPACING.sm, alignItems: "center", flexWrap: "nowrap" },
        doseRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs, alignItems: "center" },
        detailFields: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md, alignItems: "flex-start" },
        detailField: { flexGrow: 1, flexBasis: 240, maxWidth: "100%", gap: SPACING.xs },
        historyRow: { padding: SPACING.md, minHeight: 64 },
        grow: { flex: 1, minWidth: 0 },
      }),
    [colors],
  );
  return { colors, styles };
};
export default useImmunizationStyles;
