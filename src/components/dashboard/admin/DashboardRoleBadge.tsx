import { Badge } from "@/components/data-table";
import { ROLE_BADGE_TINTS, ROLE_LABELS, ROLE_TEXT_COLORS, roleColorOf } from "@/design/adminDashboardTheme";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { withAlpha } from "@/theme/palette";

type DashboardRoleBadgeProps = {
  role: string;
  palette: AdminDashboardPalette;
  isDark: boolean;
};

/** A role in its own hue. Roles are categories, not states, so the chip carries no icon. */
const DashboardRoleBadge = ({ role, palette, isDark }: DashboardRoleBadgeProps) => {
  const fg = ROLE_TEXT_COLORS[isDark ? "dark" : "light"][role] ?? palette.primary;
  const bg = isDark ? withAlpha(roleColorOf(palette, role), 0.15) : (ROLE_BADGE_TINTS[role] ?? palette.divider);
  return <Badge tone={{ bg, fg }} label={ROLE_LABELS[role] ?? role} spokenAs="Role" />;
};

export default DashboardRoleBadge;
