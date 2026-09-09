import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { describePlatformAccess } from "@/config/platformAccess";
import type { AdminUser } from "@/services/userService";
import { RADIUS, useUsersPalette } from "./usersTheme";

type PlatformAccessBadgeProps = {
  user: Pick<AdminUser, "role" | "platformAccess">;
  size?: "sm" | "md";
};

/**
 * "Web + Mobile" / "Mobile Only" — which clients an account can sign in from.
 *
 * Deliberately informational rather than alarming: a resident being mobile-only
 * is the system working as designed, not an account problem, so it takes the
 * same MaslogCare blue as the rest of the admin surface and never the red the
 * status badge reserves for suspended accounts.
 *
 * The server sends the summary; the local policy table only fills in for a
 * payload that predates the field. Neither is a permission check — both
 * describe a decision the login path has already made.
 */
export default function PlatformAccessBadge({ user, size = "md" }: PlatformAccessBadgeProps) {
  const palette = useUsersPalette();
  const access = user.platformAccess ?? describePlatformAccess(user.role);
  const isSm = size === "sm";

  const tone = palette.isDark
    ? { text: "#93C5FD", bg: "rgba(37,99,235,0.16)" }
    : { text: "#1D4ED8", bg: "#EFF6FF" };

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Platform access: ${access.label}`}
      className={`flex-row items-center self-start ${isSm ? "gap-1 px-2 py-1" : "gap-1.5 px-2.5 py-1.5"}`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      <MaterialCommunityIcons
        name={access.web ? "laptop" : "cellphone"}
        size={isSm ? 12 : 13}
        color={tone.text}
      />
      <Text
        numberOfLines={1}
        className={isSm ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {access.label}
      </Text>
    </View>
  );
}
