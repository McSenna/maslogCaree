import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AdminUser } from "@/services/userService";
import { RADIUS, ROLE_FULL_LABELS, ROLE_ICONS, useUsersPalette } from "./usersTheme";

type Role = AdminUser["role"];

type RoleBadgeProps = {
  role: Role;
  size?: "sm" | "md";
  /** The icon is decorative; drop it where the pill has to stay very narrow. */
  showIcon?: boolean;
};

/**
 * Role identity pill. The same colours and icon are used by the desktop table,
 * the mobile cards and the details panel so a role reads the same everywhere.
 */
export default function RoleBadge({ role, size = "md", showIcon = true }: RoleBadgeProps) {
  const palette = useUsersPalette();
  const tone = palette.roles[role] ?? {
    label: role,
    text: palette.body,
    bg: palette.divider,
  };

  const isSm = size === "sm";

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Role: ${ROLE_FULL_LABELS[role] ?? tone.label}`}
      className={`flex-row items-center self-start ${isSm ? "gap-1 px-2 py-1" : "gap-1.5 px-2.5 py-1.5"}`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      {showIcon ? (
        <MaterialCommunityIcons
          name={ROLE_ICONS[role] ?? "account-outline"}
          size={isSm ? 12 : 14}
          color={tone.text}
        />
      ) : null}
      <Text
        numberOfLines={1}
        className={isSm ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {tone.label}
      </Text>
    </View>
  );
}
