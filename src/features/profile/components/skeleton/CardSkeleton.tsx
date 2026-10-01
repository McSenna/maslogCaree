import { Animated, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import Block from "./Block";

/** Placeholder for a section card: a title, then icon-led two-line rows. */
const CardSkeleton = ({ rows, opacity }: { rows: number; opacity: Animated.Value }) => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        gap: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: RADII.large,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Block width="45%" height={18} opacity={opacity} />

      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: SPACING.md }}>
          <Block width={20} height={20} radius={RADII.small} opacity={opacity} />
          <View style={{ flex: 1, gap: SPACING.xs }}>
            <Block width="62%" height={14} opacity={opacity} />
            <Block width="34%" height={11} opacity={opacity} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default CardSkeleton;
