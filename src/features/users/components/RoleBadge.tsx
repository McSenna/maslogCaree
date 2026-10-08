import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Badge } from "@/components/data-table";
import type { AdminUser } from "@/features/users/services/userService";

import { ROLE_FULL_LABELS, ROLE_ICONS, useUsersPalette } from "./usersTheme";

type Role = AdminUser["role"];

type RoleBadgeProps = {
  role: Role;
  size?: "sm" | "md";
  showIcon?: boolean;
};

/** A role in its own hue, with the role's icon. */
const RoleBadge = ({ role, size = "md", showIcon = true }: RoleBadgeProps) => {
  const palette = useUsersPalette();
  const tone = palette.roles[role] ?? { label: role, text: palette.body, bg: palette.divider };

  return (
    <Badge
      tone={{ bg: tone.bg, fg: tone.text }}
      label={tone.label}
      accessibilityLabel={`Role: ${ROLE_FULL_LABELS[role] ?? tone.label}`}
      size={size}
      renderIcon={
        showIcon ? (color, iconSize) => <MaterialCommunityIcons name={ROLE_ICONS[role] ?? "account-outline"} size={iconSize} color={color} /> : undefined
      }
    />
  );
};

export default RoleBadge;
