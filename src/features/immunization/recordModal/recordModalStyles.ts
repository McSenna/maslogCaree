import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { createShadow } from "@/design/shadow";
import { useThemeColors } from "@/hooks/useThemeColors";
import { PALETTE } from "@/theme/palette";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

const MODAL_SHADOW = createShadow({ color: PALETTE.ink, opacity: 0.25, radius: 60, offsetY: 24, elevation: 16 });

const useRecordModalStyles = () => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: { flex: 1, alignItems: "center", backgroundColor: colors.overlay },
        surface: { backgroundColor: colors.surface, borderRadius: RADII.modal, overflow: "hidden", ...MODAL_SHADOW },
        sheet: { flex: 1, width: "100%", backgroundColor: colors.surface },
        header: {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: SPACING.md,
          padding: SPACING.lg,
          paddingLeft: SPACING.xl,
          borderBottomWidth: 1,
          borderColor: colors.divider,
        },
        headerText: { flex: 1, minWidth: 0, gap: SPACING.xs },
        eyebrow: { ...TYPE.caption, fontWeight: "600", letterSpacing: 0.3, color: colors.muted },
        title: { ...TYPE.headline, color: colors.heading },
        subtitle: { ...TYPE.body, color: colors.muted },
        closeButton: { borderRadius: RADII.pill, backgroundColor: colors.neutral.bg },
        scroll: { flexShrink: 1 },
        body: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg, gap: SPACING.lg },
        bodyPhone: { paddingHorizontal: SPACING.lg },
        strip: { flexDirection: "row", borderBottomWidth: 1, borderColor: colors.divider },
        stripStacked: { flexDirection: "column" },
        person: { minWidth: 0, gap: SPACING.sm, paddingVertical: SPACING.md },
        personLeft: { flex: 1, paddingRight: SPACING.lg, borderRightWidth: 1, borderColor: colors.divider },
        personRight: { flex: 1, paddingLeft: SPACING.lg },
        personDivided: { borderTopWidth: 1, borderColor: colors.divider },
        personHead: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: SPACING.sm },
        personName: { ...TYPE.title, color: colors.heading, flexShrink: 1 },
        grow: { flexGrow: 1 },
        meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: SPACING.xs, rowGap: SPACING.xs },
        metaUnruled: { columnGap: SPACING.lg },
        metaItem: { flexDirection: "row", alignItems: "center", gap: SPACING.xs, flexShrink: 1 },
        metaText: { ...TYPE.caption, fontWeight: "400", color: colors.body, flexShrink: 1 },
        metaRule: { ...TYPE.caption, color: colors.subtle },
        tag: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xxs, borderRadius: RADII.small, backgroundColor: colors.primarySoft },
        tagText: { ...TYPE.caption, fontWeight: "700", color: colors.primary },
        chipNeutral: { backgroundColor: colors.neutral.bg },
        chipNeutralText: { ...TYPE.caption, color: colors.neutral.fg },
        link: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: SPACING.xxs, borderRadius: RADII.small },
        linkText: { ...TYPE.label, color: colors.primary },
        tabs: { flexDirection: "row", flexWrap: "wrap", columnGap: SPACING.xs, borderBottomWidth: 1, borderColor: colors.divider },
        tab: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          minHeight: 48,
          paddingHorizontal: SPACING.md,
          borderBottomWidth: 3,
          borderColor: "transparent",
          borderTopLeftRadius: RADII.small,
          borderTopRightRadius: RADII.small,
        },
        tabActive: { borderColor: colors.primary },
        tabHover: { backgroundColor: colors.rowHover },
        tabText: { ...TYPE.body, fontWeight: "500", color: colors.body },
        tabTextActive: { fontWeight: "600", color: colors.primary },
        panel: { gap: SPACING.lg },
        placeholder: {
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.sm,
          padding: SPACING.xxxl,
          borderRadius: RADII.medium,
          backgroundColor: colors.neutral.bg,
        },
        placeholderText: { ...TYPE.bodyStrong, color: colors.neutral.fg },
        visitBar: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: SPACING.sm,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADII.medium,
          backgroundColor: colors.tableHeader,
        },
        visitPart: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: SPACING.sm, flexShrink: 1 },
        visitProgress: { paddingLeft: SPACING.lg, borderLeftWidth: 1, borderColor: colors.border },
        visitText: { ...TYPE.label, fontWeight: "400", color: colors.body, flexShrink: 1 },
        visitLabel: { ...TYPE.label, color: colors.heading },
        footnote: { ...TYPE.caption, fontWeight: "400", color: colors.muted },
        footer: {
          flexDirection: "row",
          gap: SPACING.lg,
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          borderTopWidth: 1,
          borderColor: colors.divider,
        },
        footerPhone: { flexDirection: "column", gap: SPACING.sm, paddingHorizontal: SPACING.lg },
        footerButton: { flexGrow: 1, flexBasis: 0 },
        footerButtonPhone: { flexGrow: 0, flexBasis: "auto" },
      }),
    [colors],
  );
  return { colors, styles };
};

export default useRecordModalStyles;
