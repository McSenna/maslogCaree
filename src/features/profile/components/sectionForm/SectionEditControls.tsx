import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

export const SectionEditLink = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Button label="Edit" icon="edit-2" variant="ghost" size="sm" accessibilityLabel={label} onPress={onPress} />
);

export const SectionEditingBadge = () => {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel="Currently editing this section"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        minHeight: 28,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADII.small,
        backgroundColor: colors.primarySoft,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
      <Text maxFontSizeMultiplier={1.3} style={{ ...TYPE.caption, fontWeight: "700", color: colors.primary }}>
        Editing
      </Text>
    </View>
  );
};
