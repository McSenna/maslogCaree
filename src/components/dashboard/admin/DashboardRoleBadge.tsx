import { Text, View } from "react-native";
import { ROLE_BADGE_TINTS, ROLE_COLORS, ROLE_LABELS } from "@/design/adminDashboardTheme";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type DashboardRoleBadgeProps = {
  role: string;
  palette: AdminDashboardPalette;
  isDark: boolean;
};

/**
 * Compact role pill used inside the dashboard lists.
 *
 * Kept separate from components/users/RoleBadge so the dashboard's colours stay
 * in step with the donut segments without changing how User Management looks.
 */
export default function DashboardRoleBadge({ role, palette, isDark }: DashboardRoleBadgeProps) {
  const color = ROLE_COLORS[role] ?? palette.primary;
  const label = ROLE_LABELS[role] ?? role;
  const background = isDark ? `${color}26` : ROLE_BADGE_TINTS[role] ?? palette.divider;

  return (
    <View className="self-start rounded-full px-2 py-0.5" style={{ backgroundColor: background }}>
      <Text className="text-[10.5px] font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
