import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { describePlatformAccess } from "@/config/platformAccess";
import type { AdminUser } from "@/features/users/services/userService";
import { RADIUS, useUsersPalette } from "./usersTheme";
import { PALETTE, withAlpha } from "@/theme/palette";

type PlatformAccessBadgeProps = {
  user: Pick<AdminUser, "role" | "platformAccess">;
  size?: "sm" | "md";
};

const PlatformAccessBadge = ({ user, size = "md" }: PlatformAccessBadgeProps) => {
  const palette = useUsersPalette();
  const access = user.platformAccess ?? describePlatformAccess(user.role);
  const isSm = size === "sm";

  const tone = palette.isDark
    ? { text: PALETTE.blue[300], bg: withAlpha(PALETTE.blue[600], 0.16) }
    : { text: PALETTE.blue[700], bg: PALETTE.blue[50] };

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
};

export default PlatformAccessBadge;
