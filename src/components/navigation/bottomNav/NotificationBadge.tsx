import { Text, View } from "react-native";
import { BOTTOM_NAV_METRICS, type BottomNavPalette } from "./bottomNavTokens";

type NotificationBadgeProps = {
  /** Unread count. Nothing renders at 0 or below. */
  count: number;
  palette: BottomNavPalette;
  /** Surface the badge is cut out of — used for the contrast ring. */
  surface: string;
};

const MAX_COUNT = 99;

/**
 * Small unread counter pinned to the top-right of a tab icon.
 *
 * Capped at "99+" so a busy inbox can never widen the badge enough to
 * swallow the glyph underneath it.
 */
const NotificationBadge = ({ count, palette, surface }: NotificationBadgeProps) => {
  if (!count || count <= 0) return null;

  const display = count > MAX_COUNT ? `${MAX_COUNT}+` : String(count);
  const isWide = display.length > 1;

  return (
    <View
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
    </View>
  );
};

export default NotificationBadge;
