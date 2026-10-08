import { Badge } from "@/components/data-table";
import type { UserStatus } from "@/features/users/services/userService";

import { useUsersPalette } from "./usersTheme";

/** Account status on its tone, with an icon: the users screens' status chip. */
const UserStatusBadge = ({ status, compact = false }: { status: UserStatus; compact?: boolean }) => {
  const palette = useUsersPalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;
  return (
    <Badge tone={{ bg: tone.bg, fg: tone.text }} icon={tone.icon} label={tone.label} spokenAs="Account status" size={compact ? "sm" : "md"} />
  );
};

export default UserStatusBadge;
