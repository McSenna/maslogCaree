import { Pressable, Text, View } from "react-native";
import { RESIDENT_COLORS } from "./residentTheme";

type SectionHeaderProps = {
  title: string;
  /** "View All" / "See More" — omitted where a section has no destination. */
  actionLabel?: string;
  onActionPress?: () => void;
};

/**
 * The `Title ................ View All` line above every dashboard section.
 *
 * Shared so the six sections cannot drift in type size, weight or the position
 * of their trailing link.
 */
const SectionHeader = ({ title, actionLabel, onActionPress }: SectionHeaderProps) => (
  <View className="w-full flex-row items-center justify-between">
    <Text
      accessibilityRole="header"
      className="text-[16px] font-bold"
      style={{ color: RESIDENT_COLORS.heading }}
    >
      {title}
    </Text>

    {actionLabel ? (
      <Pressable
        onPress={onActionPress}
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel}, ${title}`}
        hitSlop={8}
        className="active:opacity-60"
      >
        <Text className="text-[13px] font-semibold" style={{ color: RESIDENT_COLORS.primary }}>
          {actionLabel}
        </Text>
      </Pressable>
    ) : null}
  </View>
);

export default SectionHeader;
