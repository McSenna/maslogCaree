import { Animated, Text } from "react-native";
import { useCountBump } from "@/hooks/useCountBump";
import { BOTTOM_NAV_METRICS, type BottomNavPalette } from "./bottomNavTokens";

type NotificationBadgeProps = {
  count: number;
  palette: BottomNavPalette;
  surface: string;
};

const MAX_COUNT = 99;

const NotificationBadge = ({ count, palette, surface }: NotificationBadgeProps) => {
  const bump = useCountBump(count);
  if (!count || count <= 0) return null;

  const display = count > MAX_COUNT ? `${MAX_COUNT}+` : String(count);
  const isWide = display.length > 1;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        position: "absolute",
        top: -4,
        left: BOTTOM_NAV_METRICS.iconBox - 9,
        minWidth: 15,
        height: 15,
        paddingHorizontal: isWide ? 3 : 0,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: surface,
        backgroundColor: palette.badgeBg,
        alignItems: "center",
        justifyContent: "center",
        ...bump,
      }}
    >
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          fontSize: 8.5,
          lineHeight: 10,
          fontWeight: "700",
          color: palette.badgeText,
        }}
      >
        {display}
      </Text>
    </Animated.View>
  );
};

export default NotificationBadge;
