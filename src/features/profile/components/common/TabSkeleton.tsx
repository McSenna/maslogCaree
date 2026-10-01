import { useThemeColors } from "@/hooks/useThemeColors";
import { View } from "react-native";
import { RADII } from "@/theme/radius";
import Block from "../skeleton/Block";
import { useShimmer } from "../skeleton/useShimmer";

type TabSkeletonProps = {
  rows?: number;
};

const TabSkeleton = ({ rows = 3 }: TabSkeletonProps) => {
  const colors = useThemeColors();
  const opacity = useShimmer();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading profile content"
      style={{ gap: 12 }}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 14,
            borderRadius: RADII.large,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Block width={38} height={38} radius={19} opacity={opacity} />
          <View style={{ flex: 1, gap: 8 }}>
            <Block width="52%" height={13} opacity={opacity} />
            <Block width="74%" height={11} opacity={opacity} />
          </View>
          <Block width={72} height={22} radius={999} opacity={opacity} />
        </View>
      ))}
    </View>
  );
};

export default TabSkeleton;
