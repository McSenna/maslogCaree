import { Animated, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS, PROFILE_SHADOW } from "../../config/profileTheme";
import Block from "./Block";

const CardSkeleton = ({ rows, opacity }: { rows: number; opacity: Animated.Value }) => {
  return (
    <View
      style={{
        gap: 14,
        padding: 16,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: PROFILE_COLORS.surface,
        borderWidth: 1,
        borderColor: PROFILE_COLORS.border,
        ...PROFILE_SHADOW.card,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Block width={38} height={38} radius={12} opacity={opacity} />
        <Block width="55%" height={16} opacity={opacity} />
      </View>

      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Block width={20} height={20} radius={6} opacity={opacity} />
          <Block width="35%" height={12} opacity={opacity} />
          <View style={{ flex: 1 }} />
          <Block width="28%" height={12} opacity={opacity} />
        </View>
      ))}
    </View>
  );
};

export default CardSkeleton;
