import StatusPill from "@/components/status/StatusPill";
import type { UserStatus } from "@/features/users/services/userService";
import { useUsersPalette } from "./usersTheme";

const UserStatusBadge = ({ status, compact = false }: { status: UserStatus; compact?: boolean }) => {
  const palette = useUsersPalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;
  return (
    <StatusPill label={tone.label} icon={tone.icon} compact={compact} tone={{ bg: tone.bg, fg: tone.text, border: tone.border }} />
  );
};

export default UserStatusBadge;
